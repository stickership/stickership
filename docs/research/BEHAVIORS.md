# Behaviors
- Announcement countdown: ticks every 1s to "tonight 11:59 PM"-style deadline. Display DD:HH:MM:SS with labels Days/Hours/Mins/Secs.
- Header: NOT sticky (scrolls away). Nav items with caret (STICKERS & SKINS, CLOTHING) open dropdown panel on hover (opacity/transform 0.3s). Active item "STICKERS & SKINS" underlined.
- Marquee: `animation: scroll 12s linear infinite`, list duplicated, translateX loop, gap 30px.
- Hero/footer banners: subtle parallax wrapper (transform 1s cubic-bezier(0.03,0.93,0.97,1)) — negligible, render static.
- Product card hover (≥990): wrapper translateY(-13px) transition transform .5s; img scale(1.03) transition .5s; eye quick-view button (center-bottom of image) opacity 0→1 .3s; "Add to cart" black button below content opacity 0→1, top 428→418px, .3s. <990: Add to cart always visible in flow; no eye.
- Filter dropdowns: click summary toggles white panel (350px wide, max-h 450 scroll). Sort select native.
- Infinite scroll: grid appends next page (~40 items) when nearing bottom; URL ?page=N.
- Mobile: fixed bottom black "FILTER AND SORT" bar; body padding-bottom 60px.
