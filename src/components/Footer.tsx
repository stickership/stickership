import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ["All stickers", "/#shop"],
      ["Holographic", "/?type=Holographic+stickers#shop"],
      ["Mystery box", "/?type=Mystery+Box#shop"],
      ["Bulk & custom orders", "/pages/bulk-orders"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Track your order", "/track"],
      ["FAQ", "/pages/faq"],
      ["Shipping policy", "/pages/shipping"],
      ["Refund policy", "/pages/refund"],
      ["Contact us", "/pages/contact"],
    ],
  },
  {
    title: "Us",
    links: [
      ["Our story", "/pages/our-story"],
      ["Terms & conditions", "/pages/terms"],
      ["Privacy policy", "/pages/privacy"],
    ],
  },
];

const wrap = "mx-auto w-full max-w-[1600px] px-[15px] md:px-[50px]";

export function Footer() {
  return (
    <footer className="mt-10 overflow-hidden border-t-2 border-ink bg-ink font-sans text-white">
      <div className={`${wrap} grid gap-12 pt-16 pb-10 lg:grid-cols-[1.2fr_2fr]`}>
        <div className="min-w-0">
          <h2 className="font-display text-4xl leading-none text-slime md:text-5xl">get first dibs</h2>
          <p className="mt-3 max-w-[380px] text-white/70">New drops and restocks, straight to your inbox. Unsubscribe anytime.</p>
          <NewsletterForm />
          <a href="mailto:support@stickership.shop" className="mt-6 inline-block font-mono text-sm text-white/70 hover:text-slime">
            support@stickership.shop
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-pop">{c.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map(([t, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-[15px] text-white/80 hover:text-slime">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className={`${wrap} pb-6`}>
        <p aria-hidden className="select-none font-display text-[16vw] leading-[0.8] text-paper [paint-order:stroke_fill] [-webkit-text-stroke:6px_var(--color-pop)] lg:text-[12vw]">
          stickership
        </p>
      </div>
      <div className="border-t border-white/10 py-4">
        <p className={`${wrap} font-mono text-xs text-white/50`}>© 2026 stickership · Made in India</p>
      </div>
    </footer>
  );
}
