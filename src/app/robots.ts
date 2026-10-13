import type { MetadataRoute } from "next";

const PRIVATE = ["/account", "/checkout", "/orders", "/login", "/api/", "/auth/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // Explicitly welcome AI search/answer crawlers so the store can be cited in AI answers (GEO).
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot"], allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://stickership.shop/sitemap.xml",
    host: "https://stickership.shop",
  };
}
