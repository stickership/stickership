import { business as b } from "@/data/business";
import { FREE_SHIPPING_FROM, SHIPPING_FEE } from "@/lib/format";

// A string renders as a paragraph, a string[] as a bulleted list.
export type Block = string | string[];
export type Page = { title: string; updated?: string; body: string[]; sections?: { heading: string; body: Block[] }[] };

const UPDATED = "13 October 2026";
const only = (...xs: (string | false)[]) => xs.filter(Boolean) as string[];
const courts = b.jurisdiction ? `the courts at ${b.jurisdiction}` : "the competent courts in India";
const email = b.email;

const contactLines = only(
  `Email: ${email}`,
  !!b.phone && `Phone / WhatsApp: ${b.phone}`,
  !!b.address && `Registered address: ${b.address}`,
  `Support hours: ${b.hours}`,
);

const grievance: Block[] = [
  `If you have a complaint about an order, a payment or your personal data, please write to us:`,
  only(`Email: ${email}`, !!b.phone && `Phone: ${b.phone}`, !!b.address && `Address: ${b.address}`),
  "We acknowledge every complaint within 48 hours and aim to resolve it within 30 days.",
];

export const pages: Record<string, Page> = {
  "our-story": {
    title: "Our Story",
    body: [
      "Stick with style.",
      "stickership started with one laptop, too many blank surfaces and a simple idea: the things you carry every day should say something about you. A plain laptop lid is a wasted canvas. So is your water bottle, your phone case and that notebook you take to every meeting.",
      "We are a small Indian sticker brand making designs we'd want on our own stuff, and shipping them to every corner of the country.",
    ],
    sections: [
      {
        heading: "What we make",
        body: [
          "Our designs come from three things we can't stop thinking about:",
          [
            "India: the places we grew up in, travelled to and keep daydreaming about, from mountain roads and beaches to the chaos of our cities.",
            "Anime: the characters, moments and one-liners that live rent-free in our heads.",
            "Office life: deadlines, endless meetings, chai breaks and the inside jokes every desk worker gets instantly.",
          ],
          "New drops land regularly, so there's always something fresh to stick.",
        ],
      },
      {
        heading: "Made to last",
        body: [
          "Every sticker is printed on premium waterproof vinyl with a matte finish and die-cut to its shape. It handles rain, spills, bottle washes and daily backpack life without fading or peeling.",
        ],
      },
      {
        heading: "Priced for collecting",
        body: [
          `Most stickers cost just ₹10, so you can build a whole laptop's worth without thinking twice. Orders ship across India within 24 hours, and shipping is free on orders of ₹${FREE_SHIPPING_FROM} and above.`,
        ],
      },
      {
        heading: "Say hi",
        body: [
          `Follow along on Instagram at @stickership_india for new drops and behind-the-scenes, or write to us at ${email} for anything else, including bulk and custom orders for your team, brand or event.`,
        ],
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    body: [
      "How much do stickers cost? Most stickers are ₹10 each. Mystery boxes and special packs are priced on their product pages.",
      "Are the stickers waterproof? Yes. They are printed on waterproof vinyl with a matte finish and handle rain, spills and bottle washing.",
      "What size are the stickers? Each sticker fits within a 3 × 3 inch area. Exact height and width depend on the design's shape.",
      "Where can I stick them? Laptops, water bottles, phone cases, notebooks, helmets, guitars and any clean, smooth surface.",
      "How fast do you ship? Orders are packed and dispatched within 24 hours on working days. Delivery usually takes 3–7 working days depending on your pincode.",
      `Is shipping free? Shipping is free on orders of ₹${FREE_SHIPPING_FROM} and above. Below that, a flat ₹${SHIPPING_FEE} shipping fee applies.`,
      "Do you ship across India? Yes, to every serviceable pincode in India. We do not ship internationally yet.",
      "Which payment methods do you accept? UPI, debit and credit cards, netbanking and wallets, processed securely by Razorpay. We do not offer cash on delivery.",
      "What if my order arrives damaged? Email us within 7 days of delivery with photos and your order ID, and we will send a free replacement or a full refund.",
      "Can I cancel my order? Yes, any time before it is dispatched. Email us your order ID and we will refund you in full.",
      "How long do refunds take? Approved refunds reach your original payment method within 5–7 working days.",
      "How do I track my order? Use the Track Your Order page with your order ID and the email you used at checkout.",
      "Do you make custom or bulk stickers? Yes. Email us with the quantity, sizes and artwork, and we will send a quote within 24 hours.",
    ],
  },
  shipping: {
    title: "Shipping & Delivery Policy",
    updated: UPDATED,
    body: [
      `This policy explains how orders placed on ${b.site} are packed, shipped and delivered.`,
    ],
    sections: [
      {
        heading: "Where we ship",
        body: [
          "We deliver to every serviceable pincode in India through our courier partners. We do not ship internationally at the moment.",
          "If your pincode turns out to be unserviceable after you have paid, we will let you know by email and refund the full amount.",
        ],
      },
      {
        heading: "Shipping charges",
        body: [
          [
            `Orders of ₹${FREE_SHIPPING_FROM} and above: free shipping.`,
            `Orders below ₹${FREE_SHIPPING_FROM}: a flat shipping fee of ₹${SHIPPING_FEE}.`,
          ],
          "The shipping fee is shown at checkout before you pay. There are no hidden charges at delivery. All orders are prepaid; we do not offer cash on delivery.",
        ],
      },
      {
        heading: "Processing and delivery time",
        body: [
          [
            "Processing: orders are packed and handed to the courier within 24 hours of payment on working days (Monday to Saturday, excluding public holidays). Orders placed on Sundays or holidays are dispatched the next working day.",
            "Delivery: 3–7 working days after dispatch for most pincodes. Remote areas and the North-East may take up to 10 working days.",
            "Bulk and custom orders: the dispatch date is confirmed in your quote, usually 3–5 working days after the artwork is approved.",
          ],
          "Delivery times are estimates given by our courier partners. Sales, festivals, weather or other events outside our control can add delays, and we will keep you informed if that happens.",
        ],
      },
      {
        heading: "Tracking your order",
        body: [
          "You will receive an order confirmation email as soon as payment succeeds. Once the parcel ships, the courier name and tracking number appear on your order page and on the Track Your Order page, where you can check status with your order ID and email.",
        ],
      },
      {
        heading: "Delivery address",
        body: [
          "Please check your name, address, pincode and phone number before paying. We can change the address only before the order is dispatched; email us as soon as possible with your order ID.",
          `If a parcel is returned to us because of an incorrect or incomplete address, or because delivery was refused or not accepted after the courier's attempts, we will reship it once you confirm the correct address (a ₹${SHIPPING_FEE} reshipping fee applies) or refund the order value minus the shipping charges already incurred.`,
        ],
      },
      {
        heading: "Delayed, lost or damaged parcels",
        body: [
          [
            "If your order has not arrived within 10 working days of dispatch, email us with your order ID and we will chase it with the courier.",
            "If the tracking shows delivered but you have not received it, tell us within 48 hours of the delivery update so we can raise a dispute with the courier.",
            "If a parcel is confirmed lost in transit, we will send a free replacement or a full refund, whichever you prefer.",
            "If your parcel arrives damaged, see our Cancellation & Refund Policy for how to get a replacement or refund.",
          ],
        ],
      },
      { heading: "Contact", body: ["Questions about shipping? Reach us at:", contactLines] },
    ],
  },
  refund: {
    title: "Cancellation & Refund Policy",
    updated: UPDATED,
    body: [
      `We want every order from ${b.brand} to make you happy. This policy explains when you can cancel an order, when we replace or refund it, and how long refunds take.`,
    ],
    sections: [
      {
        heading: "Cancellations",
        body: [
          [
            "You can cancel an order any time before it is dispatched by emailing us your order ID from the email address used at checkout. We will cancel it and refund 100% of the amount paid, including shipping.",
            "Orders are usually dispatched within 24 hours, so please write to us as soon as possible. Orders that have already been dispatched cannot be cancelled.",
            "Bulk and custom orders can be cancelled for a full refund until the artwork is approved and printing starts. After that, they cannot be cancelled because the stickers are made specifically for you.",
            "We may cancel an order ourselves if an item is out of stock, a price was displayed in error, the pincode is not serviceable or the order looks fraudulent. In that case you receive a full refund.",
          ],
        ],
      },
      {
        heading: "Returns",
        body: [
          "Stickers are printed products sold at low prices, so we do not accept returns or offer refunds for change of mind, wrong selection by the customer or because a design did not suit you after it was delivered. This includes the random contents of mystery boxes.",
        ],
      },
      {
        heading: "Damaged, defective, wrong or missing items",
        body: [
          "If something is wrong with your order, we will make it right at no cost to you. This covers:",
          [
            "stickers damaged in transit, misprinted or with a printing or cutting defect",
            "a different design from the one you ordered",
            "items missing from your parcel",
          ],
          "You can choose a free replacement of the affected items or a refund for them. You do not need to send the stickers back.",
        ],
      },
      {
        heading: "How to request a replacement or refund",
        body: [
          [
            `Email ${email} within 7 days of delivery.`,
            "Include your order ID, the affected items and clear photos of the stickers and the packaging. For missing items, an unboxing video helps us resolve it faster.",
            "We review every request within 2 working days and confirm the replacement or refund by email. Replacements are dispatched within 2 working days of approval.",
          ],
        ],
      },
      {
        heading: "Refund method and timeline",
        body: [
          [
            "Refunds are issued to your original payment method (UPI, debit or credit card, netbanking or wallet) through our payment partner Razorpay.",
            "Once approved, refunds are processed within 5–7 working days. Depending on your bank, it may take a few more days to show in your account.",
            "We do not charge any cancellation or refund fee, except as described for returned-to-origin parcels in our Shipping & Delivery Policy.",
          ],
        ],
      },
      {
        heading: "Failed or duplicate payments",
        body: [
          "If money was deducted but your order shows as failed, or you were charged twice for the same order, the extra amount is refunded automatically to your original payment method within 5–7 working days. If it does not arrive, email us with your payment reference and we will follow it up with Razorpay.",
        ],
      },
      { heading: "Contact", body: ["For cancellations, refunds or anything else about your order:", contactLines] },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: UPDATED,
    body: [
      `These terms govern your use of ${b.site} (the "Website") and any purchase you make on it. The Website and the ${b.brand} brand are owned and operated by ${b.legalName}${b.address ? `, ${b.address}` : ""} ("we", "us", "our"). By browsing the Website or placing an order, you agree to these terms, our Privacy Policy, Shipping & Delivery Policy and Cancellation & Refund Policy. If you do not agree, please do not use the Website.`,
    ],
    sections: [
      {
        heading: "Eligibility",
        body: [
          "You must be at least 18 years old and able to enter into a binding contract under the Indian Contract Act, 1872 to place an order. If you are under 18, you may use the Website only with the involvement and consent of a parent or guardian.",
        ],
      },
      {
        heading: "Your account",
        body: [
          "You log in with a one-time code sent to your email address. You are responsible for keeping access to that email secure and for all activity and orders under your account. Tell us immediately if you suspect unauthorised use.",
        ],
      },
      {
        heading: "Products",
        body: [
          "We sell vinyl stickers, sticker packs and related products. We try to show designs, colours and sizes accurately, but colours may vary slightly between your screen and the printed product, and sizes are approximate because each design is cut to its own shape.",
          "All products are subject to availability. We may change, discontinue or limit quantities of any product without notice.",
        ],
      },
      {
        heading: "Pricing and payment",
        body: [
          [
            "All prices are in Indian Rupees (INR) and include applicable taxes (GST). Shipping charges, if any, are shown separately at checkout.",
            "The price that applies to your order is the one shown at checkout when you pay. We may change prices at any time, but changes do not affect orders already confirmed.",
            "If a product is listed at an incorrect price because of a technical or typographical error, we may cancel the order and refund you in full.",
            "Payments are processed by Razorpay Software Private Limited, a third-party payment gateway, using UPI, cards, netbanking or wallets. Your payment details are entered directly with Razorpay and are never stored by us. Your payment is also subject to Razorpay's terms and your bank's terms.",
            "We do not offer cash on delivery.",
          ],
        ],
      },
      {
        heading: "Orders",
        body: [
          "Placing an order is an offer to buy. An order is accepted once payment is confirmed and you receive an order confirmation. We may refuse or cancel any order, for example if an item is out of stock, the delivery address is not serviceable, the details provided are incomplete or false, or we suspect fraud or misuse. If we cancel an order you have paid for, we refund the full amount to your original payment method.",
          "By placing an order you confirm that your name, email, phone number and delivery address are accurate and complete.",
        ],
      },
      {
        heading: "Shipping, cancellations and refunds",
        body: [
          "Delivery is available within India only. Timelines, charges and what happens with undelivered parcels are described in our Shipping & Delivery Policy. Cancellations, replacements and refunds are governed by our Cancellation & Refund Policy. Both form part of these terms.",
        ],
      },
      {
        heading: "Bulk and custom orders",
        body: [
          "For custom stickers, you confirm that you own or have permission to use any artwork, logo or text you send us, and you are responsible for any claim that it infringes someone else's rights. We may refuse artwork that is unlawful, offensive or infringing. Price, quantity and delivery date are confirmed in writing before production starts.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `All content on the Website, including the ${b.brand} name and logo, original sticker designs, text, graphics and images, belongs to us or our licensors. Stickers are sold for personal use. You may not copy, reproduce, resell or commercially exploit our designs or content without our written permission.`,
        ],
      },
      {
        heading: "Acceptable use",
        body: [
          "You agree not to:",
          [
            "use the Website for any unlawful or fraudulent purpose",
            "attempt to access other users' accounts or data, or our systems, without permission",
            "interfere with the Website's operation, security or other users' use of it",
            "place orders with false details or use payment methods you are not authorised to use",
            "scrape, copy or harvest content or data from the Website by automated means",
          ],
        ],
      },
      {
        heading: "Third-party services",
        body: [
          "The Website relies on third parties such as payment gateways, courier partners and hosting providers. We are not responsible for their acts, omissions or downtime, though we will help you resolve any issue with an order.",
        ],
      },
      {
        heading: "Limitation of liability",
        body: [
          "The Website and products are provided on an \"as is\" and \"as available\" basis. To the extent permitted by law, our total liability for any claim relating to an order is limited to the amount you paid for that order. We are not liable for indirect, incidental or consequential losses, or for damage caused by applying stickers to surfaces (such as paint or finish being lifted on removal).",
        ],
      },
      {
        heading: "Indemnity",
        body: [
          "You agree to indemnify us against any claims, losses or costs arising from your breach of these terms or misuse of the Website, including any artwork you provide for custom orders.",
        ],
      },
      {
        heading: "Governing law and disputes",
        body: [
          `These terms are governed by the laws of India. Any dispute arising from them or from your use of the Website is subject to the exclusive jurisdiction of ${courts}. We encourage you to contact us first so we can try to resolve the issue informally.`,
        ],
      },
      { heading: "Complaints", body: grievance },
      {
        heading: "Changes to these terms",
        body: [
          "We may update these terms from time to time. The latest version, with its updated date, is always on this page. The version in force when you place an order applies to that order.",
        ],
      },
      { heading: "Contact", body: ["Questions about these terms:", contactLines] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    updated: UPDATED,
    body: [
      `This policy explains what personal data ${b.legalName} (operator of the ${b.brand} brand and ${b.site}) collects, why we collect it, who we share it with and the choices you have. It is published in accordance with the Information Technology Act, 2000, the rules made under it and the Digital Personal Data Protection Act, 2023. By using the Website, you consent to the practices described here.`,
    ],
    sections: [
      {
        heading: "Information we collect",
        body: [
          [
            "Order details: your name, email address, phone number and delivery address, and the products, amounts and status of the orders you place.",
            "Account details: your email address when you log in with a one-time code.",
            "Newsletter: your email address if you subscribe.",
            "Support: any messages, photos or videos you send us when you contact support.",
            "Technical data: basic information such as IP address, browser type and pages visited, collected by our hosting provider for security and to keep the Website running.",
          ],
        ],
      },
      {
        heading: "Payment information",
        body: [
          "Payments are processed by Razorpay. Your card number, UPI ID, bank or wallet credentials are entered directly on Razorpay's secure, PCI-DSS compliant checkout and are never collected or stored by us. We only receive a payment reference and status to confirm your order.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          [
            "to process, ship and deliver your orders and handle cancellations, replacements and refunds",
            "to send order confirmations, shipping updates and support replies",
            "to manage your account and log you in securely",
            "to prevent fraud, misuse and payment disputes",
            "to meet legal, tax and accounting obligations",
            "to send news about new stickers and offers, only if you subscribed (you can unsubscribe at any time)",
          ],
        ],
      },
      {
        heading: "Who we share it with",
        body: [
          "We share only what is needed with service providers who help us run the store:",
          [
            "Razorpay, to process payments and refunds",
            "courier and logistics partners, to deliver your parcel (name, address and phone number)",
            "Supabase, our database and login provider, and Cloudflare, our hosting provider",
            "government or law-enforcement authorities when required by law",
          ],
          "We do not sell, rent or trade your personal data to anyone.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "We use essential cookies and local storage to keep you logged in and remember your cart. We do not use advertising or cross-site tracking cookies. You can clear cookies in your browser at any time, but you may need to log in again.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Order and invoice records are kept for as long as required under Indian tax and accounting laws (generally 8 years). Account data is kept while your account is active. Newsletter emails are kept until you unsubscribe. Other data is deleted or anonymised when it is no longer needed.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          `You can ask us to access, correct, update or delete your personal data, withdraw consent, or stop marketing emails by writing to ${email}. We respond within 30 days. Some order records may need to be retained to meet legal obligations even after a deletion request.`,
        ],
      },
      {
        heading: "Security",
        body: [
          "Data is transmitted over encrypted HTTPS connections and stored with access controls, and only authorised people can access it. No method of transmission or storage is completely secure, but we take reasonable steps to protect your information and will notify you and the authorities of any breach as required by law.",
        ],
      },
      {
        heading: "Children",
        body: [
          "The Website is not directed at children. If you are under 18, please use it only with the consent and supervision of a parent or guardian. We do not knowingly collect data from children without such consent.",
        ],
      },
      { heading: "Complaints", body: grievance },
      {
        heading: "Changes to this policy",
        body: ["We may update this policy from time to time. The latest version, with its updated date, will always be on this page."],
      },
      { heading: "Contact", body: ["For privacy questions or requests:", contactLines] },
    ],
  },
  "bulk-orders": {
    title: "Bulk & Custom Orders",
    body: [`Need stickers for your brand, event or team? Email ${email} with quantity, sizes and artwork and we'll send a quote within 24 hours.`],
  },
  contact: {
    title: "Contact Us",
    body: [
      "Questions about an order, a refund or custom stickers? We're happy to help and usually reply within one working day. Please include your order ID if your message is about an order.",
    ],
    sections: [
      { heading: "Customer support", body: [contactLines] },
      {
        heading: "Business details",
        body: [
          only(
            `Brand: ${b.brand}`,
            `Legal entity: ${b.legalName}`,
            !!b.gstin && `GSTIN: ${b.gstin}`,
            !!b.address && `Registered address: ${b.address}`,
            `Website: ${b.site}`,
          ),
        ],
      },
      { heading: "Complaints", body: grievance },
    ],
  },
};
