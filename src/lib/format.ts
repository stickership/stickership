export const SHIPPING_FEE = 49;
export const FREE_SHIPPING_FROM = 299;

export const shippingFor = (subtotal: number) => (subtotal >= FREE_SHIPPING_FROM || subtotal === 0 ? 0 : SHIPPING_FEE);

export const rs = (n: number) => `Rs. ${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const PAGE_SIZE = 24;
