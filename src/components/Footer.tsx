import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, HomeIcon, InstagramIcon, MailIcon, PhoneIcon, YoutubeIcon } from "@/components/icons";

const quick = ["Stickers", "Mini Sticker Sheets", "Laptop Skins", "Credit Card Skins", "Our Story", "Track Your Order"];
const info = [
  "Track Your Order",
  "Frequently Asked Questions",
  "Terms & Conditions",
  "Privacy Policy",
  "Refund Policy",
  "Shipping Policy",
  "Bulk & Custom Orders",
  "Blog",
  "Contact Us",
];
const contact = [
  { Icon: HomeIcon, text: "STICK IT UP, R.T. Road, behind Rajshree Cinema, Dahisar East" },
  { Icon: PhoneIcon, text: "+91 9867925615" },
  { Icon: MailIcon, text: "wecare@stickitup.xyz" },
];
const social = [
  { Icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/stickitup.xyz/" },
  { Icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/stickitup.xyz/" },
  { Icon: YoutubeIcon, label: "YouTube", href: "https://www.youtube.com/" },
];

const wrap = "mx-auto w-full max-w-[1600px] px-[15px] md:px-[50px]";
const h = "font-heading text-[18px] font-bold uppercase leading-[23.4px] text-white";
const link = "hover:underline";

export function Footer() {
  return (
    <footer className="bg-black font-sans text-white">
      <Image
        src="/images/footer-banner.jpg"
        alt="Stick It Up mascots"
        width={1759}
        height={454}
        sizes="100vw"
        className="aspect-[1759/454] w-full bg-black object-cover"
      />

      <section className={`${wrap} py-2`}>
        <div className="flex flex-col items-center">
          <h2 className="text-center font-heading text-[36px] font-bold leading-[43px] tracking-[-1.44px] md:text-[48px] md:leading-[57.6px]">
            Join the Tribe
          </h2>
          <p className="mt-4 text-center text-base font-medium leading-[25.6px] text-white/80">
            Subscribe for exclusive drops, offers &amp; behind-the-scenes chaos.
          </p>
          <form
            action="#"
            className="mt-5 flex h-20 w-[500px] max-w-full justify-between gap-2.5 rounded-lg bg-panel p-2.5 shadow-[0_1px_2px_0_rgba(255,255,255,0.06),0_1px_3px_0_rgba(255,255,255,0.1)]"
          >
            <label htmlFor="footer-email" className="sr-only">Email</label>
            <input
              id="footer-email"
              type="email"
              name="email"
              required
              placeholder="Email"
              className="h-[60px] min-w-0 flex-1 rounded-lg bg-transparent p-[15px] text-[14px] font-semibold leading-[21px] text-white outline-none placeholder:text-white"
            />
            <button
              type="submit"
              className="h-[60px] cursor-pointer rounded-md border border-brand-yellow bg-brand-yellow px-[22px] py-[11px] font-heading text-[14px] font-bold leading-[16.8px] text-black shadow-[0_1px_2px_0_rgba(255,255,255,0.05)]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <div className="pt-[52px]">
        <div className={`${wrap} grid gap-10 pb-[50px] md:grid-cols-3 md:gap-x-7 md:gap-y-[60px]`}>
          <div>
            <Link href="/" className="mx-auto block w-[180px]">
              <Image src="/images/logo.png" alt="Stick It Up" width={180} height={78} className="h-auto w-[180px]" />
            </Link>
            <h2 className={`${h} mt-[26px] mb-[30px]`}>Get in touch</h2>
            <ul className="flex flex-col gap-2.5">
              {contact.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-[14px] font-medium leading-[22.4px] text-white/80">
                  <Icon width={20} height={20} className="shrink-0 text-white/80" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={`${h} mb-7`}>Quick Links</h2>
            <ul>
              {quick.map((t, i) => (
                <li key={t} className={`leading-[18.2px] ${i ? "py-1.5" : "pb-1.5"}`}>
                  <Link href="#" className={`text-[14px] font-medium leading-[18.2px] text-white/80 ${i ? link : "underline"}`}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={`${h} mb-7`}>Information &amp; Support</h2>
            <ul>
              {info.map((t, i) => (
                <li key={t} className={`leading-[18.2px] ${i ? "py-1.5" : "pb-1.5"}`}>
                  <Link href="#" className={`text-[14px] font-medium leading-[18.2px] text-white/80 ${link}`}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-[25px]">
          <div className={`${wrap} flex flex-col items-center gap-5 md:flex-row md:justify-between`}>
            <ul className="flex flex-wrap justify-center gap-x-10 gap-y-[5px] md:justify-start">
              {quick.map((t, i) => (
                <li
                  key={t}
                  className={`relative ${i < quick.length - 1 ? "after:absolute after:-right-5 after:top-0 after:h-full after:w-px after:bg-white/20" : ""}`}
                >
                  <Link href="#" className={`text-[14px] leading-[22.4px] text-white/80 ${i ? link : "underline"}`}>
                    {t}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex items-center gap-[30px]">
              {social.map(({ Icon, label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="block text-white">
                    <Icon width={16} height={16} />
                    <span className="sr-only">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white py-[25px] text-black">
          <div className={`${wrap} flex justify-end`}>
            <p className="text-[10px] leading-[11px]">
              © 2026,{" "}
              <Link href="/" className={link}>STICK IT UP</Link>{" "}
              <a href="https://www.shopify.com" target="_blank" rel="noopener noreferrer" className={link}>
                Powered by Shopify
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
