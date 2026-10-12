import type { Metadata } from "next";
import { Outfit, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buy All Stickers Online in India | STICK IT UP",
  description: "Premium vinyl stickers starting at ₹10. India's largest sticker brand.",
  icons: { apple: "/seo/apple-touch-icon.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${bricolage.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
