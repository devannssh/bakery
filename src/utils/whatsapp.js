// Pure helper functions: no React, no side effects. Easy to test and reuse.

/** "+91 98765-43210" -> "919876543210" (wa.me wants digits only, with country code). */
export function cleanPhoneNumber(raw = "") {
  return String(raw).replace(/\D/g, "").replace(/^0+/, "");
}

/** Basic sanity check: international numbers are 8-15 digits (E.164). */
export function isValidPhone(raw) {
  const digits = cleanPhoneNumber(raw);
  return digits.length >= 8 && digits.length <= 15;
}

export function formatMoney(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Turns cart lines into the plain-text message the customer will send. */
export function buildOrderMessage({ shopName, lines, currency = "INR" }) {
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const rows = lines.map(
    (l) => `${l.qty} x ${l.name} - ${formatMoney(l.price * l.qty, currency)}`
  );
  return [
    `Hi ${shopName}! I'd like to order:`,
    "",
    ...rows,
    "",
    `Total: ${formatMoney(total, currency)}`,
    "",
    "Please confirm availability. Thank you!",
  ].join("\n");
}

/** The magic link: https://wa.me/<number>?text=<url-encoded message> */
export function buildWhatsAppLink(phone, message) {
  return `https://wa.me/${cleanPhoneNumber(phone)}?text=${encodeURIComponent(message)}`;
}