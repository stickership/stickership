# AnnouncementBar Specification
- **Target file:** `src/components/AnnouncementBar.tsx` ("use client")
- **Screenshot:** `docs/design-references/desktop-top.png` (top red strip), `docs/design-references/mobile-top.png`
- **Interaction model:** time-driven — countdown ticks every 1s

## DOM
div.bar (bg #c1121f) > div.content (flex center) > [p.text "STICKERS @ ₹10 · ENDS IN:"] + [timer: 4 units separated by ":"]
Each unit: value (2 digits) stacked over label (Days / Hours / Mins / Secs).

## Computed styles (desktop ≥990)
- bar: height 64px, background rgb(193,18,31), position relative, z-index 90
- content: display flex, justify-content center, align-items center, gap 24px, padding 8px 28px
- text: font Bricolage Grotesque? NO → font-family Outfit, 24px, weight 700, line-height 28.8px, color #fff, text-transform capitalize (text already caps). The "@" renders smaller in screenshot because Outfit glyph; leave as-is.
- timer box: 224×48px, flex row, centered, gap ≈2.7px
- unit: 48×48, flex column, centered
  - value: Outfit 27px, weight 600, line-height 27px, color rgb(255,217,102) (#ffd966)
  - label: Outfit 10.75px, weight 500, line-height 10.75px, color rgb(246,208,210) (#f6d0d2), capitalized ("Days")
- separator ":": serif 20px, weight 500, color #f6d0d2, padding-bottom 2px, width ~6px, align center

## Mobile (<750)
- bar height 43px, content padding 4px 0, gap 6px
- text: 15px/19.5px weight 700
- timer box 160×35 → value ≈19px, label ≈7.5px, separator ≈14px (scale factor 0.32 vs. original 60/24/44px)
Tablet (750–989): same as mobile.

## Behavior
- Deadline: today 23:59:59 local time (if passed, roll to tomorrow). Compute remaining; pad 2 digits. Days shows "00".
- Use useEffect + setInterval(1000); render "00" placeholders on server to avoid hydration mismatch (suppressHydrationWarning or initialize state null → show 00).

## Text (verbatim)
"STICKERS @ ₹10 · ENDS IN:" ; labels "Days" "Hours" "Mins" "Secs"
