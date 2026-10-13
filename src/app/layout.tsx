import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Instrument_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const bagel = Bagel_Fat_One({ variable: "--font-bagel", subsets: ["latin"], weight: "400" });
const spaceMono = Space_Mono({ variable: "--font-spacemono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stickership.shop"),
  title: { default: "Buy Vinyl Stickers Online in India at ₹10 | stickership", template: "%s | stickership" },
  description: "Waterproof vinyl stickers for laptops, bottles and phones from ₹10. Anime, memes, gaming and more. Ships across India in 24 hours.",
  applicationName: "stickership",
  openGraph: { type: "website", siteName: "stickership", locale: "en_IN", images: [{ url: "/logo.jpg", width: 500, height: 500, alt: "stickership" }] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export const viewport: Viewport = { themeColor: "#15111c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} ${bagel.variable} ${spaceMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
