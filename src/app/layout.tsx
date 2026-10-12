import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Instrument_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const instrument = Instrument_Sans({ variable: "--font-instrument", subsets: ["latin"] });
const bagel = Bagel_Fat_One({ variable: "--font-bagel", subsets: ["latin"], weight: "400" });
const spaceMono = Space_Mono({ variable: "--font-spacemono", subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stickership.shop"),
  title: "Buy Vinyl Stickers Online in India | stickership",
  description: "Premium vinyl stickers starting at ₹10. Waterproof, fade-proof, shipped in 24 hrs.",
};

export const viewport: Viewport = { themeColor: "#15111c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrument.variable} ${bagel.variable} ${spaceMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
