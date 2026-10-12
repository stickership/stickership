create schema if not exists private;
grant usage on schema private to authenticated;

create table public.admins (
  user_id uuid primary key references auth.users on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create function private.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()))
$$;
revoke execute on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create policy "admins read admins" on public.admins for select to authenticated using ((select private.is_admin()));
create policy "admins add admins" on public.admins for insert to authenticated with check ((select private.is_admin()));
create policy "admins remove admins" on public.admins for delete to authenticated using ((select private.is_admin()) and user_id <> (select auth.uid()));

create policy "admins insert products" on public.products for insert to authenticated with check ((select private.is_admin()));
create policy "admins update products" on public.products for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete products" on public.products for delete to authenticated using ((select private.is_admin()));

create policy "admins read orders" on public.orders for select to authenticated using ((select private.is_admin()));
create policy "admins update orders" on public.orders for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins read order items" on public.order_items for select to authenticated using ((select private.is_admin()));

create policy "admins read subscribers" on public.subscribers for select to authenticated using ((select private.is_admin()));
create policy "admins delete subscribers" on public.subscribers for delete to authenticated using ((select private.is_admin()));

alter table public.orders drop constraint orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in ('pending', 'paid', 'shipped', 'delivered', 'failed', 'cancelled'));
alter table public.orders
  add column courier text,
  add column tracking_no text,
  add column shipped_at timestamptz,
  add column delivered_at timestamptz;
create index orders_status_created_idx on public.orders (status, created_at desc);
create index subscribers_created_idx on public.subscribers (created_at desc);

create function public.admin_stats()
returns jsonb
language sql stable security invoker set search_path = ''
as $$
  with paid as (
    select * from public.orders where status in ('paid', 'shipped', 'delivered')
  )
  select jsonb_build_object(
    'revenue_today', coalesce((select sum(total) from paid where created_at >= date_trunc('day', now())), 0),
    'revenue_7d', coalesce((select sum(total) from paid where created_at >= now() - interval '7 days'), 0),
    'revenue_30d', coalesce((select sum(total) from paid where created_at >= now() - interval '30 days'), 0),
    'orders_today', (select count(*) from paid where created_at >= date_trunc('day', now())),
    'orders_7d', (select count(*) from paid where created_at >= now() - interval '7 days'),
    'orders_30d', (select count(*) from paid where created_at >= now() - interval '30 days'),
    'to_ship', (select count(*) from public.orders where status = 'paid'),
    'products', (select count(*) from public.products),
    'out_of_stock', (select count(*) from public.products where not in_stock),
    'subscribers', (select count(*) from public.subscribers),
    'top', coalesce((
      select jsonb_agg(t) from (
        select oi.title, sum(oi.qty) as qty, sum(oi.qty * oi.price) as revenue
        from public.order_items oi join paid o on o.id = oi.order_id
        where o.created_at >= now() - interval '30 days'
        group by oi.title order by qty desc limit 5
      ) t
    ), '[]'::jsonb)
  )
$$;

create function public.admin_customers(q text default '', lim int default 50, off int default 0)
returns table (email text, name text, phone text, orders bigint, spent numeric, last_order timestamptz)
language sql stable security invoker set search_path = ''
as $$
  select lower(o.email), max(o.name), max(o.phone), count(*), sum(o.total), max(o.created_at)
  from public.orders o
  where o.status in ('paid', 'shipped', 'delivered')
    and (q = '' or o.email ilike '%' || q || '%' or o.name ilike '%' || q || '%')
  group by lower(o.email)
  order by max(o.created_at) desc
  limit least(lim, 200) offset greatest(off, 0)
$$;

revoke execute on function public.admin_stats() from public, anon;
revoke execute on function public.admin_customers(text, int, int) from public, anon;
grant execute on function public.admin_stats() to authenticated;
grant execute on function public.admin_customers(text, int, int) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 5242880, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

create policy "admins upload product images" on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and (select private.is_admin()));
create policy "admins update product images" on storage.objects for update to authenticated
  using (bucket_id = 'products' and (select private.is_admin()));
create policy "admins delete product images" on storage.objects for delete to authenticated
  using (bucket_id = 'products' and (select private.is_admin()));
