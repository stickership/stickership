# Stickership Commerce — Design

Date: 2026-10-12 · Status: approved in chat, pending spec review

## Goal
Turn the static stickership clone into a launchable store: every visible button works, data lives in Supabase, payments via Cashfree. Keep the existing UI.

## Decisions (from user)
- Build on current clone (no external ecommerce repo).
- Payments: **Cashfree PG** (sandbox first).
- Supabase: user's cloud project; keys in `.env.local` (never committed).
- Auth: guest checkout; optional Supabase email OTP login.

## Assumptions
- INR only. No product variants. Flat shipping: ₹49, free at ≥ ₹299 subtotal.
- No admin UI — products edited in Supabase table editor.
- No coupons, no inventory counts (only `in_stock` boolean), no custom emails.

## Stack
Next.js 16 App Router (existing), `@supabase/ssr` + `@supabase/supabase-js`, Cashfree PG REST API `x-api-version: 2023-08-01` + Cashfree JS SDK v3 (loaded from `https://sdk.cashfree.com/js/v3/cashfree.js`). No other deps.

## Env vars
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only: order writes, webhook
CASHFREE_APP_ID=
CASHFREE_SECRET_KEY=
CASHFREE_ENV=sandbox              # sandbox | production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ORDER_TOKEN_SECRET=               # random 32+ chars; signs guest order links
```
`.env.example` committed with blanks.

## Data model (Supabase migration `supabase/migrations/0001_commerce.sql`)

```
products
  id uuid pk default gen_random_uuid()
  slug text unique not null
  title text not null
  image text not null                 -- /products/N.jpg
  price numeric(10,2) not null check (price >= 0)
  compare_at numeric(10,2)
  theme text, style text, type text   -- facet values
  in_stock boolean not null default true
  position int not null               -- "Featured" order
  created_at timestamptz default now()
  search tsvector generated always as (to_tsvector('simple', title)) stored
  indexes: (position), (price), (theme), (style), (type), gin(search)

orders
  id uuid pk default gen_random_uuid()
  user_id uuid null references auth.users on delete set null
  email text not null, phone text not null
  name text not null, address jsonb not null   -- {line1,line2,city,state,pincode}
  subtotal numeric(10,2) not null, shipping numeric(10,2) not null, total numeric(10,2) not null
  status text not null default 'pending' check (status in ('pending','paid','failed','cancelled'))
  cf_order_id text unique, cf_payment_id text
  created_at timestamptz default now(), paid_at timestamptz
  indexes: (user_id, created_at desc), (email)

order_items
  order_id uuid references orders on delete cascade
  product_id uuid references products
  title text not null, image text not null, price numeric(10,2) not null, qty int not null check (qty between 1 and 50)
  pk (order_id, product_id)

subscribers
  email text pk check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
  created_at timestamptz default now()
