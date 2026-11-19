import { useState } from "react";
import { MENU } from "./data/menu";
import { formatMoney } from "./utils/whatsapp";
import WhatsAppQRCard from "./components/WhatsAppQRCard";

const SHOP_NAME = "Sweet Crumb Bakery";
// Digits only, with country code. Put yours in a .env file: VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "919876543210";

const stepBtn =
  "size-[34px] cursor-pointer rounded-full border-2 border-ink text-lg leading-none " +
  "enabled:hover:bg-butter disabled:cursor-not-allowed disabled:opacity-35 " +
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-yolk";

export default function App() {
  const [qty, setQty] = useState({}); // { croissant: 2, sourdough: 1 }

  const change = (id, delta) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));

  // Merge the static menu with the live quantities into one "items" array
  const items = MENU.map((m) => ({ ...m, qty: qty[m.id] ?? 0 }));

  return (
    <main className="mx-auto grid max-w-[980px] gap-8 px-5 pb-14 pt-8 md:grid-cols-[1fr_340px] md:items-start">
      <section>
        <h1 className="mb-1.5 font-display text-4xl font-bold md:text-5xl">{SHOP_NAME}</h1>
        <p className="mb-6">Pick what you want, then scan the code to send your order.</p>

        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-ink/20 py-3.5"
            >
              <div className="grid gap-0.5">
                <strong>{item.name}</strong>
                <span className="text-sm opacity-75">{item.note}</span>
              </div>
              <span className="font-semibold">{formatMoney(item.price)}</span>
              <div className="flex items-center gap-2.5">
                <button
                  className={stepBtn}
                  onClick={() => change(item.id, -1)}
                  disabled={item.qty === 0}
                  aria-label={`Remove one ${item.name}`}
                >
                  -
                </button>
                <output className="min-w-[1.4em] text-center font-semibold" aria-live="polite">
                  {item.qty}
                </output>
                <button
                  className={stepBtn}
                  onClick={() => change(item.id, 1)}
                  aria-label={`Add one ${item.name}`}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="md:sticky md:top-6">
        <WhatsAppQRCard phoneNumber={WHATSAPP_NUMBER} shopName={SHOP_NAME} items={items} />
      </div>
    </main>
  );
}
