import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  buildOrderMessage,
  buildWhatsAppLink,
  formatMoney,
  isValidPhone,
} from "../utils/whatsapp";

// A QR code stores text. Past roughly this length it becomes dense and hard to scan.
const MAX_LINK_LENGTH = 1800;

// Shared by the empty / error states so the card doesn't jump in height.
const noteBase = "grid min-h-[228px] place-items-center text-center leading-snug";

// The dashed "tear" line plus a half-circle notch on each side (Tailwind's before:/after: variants).
const notch =
  "before:absolute before:-top-3 before:-left-[13px] before:size-[22px] before:rounded-full before:border-2 before:border-ink before:bg-page before:content-[''] " +
  "after:absolute after:-top-3 after:-right-[13px] after:size-[22px] after:rounded-full after:border-2 after:border-ink after:bg-page after:content-['']";

/**
 * Props
 *  - phoneNumber: shop's WhatsApp number, with country code (e.g. "919876543210")
 *  - shopName:    shown on the card and in the first line of the message
 *  - items:       [{ id, name, price, qty }]  (items with qty 0 are ignored)
 *  - currency:    ISO code, default "INR"
 *
 * Needs the colour tokens (ink, butter, page, yolk) from src/index.css.
 */
export default function WhatsAppQRCard({
  phoneNumber,
  shopName,
  items,
  currency = "INR",
}) {
  const lines = useMemo(() => items.filter((i) => i.qty > 0), [items]);
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  const link = useMemo(() => {
    if (lines.length === 0) return "";
    const message = buildOrderMessage({ shopName, lines, currency });
    return buildWhatsAppLink(phoneNumber, message);
  }, [lines, shopName, phoneNumber, currency]);

  let body;
  if (!isValidPhone(phoneNumber)) {
    body = (
      <p className={`${noteBase} text-red-800`} role="alert">
        The shop's WhatsApp number is missing or invalid. Use digits with the
        country code, like 919876543210.
      </p>
    );
  } else if (lines.length === 0) {
    body = (
      <p className={noteBase}>
        Add something from the menu and your order code will appear here.
      </p>
    );
  } else if (link.length > MAX_LINK_LENGTH) {
    body = (
      <p className={`${noteBase} text-red-800`} role="alert">
        This order is too long for one code. Remove a few items or split it into
        two orders.
      </p>
    );
  } else {
    body = (
      <>
        {/* White padding = the "quiet zone" a QR code needs to scan reliably */}
        <div className="rounded-xl border-2 border-ink bg-white p-3.5 leading-none">
          <QRCodeSVG
            value={link}
            size={200}
            level="M"
            title="Scan to send your order on WhatsApp"
          />
        </div>
        <a
          className="inline-block rounded-full bg-ink px-[18px] py-2.5 font-semibold text-butter no-underline hover:bg-[#3a3590] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-yolk"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Order from this phone
        </a>
      </>
    );
  }

  return (
    <aside
      className="w-full max-w-[340px] overflow-hidden rounded-[20px] border-2 border-ink bg-butter font-body text-ink"
      aria-label="WhatsApp order code"
    >
      <header className="px-5 pb-2 pt-5">
        <h2 className="mb-1 font-display text-2xl font-bold leading-tight">{shopName}</h2>
        <p className="text-sm leading-snug">
          Scan with your phone camera to send this order on WhatsApp.
        </p>
      </header>

      <div className="grid justify-items-center gap-3.5 px-5 pb-[22px] pt-3">{body}</div>

      <div className={`relative border-t-2 border-dashed border-ink ${notch}`} aria-hidden="true" />

      <footer className="px-5 pb-5 pt-4 text-[0.92rem]">
        {lines.length === 0 ? (
          <p className="text-center opacity-70">Your order is empty</p>
        ) : (
          <>
            <ul className="mb-2.5 grid gap-1.5">
              {lines.map((l) => (
                <li key={l.id} className="flex justify-between gap-3">
                  <span>{l.qty} x {l.name}</span>
                  <span>{formatMoney(l.price * l.qty, currency)}</span>
                </li>
              ))}
            </ul>
            <p className="flex justify-between gap-3 border-t border-ink pt-2.5 text-[1.05rem] font-bold">
              <span>Total</span>
              <span>{formatMoney(total, currency)}</span>
            </p>
          </>
        )}
      </footer>
    </aside>
  );
}