```

RLS:
- `products`: enable; `select` for anon+authenticated. No write policies.
- `orders`, `order_items`: enable; `select` where `user_id = auth.uid()` (and items via parent). All writes via service role on server only.
- `subscribers`: enable; `insert` for anon (on conflict do nothing handled in action). No select.

Seed: `supabase/seed.sql` generated from `src/data/products.ts` by `scripts/seed.mjs` (slug from title, dedupe with suffix; theme/style/type guessed by keyword rules, e.g. "Mystery Box" → type Mystery Box, "Holographic" → Holographic stickers, "Glitter" → Glitter Stickers, else Stickers). `src/data/products.ts` deleted after seeding.

## Units

| Unit | File(s) | Responsibility |
|---|---|---|
| Supabase clients | `src/lib/supabase/server.ts`, `client.ts`, `admin.ts` | cookie-aware server client, browser client, service-role client (server-only) |
| Catalog queries | `src/lib/catalog.ts` | `listProducts({theme,style,availability,type,sort,page})`, `getProduct(slug)`, `searchProducts(q)`, `facetCounts()` |
| Cart store | `src/lib/cart.ts` | client-only: `useCart()` via `useSyncExternalStore` over localStorage `{productId, slug, title, image, price, qty}[]`; add/update/remove/clear; cross-tab sync via `storage` event |
| Cashfree | `src/lib/cashfree.ts` | `createCfOrder(order)`, `getCfOrder(id)`, `verifyWebhook(rawBody, ts, sig)` (HMAC-SHA256 base64 of `ts + rawBody` with secret, `timingSafeEqual`) |
| Checkout action | `src/app/checkout/actions.ts` | validate input; re-price items from DB; reject out-of-stock; compute shipping; insert order+items (service role); create Cashfree order (`order_id` = our uuid, `return_url` = `/orders/{id}?cf=1`); return `payment_session_id` |
| Webhook | `src/app/api/cashfree/webhook/route.ts` | verify signature; on `PAYMENT_SUCCESS_WEBHOOK` set `paid` only if currently `pending` (idempotent `update ... where status='pending'`); on failure set `failed` |
| Return reconciliation | `/orders/[id]` | if `?cf=1` and order pending, server calls `getCfOrder`; `order_status=PAID` → mark paid (same idempotent update). Covers missed webhooks |

## Pages / UI wiring

| UI element | Behavior |
|---|---|
| Collection `/` | Server component reads `searchParams` → `listProducts`. Grid gets first page from server; infinite scroll fetches next pages via server action `loadMore(params, page)` (24/page). |
| Filter dropdowns | Checkbox change → `router.replace` with updated query (`theme=a,b`). Counts from `facetCounts()` (cached 60s via `unstable_cache`/`revalidate`). "Reset" clears that facet. |
| Sort select | `?sort=` featured(position)/best(position)/az/za/price-asc/price-desc/old/new. |
| Search icon | Opens modal; debounced 250ms query → server action `searchProducts` (limit 8) → links to PDP. |
| Card click / eye | Card → `/products/[slug]`. Eye → same PDP. |
| Add to cart (card/PDP) | `cart.add` + open cart drawer. |
| PDP `/products/[slug]` | Image, title, prices, qty stepper (1–50), Add to cart, Buy now (add + go to checkout). `notFound()` for bad slug. |
| Header cart | Bubble = item count, subtotal live; click opens drawer (qty ±, remove, subtotal, shipping note, Checkout button). |
| Account icon | Logged out → `/login` (email → OTP code → verify). Logged in → `/account` (orders list, sign out). |
| Mobile menu | Drawer: Shop, Track order, Our story, Contact, FAQ, Login/Account. |
| Mobile "Filter and sort" bar | Opens bottom sheet with same facets + sort. |
| `/checkout` | Client form (email, phone, name, address, pincode 6 digits) + order summary; submit → action → Cashfree SDK `checkout({paymentSessionId, redirectTarget:"_self"})`. Prefills email when logged in. Empty cart → redirect `/`. |
| `/orders/[id]` | Order status page; access if owner OR `?t=` equals HMAC-SHA256(order id, ORDER_TOKEN_SECRET) hex (token included in return_url and track redirect). Clears cart when paid. |
| Track order `/track` | Form: order ID + email → server lookup (service role, match both) → redirect to `/orders/[id]?t=`. Generic error on mismatch. |
| Newsletter | Server action → upsert `subscribers`; inline success/error message. |
| Footer/info links | Static pages: `/pages/[slug]` for our-story, faq, terms, privacy, refund, shipping, bulk-orders, contact (content in one `src/data/pages.ts`). Blog link removed. Collection links (Mini sheets, Laptop/Credit card skins) → `/?type=...`. |
| Social icons | Hidden until user provides URLs. |

## Error handling
- Server action validation errors → returned `{error}` shown inline; never throw raw.
- Cashfree API failure → order stays `pending`, user sees "Payment couldn't start, try again"; retry creates new CF session for same order (CF `order_id` = `${uuid}-${attempt}` stored in `cf_order_id`).
- Webhook: bad signature → 401; unknown order → 200 (ack, log); DB error → 500 so Cashfree retries.
- Route-level `error.tsx` for `/`, `/products/[slug]`, `/checkout`, `/orders/[id]`.

## Security / scale
- Prices, totals, stock always computed server-side from DB.
- Service role key only imported in `server-only` modules.
- Checkout + newsletter + track: basic rate limit by IP (in-memory token bucket per instance; `ponytail:` note → upgrade to Upstash/KV if abused).
- Paginated queries everywhere; indexes above cover filters/sort.
- Webhook raw body read via `req.text()` before JSON parse.

## Testing
- `scripts/check-webhook.mjs`: asserts `verifyWebhook` accepts a correctly signed payload and rejects tampered body/timestamp (payments path).
- Manual E2E in Cashfree sandbox: add 2 items → checkout → pay with test card/UPI → webhook (via tunnel) or return reconciliation marks `paid` → order visible in `/account` and `/track`.
- `npm run build` + `tsc` + lint clean.

## Out of scope
Admin dashboard, coupons, inventory quantities, transactional emails, reviews, wishlist, multi-currency.
