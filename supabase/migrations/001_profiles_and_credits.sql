-- ============================================================
-- AI Studio ID — profiles + preview_credits + hd_unlocks
-- Copy this ENTIRE file into Supabase → SQL Editor → Run
-- ============================================================

-- 1) Base table (safe if it already exists)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Add new balance columns
alter table public.profiles
  add column if not exists preview_credits integer;

alter table public.profiles
  add column if not exists hd_unlocks integer;

-- 3) Migrate legacy "credits" column if present
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'credits'
  ) then
    update public.profiles
    set
      preview_credits = coalesce(preview_credits, credits, 5),
      hd_unlocks = coalesce(hd_unlocks, 0);
    alter table public.profiles drop column credits;
  end if;
end $$;

-- 4) Fill nulls, then enforce defaults / NOT NULL
update public.profiles
set
  preview_credits = coalesce(preview_credits, 5),
  hd_unlocks = coalesce(hd_unlocks, 0);

alter table public.profiles
  alter column preview_credits set default 5;

alter table public.profiles
  alter column hd_unlocks set default 0;

alter table public.profiles
  alter column preview_credits set not null;

alter table public.profiles
  alter column hd_unlocks set not null;

-- 5) RLS
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- 6) Auto-create profile on first signup (5 preview credits, 0 HD unlocks)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, preview_credits, hd_unlocks)
  values (new.id, new.email, 5, 0)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 7) Spend 1 preview credit after successful AI generation
create or replace function public.deduct_preview_credit()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  update public.profiles
  set
    preview_credits = preview_credits - 1,
    updated_at = now()
  where id = auth.uid()
    and preview_credits > 0
  returning preview_credits into remaining;

  if remaining is null then
    raise exception 'NO_PREVIEW_CREDITS';
  end if;

  return remaining;
end;
$$;

revoke all on function public.deduct_preview_credit() from public;
grant execute on function public.deduct_preview_credit() to authenticated;

-- 8) Spend 1 HD unlock before clean download
create or replace function public.spend_hd_unlock()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  if auth.uid() is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  update public.profiles
  set
    hd_unlocks = hd_unlocks - 1,
    updated_at = now()
  where id = auth.uid()
    and hd_unlocks > 0
  returning hd_unlocks into remaining;

  if remaining is null then
    raise exception 'NO_HD_UNLOCKS';
  end if;

  return remaining;
end;
$$;

revoke all on function public.spend_hd_unlock() from public;
grant execute on function public.spend_hd_unlock() to authenticated;

-- 9) Stripe unlock pack: bonus preview credits ONLY (no hd_unlocks bank).
-- HD access for the purchased photo is granted via payment verification + success download.
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
    preview_credits = p.preview_credits + 5,
    updated_at = now()
  where p.id = target_user_id
  returning p.preview_credits, p.hd_unlocks
  into result_preview, result_hd;

  if not found then
    insert into public.profiles (id, preview_credits, hd_unlocks)
    values (target_user_id, 5, 0)
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

-- 10) Backfill existing auth users
insert into public.profiles (id, email, preview_credits, hd_unlocks)
select id, email, 5, 0
from auth.users
on conflict (id) do nothing;

-- 11) Drop legacy RPCs if they exist
drop function if exists public.deduct_credit();
drop function if exists public.add_credits(uuid, integer);
