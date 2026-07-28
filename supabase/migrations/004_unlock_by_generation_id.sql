-- Unlock is per AI generation output, NOT per upload session / source photo.
-- Run in Supabase SQL Editor after 003_unlocked_photos.sql.
--
-- Every successful "Generate" creates a unique generation_id.
-- Paying once (or spending one HD token) unlocks ONLY that generation.
-- Editing + regenerating requires a new unlock.

-- 1) Rename photo_id → generation_id (idempotent)
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

-- Ensure table exists for fresh installs that skipped 003 naming
create table if not exists public.unlocked_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  generation_id text not null,
  source text not null default 'token'
    check (source in ('token', 'payment')),
  created_at timestamptz not null default now(),
  unique (user_id, generation_id)
);

-- Recreate unique constraint under the new column name if needed
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

-- 2) Idempotent unlock keyed by generation_id
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

-- Back-compat wrapper: old clients/RPC name still work, but unlock by generation id.
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
