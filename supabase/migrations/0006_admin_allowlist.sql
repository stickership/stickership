create or replace function private.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users
    where id = (select auth.uid())
      and email_confirmed_at is not null
      and lower(email) in ('sourabh52.singh@gmail.com', 'stickershipindia@gmail.com')
  )
$$;

drop trigger if exists promote_on_signup on auth.users;
drop trigger if exists promote_on_invite on public.admin_invites;
drop function if exists private.promote_invited_users();
drop table if exists public.admin_invites;
drop table if exists public.admins;
