-- Fix a race between the Stripe webhook and the client-triggered
-- /api/mark-photo-unlocked call, both of which mark a purchased
-- generation_id unlocked after a `unlock_photo` payment.
--
-- Previously the webhook unconditionally upserted into unlocked_photos
-- with NO token spend, while mark-photo-unlocked spent a token. Whichever
-- ran first "won" (inserted the row first), so the other one always saw
-- already_unlocked=true and skipped its own logic. Once the webhook
-- started firing reliably (fast, server-to-server) it almost always won
-- this race — meaning the token that was just granted for that purchase
-- was never spent, silently banking a free extra hd_unlock every time.
--
-- Fix: give both callers ONE atomic, admin-callable function that claims
-- the (user, generation) pair via an INSERT-first pattern (the unique
-- constraint on unlocked_photos means only one concurrent caller can ever
-- actually insert a new row) and only the winner of that insert spends a
-- token. This is safe under true concurrency, unlike a "check, then act"
-- pattern which both callers could pass simultaneously and double-spend.
--
-- Run in Supabase SQL Editor after 001-008.

create or replace function public.unlock_generation_admin(
  target_user_id uuid,
  p_generation_id text,
  p_source text default 'payment',
  p_require_token boolean default true
)
returns table (
  already_unlocked boolean,
  out_hd_unlocks integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
  claimed_id uuid;
begin
  if target_user_id is null then
    raise exception 'INVALID_USER_ID';
  end if;
  if p_generation_id is null or length(trim(p_generation_id)) = 0 then
    raise exception 'INVALID_GENERATION_ID';
  end if;

  -- Claim the (user, generation) pair FIRST. Only the transaction that
  -- actually inserts a row "wins" — concurrent callers racing for the same
  -- pair get zero rows back from this statement, so they never spend.
  insert into public.unlocked_photos (user_id, generation_id, source)
  values (target_user_id, p_generation_id, coalesce(nullif(p_source, ''), 'payment'))
  on conflict (user_id, generation_id) do nothing
  returning id into claimed_id;

  if claimed_id is null then
    select hd_unlocks into remaining from public.profiles where id = target_user_id;
    already_unlocked := true;
    out_hd_unlocks := coalesce(remaining, 0);
    return next;
    return;
  end if;

  -- We won the claim — spend exactly one token for it.
  if p_require_token then
    update public.profiles
    set hd_unlocks = hd_unlocks - 1, updated_at = now()
    where id = target_user_id and hd_unlocks > 0
    returning hd_unlocks into remaining;

    if remaining is null then
      -- Won the claim but the bank was empty (should be rare — this path
      -- only runs post-payment). Keep the unlock (already paid for) but
      -- report the real, unspent balance so it's visible in logs/metrics.
      select hd_unlocks into remaining from public.profiles where id = target_user_id;
      remaining := coalesce(remaining, 0);
    end if;
  else
    select hd_unlocks into remaining from public.profiles where id = target_user_id;
    remaining := coalesce(remaining, 0);
  end if;

  already_unlocked := false;
  out_hd_unlocks := remaining;
  return next;
end;
$$;

revoke all on function public.unlock_generation_admin(uuid, text, text, boolean) from public;
grant execute on function public.unlock_generation_admin(uuid, text, text, boolean) to service_role;

-- Also close the same theoretical "check, then act" race in the
-- user-scoped RPC (used by /api/download-hd and mark-photo-unlocked's
-- primary attempt) by switching it to the same insert-first pattern.
create or replace function public.unlock_generation_idempotent(
  p_generation_id text,
  p_source text default 'token',
  p_require_token boolean default true
)
returns table (
  already_unlocked boolean,
  out_hd_unlocks integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;
  if p_generation_id is null or length(trim(p_generation_id)) = 0 then
    raise exception 'INVALID_GENERATION_ID';
  end if;

  return query
  select * from public.unlock_generation_admin(uid, p_generation_id, p_source, p_require_token);
end;
$$;

revoke all on function public.unlock_generation_idempotent(text, text, boolean) from public;
grant execute on function public.unlock_generation_idempotent(text, text, boolean) to authenticated;
grant execute on function public.unlock_generation_idempotent(text, text, boolean) to service_role;
