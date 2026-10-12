create table public.admin_invites (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);
alter table public.admin_invites enable row level security;
create policy "admins read invites" on public.admin_invites for select to authenticated using ((select private.is_admin()));
create policy "admins add invites" on public.admin_invites for insert to authenticated with check ((select private.is_admin()));
create policy "admins remove invites" on public.admin_invites for delete to authenticated using ((select private.is_admin()));

create function private.promote_invited_users()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_table_name = 'admin_invites' then
    insert into public.admins (user_id, email)
    select u.id, lower(u.email) from auth.users u where lower(u.email) = new.email
    on conflict do nothing;
  else
    insert into public.admins (user_id, email)
    select new.id, lower(new.email) from public.admin_invites i where i.email = lower(new.email)
    on conflict do nothing;
  end if;
  return new;
end;
$$;
revoke execute on function private.promote_invited_users() from public, anon, authenticated;

create trigger promote_on_invite after insert on public.admin_invites
  for each row execute function private.promote_invited_users();
create trigger promote_on_signup after insert on auth.users
  for each row execute function private.promote_invited_users();

insert into public.admin_invites (email) values ('sourabhsingh2002.rathore@gmail.com') on conflict do nothing;
