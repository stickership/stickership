alter table public.products add column images text[] not null default '{}' check (cardinality(images) <= 8);
