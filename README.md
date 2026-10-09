# Suppliers POS (Lab4)

React Native app built from the **Lab4** Figma design — a supplier point-of-sale
and inventory dashboard. Built with Expo SDK 57 and Expo Router, and runs in
**Expo Go** with no native build step.

## Screens

All five screens match the Figma file and live in the 5-tab bottom navigation.

| Route | Screen | What's in it |
| --- | --- | --- |
| `/` | Dashboard | Green hero header, today's sales + sparkline, 3 stat chips, quick actions grid, recent transactions, "New Sale" CTA |
| `/inventory` | Inventory | Search field, filter chips (All / Low Stock / Grocery / Deletes), product rows with stock pills, FAB |
| `/pos` | Point of Sale | 3-column product grid with add buttons, live Current Order with qty steppers, total, Checkout |
| `/payment` | Payment | Amount-due banner, payment method radios (Cash / Card / GCash), cash received + change, Confirm |
| `/reports` | Reports | Day/Week/Month segmented control, weekly sales bar chart, highlight tiles, Export Report |

## Run it on your phone

```bash
npm install
npx expo start
```

Then scan the QR code with **Expo Go** (make sure your phone and this PC are on
the same Wi-Fi). Press `a` for an Android emulator or `i` for an iOS simulator
if you have those available.

## Project layout

```
src/
  app/
    _layout.tsx          # root stack + CartProvider + SafeAreaProvider
    (tabs)/
      _layout.tsx        # tab navigator + custom active-tab pill/indicator
      index.tsx          # Dashboard
      inventory.tsx
      pos.tsx
      payment.tsx
      reports.tsx
  components/            # Card, ListRow, Pill, PrimaryButton, IconBadge, ScreenHeader
  constants/theme.ts     # colors, radii, spacing, type scale, peso() formatters
  data/seed.ts           # mock products, transactions, chart + filter data
  store/cart.tsx         # shared basket so POS and Payment stay in sync
```

Routing follows Expo Router file-based conventions: any file in `src/app/` is a
screen, and `_layout.tsx` files define navigators. Shared code lives outside
`src/app/` and is imported with the `@/` alias.

## Notes

- The POS cart is in-memory. Adding an item in `/pos` updates the amount due in
  `/payment`, and Confirm Payment clears the basket and returns to POS.
- Data is static mock data in `src/data/seed.ts` — wire it to your API when ready.
- Only Expo Go bundled modules are used, so the app needs no development build.

## Design tokens

Colours, radii, spacing and the Inter type scale in `src/constants/theme.ts` were
read from the Figma REST API rather than eyeballed. Two details worth knowing if
you re-derive them:

- The file uses **layered `fills` arrays**. Figma paints fills bottom-up, so the
  **last** solid entry is the visible colour — not the first. Several key values
  (the green header, active chips, POS buttons) have an indigo or violet gradient
  underneath a green fill, so reading `fills[0]` gives the wrong colour.
- Text nodes often stack a white fill over a semi-transparent black one; the
  visible result is much darker than the raw colour suggests.

`npm run verify:theme` asserts the 26 colour tokens still match the file.

### Intentional deviation

The source file gives the screen titles four different black opacities
(Inventory 0.76, POS 0.44, Payment 0.31, Reports 0.42), so they render as
inconsistently washed-out greys. This build uses one dark title colour for all of
them. Change `ScreenHeader` in `src/components/ScreenHeader.tsx` if you want the
original per-screen weights.

## Checks

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run verify:theme   # tokens vs. the Figma values
npx expo-doctor
```