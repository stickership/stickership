# stickership

Next.js 16 + Supabase + Cashfree sticker store.

## Local dev

```bash
colima start              # or Docker Desktop
supabase start            # ports 553xx, applies migration + seed
cp .env.example .env.local # fill from `supabase status -o env` + Cashfree sandbox keys
npm run dev
```

Login codes land in the local inbox at http://127.0.0.1:55324.

## Production setup

1. **Supabase**: `supabase link --project-ref <ref>` → `supabase db push` → run `supabase/seed.sql` in the SQL editor.
2. **Auth email**: Dashboard → Auth → Email Templates → *Magic Link*: paste `supabase/templates/magic_link.html` (must contain `{{ .Token }}` so users get a code, not a link).
3. **Cashfree**: Dashboard → Developers → Webhooks → add `https://<domain>/api/cashfree/webhook` for payment events. Set `CASHFREE_ENV=production` when live.
4. **Env**: set every key from `.env.example` on your host. `ORDER_TOKEN_SECRET` = `openssl rand -hex 24`.

## Checks

```bash
node --experimental-strip-types scripts/check-webhook.mjs   # webhook signature tests
npm run build
```

Products are edited in the Supabase table editor (`products`).
