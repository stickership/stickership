# Header Specification
- **Target file:** `src/components/Header.tsx` (server component; dropdowns via CSS group-hover, no JS needed)
- **Screenshots:** `docs/design-references/desktop-top.png`, `docs/design-references/desktop-megamenu.png` (dropdown open), `docs/design-references/mobile-top.png`
- **Interaction model:** hover-driven dropdowns (desktop). NOT sticky — header scrolls away normally.
- Imports: `SupportIcon, SearchIcon, AccountIcon, CartIcon, CaretIcon, MenuIcon` from `@/components/icons`; next/image, next/link. Logo `/images/logo.png` (500×216).

## Desktop (≥990)
- header: bg #000, padding 10px 0, border-bottom 1px solid rgba(255,255,255,0.08). Total height 91px.
- inner: max-width 1600px, margin 0 auto, padding 0 50px, display grid, grid-template-columns 170px 1fr auto, column-gap 10px, height 70px.
- Logo cell: flex align-center; image 140×60 centered inside 170px link (link padding ~ 0 15px).
- Nav (grid col 2): ul flex-wrap, two rows (row height 31px). Items in order:
  1. "STICKERS & SKINS" (dropdown, caret) — ACTIVE: text underlined (text-decoration underline, thickness 1px, offset ~3px)
  2. "FIND YOUR VIBE"
  3. "CLOTHING" (dropdown, caret)
  4. "MYSTERY BOX"
  5. "CUSTOM STICKERS"
  6. "OUR STORY"
  7. "REVIEWS"
  Row 1 = items 1–4, row 2 = items 5–7 (natural wrap at width ~682px; nav ul starts x=243 at 1440 — i.e. shifted left 15px via negative margin so text aligns at 258).
  - item link: Bricolage Grotesque 16px, weight 700, line-height 20.8px, letter-spacing -0.32px, color #fff, padding 5px 27px 5px 15px (plain items: 5px 15px). Caret icon 16×16 absolutely right ~8px, vertically centered, color #fff opacity 0.7, rotates 180° on hover (transition .3s).
- Dropdown panel (STICKERS & SKINS / CLOTHING): position absolute top 40.8px left 0 (margin-left -9px), width 258px, bg #000, padding 24px 0, border-radius 5px, border 1px solid rgba(255,255,255,0.03), box-shadow rgba(43,43,43,0.05) 0 1px 5px 0, z-index 20. Hidden state: opacity 0, visibility hidden, translateY(-10px)?? (use opacity 0 + pointer-events none + translateY(8px)); visible on li:hover / focus-within: opacity 1, transform none; transition opacity .3s, transform .3s.
  - panel links: Outfit 14px, weight 600, line-height 18.2px, color #fff, padding 10px 24px, display block, uppercase text as given. First item ("PREMIUM VINYL STICKERS") underlined (active). Hover: underline.
  - STICKERS & SKINS links: PREMIUM VINYL STICKERS, REFLECTIVE BUMPER STICKERS, HOLOGRAPHIC STICKERS, MINI STICKER SHEETS, GLITTER STICKERS, LAPTOP SKINS, INFINITY STICKERS, STICKER PACKS
  - CLOTHING links: T-SHIRTS, HOODIES, BOTTOMS
- Icons cell (col 3): flex align-center, gap 10px (approx; boxes: support 935–1156, search 1176, account 1230, cart 1294–1390):
  - Support pill: <a href="mailto:wecare@stickitup.xyz">, bg #1f1e1e, radius 8px, height 70px, padding 0 10px, flex align-center gap 16px, width ~221px. SupportIcon 24px white. Text column: "Customer support" Outfit 12px/12px weight 500 white opacity .7; then "wecare@stickitup.xyz" Outfit 16px weight 800 line-height 20px white.
  - margin-left 20px then Search button 44×44 (icon 24px white), Account link 44×44 (icon 24), margin 10px between.
  - Cart link: flex align-center gap 10px: CartIcon 24px with bubble absolutely at top -3px right -5px... (bubble box: 18×18, bg #fbfe21, color #000, radius 50%, Outfit 10px weight 600, text "0", positioned so its center is at icon top-right). Then column: "Subtotal" Outfit 12px/12px 500 white; "Rs. 0.00" Outfit 16px/16px weight 800 white.

## Mobile/Tablet (<990)
- header height 73px (padding 10px 0, inner 52px).
- inner: grid-template-columns 1fr auto 1fr (≈98px 164px 98px at 390), padding 0 5px, gap 10px. At 750–989 padding 0 50px.
- Left: MenuIcon button 44×44 + AccountIcon link 44×44.
- Center: logo 120×52.
- Right (justify-end): Search 44×44 + Cart 44×44 (bubble yellow, no Subtotal text).
- Nav and support pill hidden.
