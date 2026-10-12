# ProductCard + ProductGrid Specification
- **Target files:** `src/components/ProductCard.tsx` (server-safe, no hooks), `src/components/ProductGrid.tsx` ("use client" — infinite scroll)
- **Screenshots:** `docs/design-references/desktop-grid.png`, `docs/design-references/desktop-card-hover.png` (hover state), `docs/design-references/mobile-top.png`
- **Data:** `import { products, type Product } from "@/data/products"` — 160 items `{ title, image: "/products/N.jpg" (600×600), price, compareAt }`. Prices are numbers in rupees.
- **Icons:** `EyeIcon` from `@/components/icons`.
- **Interaction model:** hover (desktop) + scroll-driven infinite loading.

## ProductGrid
- `<ul>`: display flex, flex-wrap wrap, gap 34px 31px (desktop & tablet), margin 40px 0 20px. Each li width = (100% - 3*31px)/4 at ≥990 (311.75px @1440 inside 1340 content); 3 columns at 750–989 (gap 31); 2 columns <750 with gap 17px, margin 30px 0 20px.
- Container: max-width 1600, padding 0 50px (≥750), 0 15px (<750). (Page wrapper may already supply this — ProductGrid should render ONLY the <ul> + sentinel; padding is supplied by parent `<div className="mx-auto max-w-[1600px] px-[15px] md:px-[50px]">`.)
- Infinite scroll: show first 24 products; IntersectionObserver on a sentinel div below the list (rootMargin "800px") appends 24 more until all 160 shown. No spinner needed.

## ProductCard (li content)
- wrapper: position relative, transition transform .5s; on hover (≥990, use `lg:` with `group`): translateY(-13px).
- media: aspect-square, bg #fafafa, position relative, overflow hidden (so scaled img clips). Image next/image fill, object-cover, sizes "(min-width:990px) 25vw, (min-width:750px) 33vw, 50vw", transition transform .5s; hover scale 1.03.
- Sale badge (top-right of media): position absolute top 8px right -10px (it overhangs the card's right edge by ~10px — badge right edge at card right +10px), padding 7px 13px, radius 16px, border 1px solid rgba(220,38,38,0.25), bg rgb(254,242,242), color rgb(220,38,38), Outfit 10px weight 800 line-height 10px letter-spacing .3px. Text: `Save Rs. {compareAt-price formatted}` e.g. "Save Rs. 69.00", "Save Rs. 1,231.00". z-index 2. Badge must not be clipped → place it outside the overflow-hidden media box (sibling, positioned relative to wrapper).
- Quick view (≥990 only): 44×44 button centered horizontally at top 252.75px of the media (i.e. bottom ~15px of image), bg rgba(255,255,255,0.85), radius 14px, padding 12px, shadow rgba(0,0,0,0.1) 0 1px 1px 0, EyeIcon 18px black. opacity 0 → 1 on hover, transition opacity .3s.
- Content: margin-top 20px.
  - Title h3: Bricolage Grotesque 18px weight 700 line-height 23.4px letter-spacing -0.072px color #000, margin 5px 0. Single line ellipsis NOT applied — long titles wrap (see "Limited Edition V2 Sticker" OK; "Mystery Box 2 [20 Random Stickers]" wraps to 2 lines).
  - Price block margin-top 10px, flex column:
    - Row (flex align-center): `<s>` "Rs. 79.00" Outfit 14px weight 500 line-height 22.4px color rgb(148,163,184) line-through; then badge "-Rs. 69.00": Outfit 10px weight 500 line-height 10px, bg rgba(0,0,0,0.05), padding 4px 8px, radius 3px, margin-left 5px, color #000.
    - Sale price "Rs. 10.00": Outfit 16px weight 600 line-height 25.6px color rgba(239,68,68,0.8).
  - Price format: `Rs. ${n.toLocaleString("en-IN",{minimumFractionDigits:2})}` → "Rs. 1,580.00".
- Add to cart (desktop ≥990): absolutely positioned below content: position absolute, left 0, right 0, top 100% (card height 418 → button top 428 hidden → 418 on hover), margin-top 10px, flex justify-center; button width 250px (≈80% of card), height 37px, bg rgba(0,0,0,0.9), color #fbfe21, border 1px solid #000, radius 6px, padding 9px 17px, Bricolage 14px weight 700 line-height 16.8px, shadow rgba(0,0,0,0.05) 0 1px 2px 0. opacity 0, translateY(10px) → on hover opacity 1, translateY(0); transition opacity .3s, transform .3s. z-index 2. Text "Add to cart".
- Mobile/tablet (<990): Add to cart in normal flow under price, margin-top 10px, full width, opacity 1, same colors. Title 14px line-height 18.2px. No quick-view eye. No hover lift.
- Card image alt = title.
