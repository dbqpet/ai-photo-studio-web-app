-- Update credit grants: 3 initial preview credits (was 5), and every
-- purchase ($4.99) now banks +1 hd_unlock in addition to +3 preview_credits.
-- Run in Supabase SQL Editor after 001-004.

-- 1) New signups start with 3 preview credits instead of 5.
alter table public.profiles
  alter column preview_credits set default 3;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, preview_credits, hd_unlocks)
  values (new.id, new.email, 3, 0)
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2) Every purchase grants +3 preview_credits AND +1 hd_unlock (banked),
-- regardless of whether it was a top-up pack or a single-photo unlock.
-- Instant unlock of the specific generation_id is still recorded separately
-- in unlocked_photos by the webhook / mark-photo-unlocked route.
create or replace function public.grant_unlock_pack(target_user_id uuid)
returns table (out_preview_credits integer, out_hd_unlocks integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  result_preview integer;
  result_hd integer;
begin
  update public.profiles as p
  set
    preview_credits = p.preview_credits + 3,
    hd_unlocks = p.hd_unlocks + 1,
    updated_at = now()
  where p.id = target_user_id
  returning p.preview_credits, p.hd_unlocks
  into result_preview, result_hd;

  if not found then
    insert into public.profiles (id, preview_credits, hd_unlocks)
    values (target_user_id, 3, 1)
    returning preview_credits, hd_unlocks
    into result_preview, result_hd;
  end if;

  out_preview_credits := result_preview;
  out_hd_unlocks := coalesce(result_hd, 0);
  return next;
end;
$$;

revoke all on function public.grant_unlock_pack(uuid) from public;
grant execute on function public.grant_unlock_pack(uuid) to service_role;
