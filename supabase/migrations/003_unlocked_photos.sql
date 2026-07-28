-- Unlocked photos: one-time unlock per user + photo_id, infinite re-downloads.
-- Run in Supabase SQL Editor after 001/002.

create table if not exists public.unlocked_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_id text not null,
  source text not null default 'token'
    check (source in ('token', 'payment')),
  created_at timestamptz not null default now(),
  unique (user_id, photo_id)
);

create index if not exists unlocked_photos_user_id_idx
  on public.unlocked_photos (user_id);

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

-- Idempotent unlock: if already unlocked, return remaining hd_unlocks without deducting.
-- If not unlocked, spend 1 hd_unlock (when require_token), then insert the unlock row.
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
declare
  uid uuid := auth.uid();
  remaining integer;
begin
  if uid is null then
    raise exception 'NOT_AUTHENTICATED';
  end if;

  if p_photo_id is null or length(trim(p_photo_id)) = 0 then
    raise exception 'INVALID_PHOTO_ID';
  end if;

  if exists (
    select 1
    from public.unlocked_photos
    where user_id = uid and photo_id = p_photo_id
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

  insert into public.unlocked_photos (user_id, photo_id, source)
  values (uid, p_photo_id, coalesce(nullif(p_source, ''), 'token'))
  on conflict (user_id, photo_id) do nothing;

  already_unlocked := false;
  out_hd_unlocks := remaining;
  return next;
end;
$$;

revoke all on function public.unlock_photo_idempotent(text, text, boolean) from public;
grant execute on function public.unlock_photo_idempotent(text, text, boolean) to authenticated;
grant execute on function public.unlock_photo_idempotent(text, text, boolean) to service_role;
