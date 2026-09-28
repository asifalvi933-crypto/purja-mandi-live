// src/utils/format.js
// Price, phone number aur Call/WhatsApp links.

export const fmtPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");

export const digitsOnly = (p) => String(p).replace(/\D/g, "");

export const isValidPhone = (p) => digitsOnly(p).replace(/^0+/, "").length >= 10;

// 10 digit number ke aage India ka code 91 lagata hai
export const intlPhone = (p) => {
  const d = digitsOnly(p).replace(/^0+/, "");
  return d.length === 10 ? "91" + d : d;
};

export const telLink = (item) => `tel:+${intlPhone(item.phone)}`;

export const waLink = (item) => {
  const msg = `Namaste ${item.dealerName}, aapke paas ${item.brand} ${item.model} ka ${item.part} (${fmtPrice(item.price)}) available hai? Purja Mandi par dekha.`;
  return `https://wa.me/${intlPhone(item.phone)}?text=${encodeURIComponent(msg)}`;
};
