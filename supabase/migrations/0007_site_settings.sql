create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "settings are public" on public.site_settings for select to anon, authenticated using (true);
create policy "admins insert settings" on public.site_settings for insert to authenticated with check ((select private.is_admin()));
create policy "admins update settings" on public.site_settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

insert into public.site_settings (key, value) values (
  'hero',
  '{"badge":"Waterproof vinyl · ships in 24h","line1":"slap it","line2":"for","highlight":"₹10","subtitle":"Anime, memes, cats, chaos. Drag a few onto the laptop to test your vibe, then grab the whole setup in one tap.","cta":"Shop all stickers"}'
) on conflict (key) do nothing;
