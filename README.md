# WhatsApp QR Order Card (React)

A small React feature for a shop website. Customers pick items from a menu, and a card shows a **QR code**. Scanning it opens WhatsApp on their phone with a chat to **your number**, and the message box is **already filled** with their order. They only press Send.

Demo shop: **Sweet Crumb Bakery**.

## How it works (30-second version)

```
selected items -> order text -> https://wa.me/<your-number>?text=<encoded text> -> QR code
```

No backend, no WhatsApp API key, no cost. The QR code simply contains a `wa.me` link.

## Quick start

```bash
npm create vite@latest bakery -- --template react
cd bakery
npm install qrcode.react tailwindcss @tailwindcss/vite
```

Then:

1. Replace the `vite.config.js` Vite created with the one from this project (it adds the Tailwind plugin).
2. Copy the `src/` folder from this project over the one Vite created (this replaces `index.css` and `App.jsx`; you can delete `App.css`).
3. Add a `.env` file in the project root:

```
VITE_WHATSAPP_NUMBER=919876543210
```

Use your own number: digits only, **country code first**, no `+`, no spaces, no leading zeros (India: `91` + 10-digit number).

4. Run it:

```bash
npm run dev
```

This project uses **Tailwind CSS v4**. If your site already uses Tailwind v3, see the note in `docs/DECISIONS-AND-LEARNING.md` (section 7).

## Files

```
src/
  App.jsx                       demo shop: menu, quantity buttons, state
  index.css                     Tailwind import + colour/font tokens
  components/
    WhatsAppQRCard.jsx          the reusable feature (QR + summary, styled with Tailwind)
  utils/
    whatsapp.js                 builds the message and the wa.me link
  data/
    menu.js                     bakery items (swap for your own)
vite.config.js                  Vite + Tailwind plugin
docs/
  DECISIONS-AND-LEARNING.md     why it's built this way + how it works
```

## Using the card in your own site

```jsx
import WhatsAppQRCard from "./components/WhatsAppQRCard";

<WhatsAppQRCard
  phoneNumber="919876543210"
  shopName="Sweet Crumb Bakery"
  items={[{ id: "croissant", name: "Butter Croissant", price: 90, qty: 2 }]}
  currency="INR"
/>
```

| Prop | Type | Notes |
|---|---|---|
| `phoneNumber` | string | WhatsApp number with country code |
| `shopName` | string | Shown on the card and in the message greeting |
| `items` | `{id, name, price, qty}[]` | Items with `qty: 0` are ignored |
| `currency` | string | ISO code, default `"INR"` |

## Customising

- **Message wording:** edit `buildOrderMessage` in `src/utils/whatsapp.js`.
- **Menu:** edit `src/data/menu.js`.
- **Colours and fonts:** the `@theme` block in `src/index.css`. Change `--color-ink`, `--color-butter` etc. and every class (`bg-butter`, `text-ink`...) updates. Keep `--color-page` equal to your page background so the receipt notches blend in.
- **Another shop type:** only the menu data changes.

## Test it

1. Pick a few items and scan the QR with your phone camera.
2. WhatsApp should open on your number with the order typed in.
3. No phone handy? Click **Order from this phone** to open the same link.

Read `docs/DECISIONS-AND-LEARNING.md` for the reasoning and a walkthrough of each piece.
