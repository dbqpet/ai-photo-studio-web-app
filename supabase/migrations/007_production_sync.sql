-- ============================================================
-- PRODUCTION SYNC — run this once in the SQL Editor of the
-- Supabase project your LIVE Vercel deployment points to
-- (Project Settings → the URL matching NEXT_PUBLIC_SUPABASE_URL
-- in your Vercel environment variables).
--
-- Safe to run any number of times, and safe even if some of
-- 002-006 were already partially applied — every statement is
-- idempotent (create-if-not-exists / create-or-replace). This
-- consolidates 002 + 003 + 004 + 005 + 006 into one script so a
-- database that only ever had 001 applied gets fully caught up.
--
-- Fixes, if missing on the target project:
--   1) New signups getting 5 preview credits instead of 3.
--   2) Purchases not banking +1 hd_unlock (old grant_unlock_pack
--      only ever touched preview_credits).
--   3) generation_id-based unlock RPC missing entirely, which
--      makes /api/mark-photo-unlocked and /api/download-hd fail
--      after a real payment — the same failure also blocks the
--      auto-download, since it depends on that unlock succeeding.
--   4) Missing idempotency ledger for Stripe sessions.
-- ============================================================

-- 1) New signups start with 3 preview credits (was 5).
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 2) Every purchase ($4.99) grants +3 preview_credits AND +1 hd_unlock.
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

-- 3) unlocked_photos table, keyed by generation_id (not the source photo),
-- created fresh OR renamed from a legacy photo_id-keyed table.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'unlocked_photos'
      and column_name = 'photo_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'unlocked_photos'
      and column_name = 'generation_id'
  ) then
    alter table public.unlocked_photos rename column photo_id to generation_id;
  end if;
end $$;

create table if not exists public.unlocked_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  generation_id text not null,
  source text not null default 'token'
    check (source in ('token', 'payment')),
  created_at timestamptz not null default now(),
  unique (user_id, generation_id)
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'unlocked_photos_user_id_generation_id_key'
      and conrelid = 'public.unlocked_photos'::regclass
  ) then
    begin
      alter table public.unlocked_photos
        add constraint unlocked_photos_user_id_generation_id_key
        unique (user_id, generation_id);
    exception
      when duplicate_object then null;
      when unique_violation then null;
    end;
  end if;
end $$;

create index if not exists unlocked_photos_user_id_idx
  on public.unlocked_photos (user_id);
create index if not exists unlocked_photos_generation_id_idx
  on public.unlocked_photos (generation_id);

alter table public.unlocked_photos enable row level security;

drop policy if exists "Users can read own unlocked photos" on public.unlocked_photos;
create policy "Users can read own unlocked photos"
  on public.unlocked_photos
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own unlocked photos" on public.unlocked_photos;
create policy "Users can insert own unlocked photos"
  on public.unlocked_photos
  for insert
  with check (auth.uid() = user_id);

-- 4) Idempotent unlock keyed by generation_id (what mark-photo-unlocked and
-- download-hd actually call).
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
  remaining integer;
begin
  if uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  if p_generation_id is null or length(trim(p_generation_id)) = 0 then
    raise exception 'INVALID_GENERATION_ID';
  end if;

  if exists (
    select 1
    from public.unlocked_photos
    where user_id = uid and generation_id = p_generation_id
  ) then
    select hd_unlocks into remaining
    from public.profiles
    where id = uid;

    already_unlocked := true;
    out_hd_unlocks := coalesce(remaining, 0);
    return next;
    return;
  end if;

  if p_require_token then
    update public.profiles
    set
      hd_unlocks = hd_unlocks - 1,
      updated_at = now()
    where id = uid
      and hd_unlocks > 0
    returning hd_unlocks into remaining;

    if remaining is null then
      raise exception 'NO_HD_UNLOCKS';
    end if;
  else
    select hd_unlocks into remaining
    from public.profiles
    where id = uid;
    remaining := coalesce(remaining, 0);
  end if;

  insert into public.unlocked_photos (user_id, generation_id, source)
  values (uid, p_generation_id, coalesce(nullif(p_source, ''), 'token'))
  on conflict (user_id, generation_id) do nothing;

  already_unlocked := false;
  out_hd_unlocks := remaining;
  return next;
end;
$$;

-- Back-compat wrapper: old clients/RPC name still work, unlocking by generation id.
create or replace function public.unlock_photo_idempotent(
  p_photo_id text,
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
begin
  return query
  select *
  from public.unlock_generation_idempotent(p_photo_id, p_source, p_require_token);
end;
$$;

revoke all on function public.unlock_generation_idempotent(text, text, boolean) from public;
grant execute on function public.unlock_generation_idempotent(text, text, boolean) to authenticated;
grant execute on function public.unlock_generation_idempotent(text, text, boolean) to service_role;

revoke all on function public.unlock_photo_idempotent(text, text, boolean) from public;
grant execute on function public.unlock_photo_idempotent(text, text, boolean) to authenticated;
grant execute on function public.unlock_photo_idempotent(text, text, boolean) to service_role;

-- 5) Idempotency ledger for Stripe checkout sessions (webhook + client
-- verify-payment fallback both call grant-once through this table).
create table if not exists public.processed_stripe_sessions (
  session_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.processed_stripe_sessions enable row level security;

-- ============================================================
-- Verify — run this SELECT after the script above to confirm the
-- target project is now fully caught up. Expected: default_credits=3,
-- grants_hd_unlock=true, has_generation_unlock_fn=true,
-- has_processed_sessions_table=true.
-- ============================================================
select
  (select column_default from information_schema.columns
     where table_schema = 'public' and table_name = 'profiles'
       and column_name = 'preview_credits') as default_credits,
  (select prosrc ilike '%hd_unlocks%' from pg_proc
     where proname = 'grant_unlock_pack' limit 1) as grants_hd_unlock,
  exists (
    select 1 from pg_proc where proname = 'unlock_generation_idempotent'
  ) as has_generation_unlock_fn,
  exists (
    select 1 from information_schema.tables
      where table_schema = 'public' and table_name = 'processed_stripe_sessions'
  ) as has_processed_sessions_table;
