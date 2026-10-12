# Footer Specification (banner + newsletter + footer)
- **Target file:** `src/components/Footer.tsx` (server component; newsletter form is a plain <form> with `action="#"` — no JS)
- **Screenshots:** `docs/design-references/desktop-footer.png`, `docs/design-references/desktop-footer-bottom.png`
- **Assets:** `/images/footer-banner.jpg` (1759×454 mascots on black), `/images/logo.png` (500×216)
- **Icons:** `HomeIcon, PhoneIcon, MailIcon, FacebookIcon, InstagramIcon, YoutubeIcon` from `@/components/icons`
- **Interaction model:** static; link hover → underline.

## 1. Mascot banner
- Full-bleed next/image, width 100%, aspect-ratio 1759/454 (≈372px @1440), object-cover, bg #000. alt "Stick It Up mascots".

## 2. Newsletter (black bg #000, color #fff)
- Container max-w 1600, padding 0 50px (15px mobile), padding-top 8px, padding-bottom 8px → total height ≈229.
- Centered column:
  - h2 "Join the Tribe": Bricolage Grotesque 48px weight 700 line-height 57.6px letter-spacing -1.44px, text-center. (Mobile: 36px / 43px.)
  - p "Subscribe for exclusive drops, offers & behind-the-scenes chaos." Outfit 16px weight 500 line-height 25.6px, color rgba(255,255,255,0.8), margin-top 16px, text-center.
  - form margin-top 20px: field wrapper width 500px (max-width 100%), height 80px, bg rgb(31,30,30), padding 10px, radius 8px, box-shadow rgba(255,255,255,0.06) 0 1px 2px 0, rgba(255,255,255,0.1) 0 1px 3px 0, flex justify-between gap 10px.
    - input type=email placeholder "Email": flex-1, height 60px, padding 15px, bg transparent, Outfit 14px weight 600 line-height 21px, color #fff, placeholder color #fff (bold "Email" visible in screenshot), outline none, radius 8px. Visually-hidden label "Email".
    - button "Subscribe": bg #fbfe21, border 1px solid #fbfe21, color #000, padding 11px 22px, radius 6px, height 60px, width ~116px, Bricolage 14px weight 700 line-height 16.8px, shadow rgba(255,255,255,0.05) 0 1px 2px 0.

## 3. Footer main (bg #000)
- padding-top 52px. Top content: max-w 1600, padding 0 50px 50px. Grid 3 columns equal (≈428px each @1340), gap 60px 28px. Mobile: single column, gap 40px.
- Column 1:
  - Logo link centered within column (img 180×78, centered — x 174 of col 50–478).
  - margin-top ~26px: h2 "GET IN TOUCH" Bricolage 18px weight 700 line-height 23.4px uppercase color #fff, margin-bottom ~30px.
  - ul: 3 rows, each flex gap 10px align-center, rows separated 10px; icon 20px color rgba(255,255,255,0.8); text Outfit 14px weight 500 line-height 22.4px color rgba(255,255,255,0.8):
    - HomeIcon "STICK IT UP, R.T. Road, behind Rajshree Cinema, Dahisar East"
    - PhoneIcon "+91 9867925615"
    - MailIcon "wecare@stickitup.xyz"
- Column 2: h2 "QUICK LINKS" (same heading style), margin-bottom 28px; ul links Outfit 14px weight 500 line-height 18.2px color rgba(255,255,255,0.8), padding 6px 0 per item (first item padding 0 0 6px). First link "Stickers" underlined (active). Hover: underline.
  - Stickers, Mini Sticker Sheets, Laptop Skins, Credit Card Skins, Our Story, Track Your Order
- Column 3: h2 "INFORMATION & SUPPORT", links (same style):
  - Track Your Order, Frequently Asked Questions, Terms & Conditions, Privacy Policy, Refund Policy, Shipping Policy, Bulk & Custom Orders, Blog, Contact Us
- Middle bar: border-top 1px solid rgba(255,255,255,0.1), padding 25px 0. Inner max-w 1600 px-50 flex justify-between align-center:
  - Left ul flex wrap, gap 5px 40px: links Outfit 14px line-height 22.4px color rgba(255,255,255,0.8), each li except last has a 1px vertical divider rgba(255,255,255,0.2) height 26px placed 20px to the right (use `relative after:absolute after:-right-5 after:top-0 after:h-full after:w-px after:bg-white/20`). Items: Stickers (underlined), Mini Sticker Sheets, Laptop Skins, Credit Card Skins, Our Story, Track Your Order
  - Right: social icons 16×16 white, gap 30px: Facebook (https://www.facebook.com/stickitup.xyz/), Instagram (https://www.instagram.com/stickitup.xyz/), YouTube. Each with sr-only label.
  - Mobile: stack column gap 20px, center.
- Bottom bar: bg #fff, padding 25px 0, inner max-w 1600 px-50 flex justify-end: small text Outfit 10px line-height 11px color #000: "© 2026, STICK IT UP Powered by Shopify" (STICK IT UP and Powered by Shopify are links).
