# Admin Panel — Design

Date: 2026-10-12 · Status: approved in chat

## Decisions
- Access: `admins` table; login via existing email OTP. Guard = `private.is_admin()` (not exposed via API).
- Writes use the admin's own session + RLS (no service role) except "add admin by email" (needs auth.users lookup → service role after caller admin check).
- Images: upload from browser to Storage bucket `products` (public read, admin write); product.image stores public URL.
- Orders: statuses pending → paid → shipped → delivered (+ failed/cancelled). Fields courier, tracking_no, shipped_at, delivered_at. Customer order page shows tracking.

## Schema (migration 0003_admin.sql)
- `private` schema, `private.is_admin()` security definer, execute to authenticated only.
- `admins(user_id pk → auth.users, email, created_at)`.
- RLS: admins full on products; select/update orders; select order_items; select/delete subscribers; select/insert/delete admins.
- `orders` status check widened; new columns.
- `public.admin_stats()`, `public.admin_customers(q, lim, off)`: security invoker (RLS restricts to admins).
- Storage bucket + policies.

## Pages
/admin (dashboard) · /admin/products (+ new, [id]) · /admin/orders (+ [id]) · /admin/customers · /admin/subscribers (+ CSV export) · /admin/admins.
Layout guard: no user → /login; non-admin → 404. Every action re-checks admin.

## Caching
Catalog cached functions tagged `products`; product writes call `updateTag("products")`.

## Out of scope
Shipping emails, Cashfree refunds, audit log.
