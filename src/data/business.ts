// Single source for the business identity shown on policy pages, the footer and structured data.
// Razorpay checks that the legal entity, address, phone and email match the merchant account.
// Leave a field empty to hide it everywhere until it's filled in.
export const business = {
  brand: "stickership",
  legalName: "Axion Tech",
  site: "stickership.shop",
  url: "https://stickership.shop",
  email: "stickershipindia@gmail.com",
  phone: "+91 75079 96166",
  address: "1110, Marwadi Galli, Aurad Sha, Nilanga, Maharashtra 413522", // registered address as on GST certificate
  jurisdiction: "Nilanga, Maharashtra", // city whose courts hear disputes
  gstin: "",
  hours: "Monday to Saturday, 10 AM – 6 PM IST (excluding public holidays)",
} as const;
