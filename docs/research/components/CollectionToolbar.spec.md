# CollectionToolbar Specification
- **Target file:** `src/components/CollectionToolbar.tsx` ("use client")
- **Screenshots:** `docs/design-references/desktop-grid.png` (toolbar row), `docs/design-references/desktop-filter-open.png` (Theme dropdown open), `docs/design-references/mobile-top.png` (fixed bottom bar)
- **Icons:** `CaretIcon, CloseIcon, CheckIcon, FilterIcon, SortIcon` from `@/components/icons`
- **Interaction model:** click-driven dropdowns (one open at a time; click outside / Escape closes). Checkbox state local only (mock, no filtering needed).

## Desktop/Tablet (≥750) toolbar row
- Rendered inside parent container (max-w 1600, px 50). Row: flex justify-between align-start, margin-top ~6px (toolbar top sits 7px below marquee).
- Left: flex gap 16px align-center: label "Filter:" Outfit 14px weight 500 line-height 21px letter-spacing .6px, margin 11.6px 0, then 4 filter buttons.
  - Filter summary button: bg #fafafa, radius 6px, padding 16px 20px, height 54px, Outfit 14px weight 600 line-height 22.4px, color #000, flex align-center gap 14px with CaretIcon 16px right; caret rotates 180° when open; transition background-color .3s; hover bg #f0f0f0.
  - Buttons: "Theme", "Style", "Availability", "Product type"
- Right: Sort select wrapper: width ~200px, bg #fafafa, radius 6px; native <select> appearance none, padding 16px 43px 16px 20px, Outfit 14px weight 500, color rgba(0,0,0,0.78), shadow inset rgba(0,0,0,0.1) 0 1px 2px; CaretIcon absolute right 20px. Options: Featured, Most relevant, Best selling, Alphabetically, A-Z, Alphabetically, Z-A, Price, low to high, Price, high to low, Date, old to new, Date, new to old. Height 46px (top aligned, slightly shorter than filter buttons).
- Dropdown panel: position absolute top 59.4px left -12px, width 350px, max-height 450px, bg #fff, radius 6px, box-shadow rgba(0,0,0,0.1) 0 0 24px -3px, z-index 30, flex column.
  - Header: flex justify-between align-center, padding 16px 24px, border-bottom 1px solid rgba(0,0,0,0.1): "{n} selected" Outfit 16px weight 600; Reset button: inline-flex gap 8px, padding 7px 9px 7px 11px, radius 4px, border 1px solid rgba(0,0,0,0.08), shadow rgba(0,0,0,0.05) 0 1px 2px, Outfit 12px weight 700, CloseIcon 12px. Reset clears that facet's checks.
  - List: overflow-y auto, padding 24px, flex column gap 13px. Item row: label flex align-center gap 12px, full width:
    - custom checkbox 16×16, border 1.5px solid rgba(0,0,0,0.6), radius 3px; checked: bg #000 with white CheckIcon.
    - label text Outfit 14px weight 500 line-height 22.4px flex-1
    - count chip: Outfit 10px weight 500 line-height 10px, padding 6px 8px, radius 4px, border 1px solid rgba(0,0,0,0.1), bg rgba(250,250,250,0.3)
- Facet data (label, count):
  - Theme: Abstract & Artistic 55, Animals & Pets 73, Anime & Manga 434, Cars, Bikes & Racing 207, Dark & Edgy 136, Food & Drinks 77, Gaming 79, Humor & Attitude 959, Indian & Desi 152, Japanese & JDM 31, Love & Emotions 76, Motivational & Hustle 519, Music 37, Nature & Travel 151, Pop Culture 280, Quotes & Typography 71, Space & Sci-Fi 77, Spiritual & Faith 102, Sports & Fitness 135, Tech & Code 111, Warning & Signs 43
  - Style: Bold & Loud 1308, Cute & Kawaii 320, Dark 139, Illustrated 1216, Line Art 162, Minimal 189, Neon & Glow 323, Retro & Vintage 148
  - Availability: In stock 3640, Out of stock 165
  - Product type: Glitter Stickers 203, Holographic stickers 523, Mystery Box 2, Stickers 3077

## Mobile (<750)
- Desktop row hidden (`hidden md:flex`).
- Fixed bottom bar: position fixed bottom 0 left 0 right 0, z-index 40, bg #000, color #fff, padding 15px 0, height 63px, flex center gap 10px: FilterIcon 14px, "FILTER AND SORT" Bricolage 18px weight 700 uppercase, SortIcon 16px. Clicking it may toggle a simple full-screen white sheet listing the 4 facets + sort (simple acceptable) — or no-op. Keep minimal: no-op button is acceptable.
- Add spacer so content isn't hidden: page body padding-bottom 60px on mobile (render `<div className="h-[60px] md:hidden" />` at end is NOT needed — parent handles; you just render the bar).
