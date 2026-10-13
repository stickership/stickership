import { facetCounts, allSlugs } from "@/lib/catalog";
import { pages } from "@/data/pages";

export const revalidate = 3600;

export async function GET() {
  const [facets, products] = await Promise.all([facetCounts(), allSlugs()]);
  const themes = facets.filter((f) => f.facet === "theme").map((f) => `${f.value} (${f.count})`);
  const faq = pages.faq.body.map((p) => `- ${p}`).join("\n");
  const body = `# stickership

> stickership (https://stickership.shop) is an Indian online store selling waterproof vinyl stickers for laptops, water bottles and phones. Most stickers cost ₹10, orders ship across India within 24 hours, and shipping is free above ₹299.

## Key facts
- Product: die-cut stickers printed on waterproof, scratch-proof matte vinyl, each fitting within 3 × 3 inches
- Price: ₹10 per sticker (special packs and mystery boxes priced individually)
- Catalog size: ${products.length} stickers
- Themes: ${themes.join(", ") || "anime, memes, gaming and more"}
- Shipping: India only, dispatched within 24 hours, delivered in 3–7 working days; free above ₹299, otherwise ₹49
- Payments: UPI, cards, netbanking and wallets via Razorpay
- Returns: free replacement or refund for damaged or wrong items reported within 7 days
- Support: stickershipindia@gmail.com

## Pages
- [Shop all stickers](https://stickership.shop/)
${Object.entries(pages)
  .map(([slug, p]) => `- [${p.title}](https://stickership.shop/pages/${slug})`)
  .join("\n")}
- [Track your order](https://stickership.shop/track)
- [Sitemap](https://stickership.shop/sitemap.xml)

## FAQ
${faq}
`;
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
