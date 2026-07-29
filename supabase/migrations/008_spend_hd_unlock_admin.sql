-- Admin-privileged HD unlock spend, keyed by target_user_id directly
-- instead of auth.uid(). Run in Supabase SQL Editor after 001-007.
--
-- public.spend_hd_unlock() (from 001) relies on auth.uid(), which is only
-- set for a request made with a real user session/JWT. When called from a
-- service-role (admin) client — e.g. the /api/mark-photo-unlocked fallback
-- path, which only runs if the user-scoped RPC unexpectedly failed —
-- auth.uid() is null and the RPC always raises NOT_AUTHENTICATED. This
-- function lets that admin fallback still correctly deduct a token instead
-- of silently granting a free unlock whenever the primary path fails.
create or replace function public.spend_hd_unlock_admin(target_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining integer;
begin
  update public.profiles
  set
    hd_unlocks = hd_unlocks - 1,
    updated_at = now()
  where id = target_user_id
    and hd_unlocks > 0
  returning hd_unlocks into remaining;

  -- null (not an exception) when there was no token to spend, so callers
  -- can distinguish "spent successfully" from "nothing available to spend".
  return remaining;
end;
$$;

revoke all on function public.spend_hd_unlock_admin(uuid) from public;
grant execute on function public.spend_hd_unlock_admin(uuid) to service_role;
