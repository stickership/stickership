import type { Metadata } from "next";
import { Outfit, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://stickership.shop"),
  title: "Buy Vinyl Stickers Online in India | stickership",
  description: "Premium vinyl stickers starting at ₹10. Waterproof, fade-proof, shipped in 24 hrs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${bricolage.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
