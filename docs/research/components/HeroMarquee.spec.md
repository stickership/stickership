# HeroBanner + Marquee Specification
- **Target files:** `src/components/HeroBanner.tsx` (server), `src/components/Marquee.tsx` (server, pure CSS)
- **Screenshots:** `docs/design-references/desktop-top.png`, `docs/design-references/desktop-grid.png` (marquee strip at top), `docs/design-references/mobile-top.png`
- **Interaction model:** Hero static. Marquee time-driven CSS animation.

## HeroBanner
- Single full-bleed image, no text overlay (all text is baked into the image).
- Desktop/tablet (≥750): `/images/hero-desktop.webp` 1920×982 → width 100%, aspect-ratio 1920/982 (737px tall @1440). object-fit cover. Background #fafafa.
- Mobile (<750): `/images/hero-mobile.webp` 750×502 → aspect-ratio 750/502 (261px @390).
- Use next/image with `priority`, `sizes="100vw"`. Two <Image>s toggled with `hidden md:block` / `md:hidden` (md = 750px custom breakpoint already defined in globals.css @theme as --breakpoint-md: 750px).
- alt: "Festive Fever Sale – stickers at just ₹10"

## Marquee
- Wrapper: bg #000, color #fff, overflow hidden, height 29px desktop (26px mobile).
- Track: display flex, gap 30px; contains the list TWICE (second aria-hidden). Each list: flex, min-width 100% (1440 at desktop), justify-content space-around, align-items center, gap 30px, flex-shrink 0, `animation: marquee 12s linear infinite` (keyframe `marquee` exists in globals.css: to { transform: translateX(-100%) }). Because track gap is 30px, translate the list by calc(-100% - 30px) — define a local keyframe via inline style or Tailwind arbitrary `animate-[marquee_12s_linear_infinite]`; acceptable to slightly adjust.
- Items (in order), each span padding 5px, display inline, white-space nowrap:
  1. "🔥 India's Largest Sticker Brand" — Bricolage Grotesque 18px weight 700 line-height 23.4px #fff
  2. "💚 12 Lakh+ Happy Customers" (whole span incl. emoji gets the gradient clip → emoji shows yellow, matches original) — Outfit 18px weight 500 line-height 28.8px; GRADIENT TEXT: background-image linear-gradient(133deg, rgb(250,220,54) 11%, rgb(254,98,146) 49%, rgb(250,220,54) 87%); background-clip text; -webkit-text-fill-color transparent
  3. "🇮🇳 Made in India" — Bricolage 18px 700 #fff
  4. "🚚 Ships in 24 Hrs" — Outfit 18px 500 line-height 28.8px #fff
- Mobile: item font-size 14px, line-height 22.4px.
