create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  image text not null,
  price numeric(10,2) not null check (price >= 0),
  compare_at numeric(10,2) check (compare_at >= 0),
  theme text,
  style text,
  type text not null default 'Stickers',
  in_stock boolean not null default true,
  position int not null,
  created_at timestamptz not null default now(),
  search tsvector generated always as (to_tsvector('simple', title)) stored
);
create index products_position_idx on public.products (position);
create index products_price_idx on public.products (price);
create index products_created_idx on public.products (created_at);
create index products_title_idx on public.products (title);
create index products_theme_idx on public.products (theme);
create index products_style_idx on public.products (style);
create index products_type_idx on public.products (type);
create index products_search_idx on public.products using gin (search);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null,
  email text not null,
  phone text not null,
  name text not null,
  address jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled')),
  cf_order_id text unique,
  cf_payment_id text,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index orders_user_idx on public.orders (user_id, created_at desc);
create index orders_email_idx on public.orders (lower(email));

create table public.order_items (
  order_id uuid not null references public.orders on delete cascade,
  product_id uuid not null references public.products,
  title text not null,
  image text not null,
  price numeric(10,2) not null,
  qty int not null check (qty between 1 and 50),
  primary key (order_id, product_id)
);
create index order_items_product_idx on public.order_items (product_id);

create table public.subscribers (
  email text primary key check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.subscribers enable row level security;

create policy "products are public" on public.products for select to anon, authenticated using (true);
create policy "owners read orders" on public.orders for select to authenticated using (user_id = (select auth.uid()));
create policy "owners read order items" on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = (select auth.uid())));
create policy "anyone subscribes" on public.subscribers for insert to anon, authenticated with check (true);

create function public.facet_counts()
returns table (facet text, value text, count bigint)
language sql stable security invoker set search_path = ''
as $$
  select 'theme', theme, count(*) from public.products where theme is not null group by theme
  union all
  select 'style', style, count(*) from public.products where style is not null group by style
  union all
  select 'type', type, count(*) from public.products group by type
  union all
  select 'availability', case when in_stock then 'In stock' else 'Out of stock' end, count(*) from public.products group by in_stock
  order by 1, 2
$$;
