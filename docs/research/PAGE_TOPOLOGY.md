# Page Topology — stickitup.xyz/collections/buy-vinyl-stickers-online-india

All flow content, no sticky header, native scroll (no Lenis). Breakpoints (Shopify Dawn): small <750, medium 750–989, large ≥990. Page side gutter 50px (desktop/tablet), 15px mobile; max-width 1600.

| # | Section | Height @1440 | Interaction | Component |
|---|---------|--------------|-------------|-----------|
| 1 | Countdown announcement bar | 64 (43 mobile) | time-driven (1s ticking countdown) | AnnouncementBar |
| 2 | Header (black) | 91 (73 mobile) | hover dropdowns (desktop) | Header |
| 3 | Hero banner image | aspect 1920/982 (mobile 750/502) | static | HeroBanner |
| 4 | Scrolling text marquee | 29 (26 mobile) | time-driven CSS marquee 12s linear | Marquee |
| 5 | Filter toolbar + product grid (160 products, infinite scroll pages) | — | click dropdowns, hover cards, scroll-load | CollectionToolbar, ProductCard, ProductGrid |
| 6 | Footer image banner (mascots) | aspect 1759/454 | static | Footer |
| 7 | Newsletter "Join the Tribe" (black) | 229 | static form | Footer |
| 8 | Footer columns + bottom bar + copyright | 565 | hover links | Footer |
| fixed | Mobile "FILTER AND SORT" bottom bar | 63 | <990 only | CollectionToolbar |
