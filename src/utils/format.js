// src/utils/format.js
// Price, phone number, and Call/WhatsApp links.

export const fmtPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const digitsOnly = (p) => String(p).replace(/\D/g, "");

export const isValidPhone = (p) => digitsOnly(p).replace(/^0+/, "").length >= 10;

// Adds India's country code in front of a 10-digit number
export const intlPhone = (p) => {
  const d = digitsOnly(p).replace(/^0+/, "");
  return d.length === 10 ? "91" + d : d;
};

export const telLink = (item) => `tel:+${intlPhone(item.phone)}`;

export const waLink = (item) => {
  const msg = `Hi ${item.dealerName}, do you still have the ${item.brand} ${item.model} ${item.part} (${fmtPrice(item.price)}) available? Saw it on Car Scrap Hub.`;
  return `https://wa.me/${intlPhone(item.phone)}?text=${encodeURIComponent(msg)}`;
};
