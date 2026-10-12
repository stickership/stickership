# stickership

Next.js 16 + Supabase + Razorpay sticker store.

## Local dev

```bash
colima start              # or Docker Desktop
supabase start            # ports 553xx, applies migration + seed
cp .env.example .env.local # fill from `supabase status -o env` + Razorpay test keys
npm run dev
```

Login codes land in the local inbox at http://127.0.0.1:55324.

## Production setup

1. **Supabase**: `supabase link --project-ref <ref>` → `supabase db push` → run `supabase/seed.sql` in the SQL editor.
2. **Auth email**: Dashboard → Auth → Email Templates → *Magic Link*: paste `supabase/templates/magic_link.html` (must contain `{{ .Token }}` so users get a code, not a link).
3. **Razorpay**: Dashboard → Webhooks → add `https://stickership.shop/api/razorpay/webhook`, events `payment.captured` + `order.paid`, set a secret → `RAZORPAY_WEBHOOK_SECRET`. Keep payment auto-capture ON.
4. **Env**: set every key from `.env.example` on your host. `ORDER_TOKEN_SECRET` = `openssl rand -hex 24`.

## Checks

```bash
node --experimental-strip-types scripts/check-webhook.mjs   # webhook signature tests
npm run build
```

Products are edited in the Supabase table editor (`products`).

## Admin panel

`/admin` — dashboard, products (create/edit/upload/bulk), orders (ship/deliver/cancel), customers, subscribers (CSV), admins.
Access: log in at `/login` with an email listed in `admin_invites` (it's promoted automatically). Add more admins from `/admin/admins`.
