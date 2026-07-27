-- Patch: single-photo purchase must NOT bank hd_unlocks (prevent double allocation).
-- Bonus preview credits only. Run in Supabase SQL Editor if you already applied 001.

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
