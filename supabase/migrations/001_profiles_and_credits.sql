-- Profiles + free-credit bootstrap for AI Studio ID.
-- Run this in the Supabase SQL editor (or via supabase db push).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  credits integer not null default 2 check (credits >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Intentionally no UPDATE policy for authenticated users.
-- Credits may only change via security-definer RPCs (deduct_credit / add_credits).

-- Auto-create a profile with 2 free credits on first Google (or any) login.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, credits)
  values (new.id, new.email, 2)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomically spend 1 credit. Returns remaining credits, or raises NO_CREDITS.
create or replace function public.deduct_credit()
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
  set credits = credits - 1,
      updated_at = now()
  where id = auth.uid()
    and credits > 0
  returning credits into remaining;

  if remaining is null then
    raise exception 'NO_CREDITS';
  end if;

  return remaining;
end;
$$;

revoke all on function public.deduct_credit() from public;
grant execute on function public.deduct_credit() to authenticated;

-- Grant credits after a successful Stripe payment (called with service role).
create or replace function public.add_credits(target_user_id uuid, amount integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  if amount is null or amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  update public.profiles
  set credits = credits + amount,
      updated_at = now()
  where id = target_user_id
  returning credits into remaining;

  if remaining is null then
    insert into public.profiles (id, credits)
    values (target_user_id, amount)
    returning credits into remaining;
  end if;

  return remaining;
end;
$$;

revoke all on function public.add_credits(uuid, integer) from public;
grant execute on function public.add_credits(uuid, integer) to service_role;

-- Backfill profiles for users who signed up before this migration was applied.
insert into public.profiles (id, email, credits)
select id, email, 2
from auth.users
on conflict (id) do nothing;
