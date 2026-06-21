# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `client/` directory:

```bash
npm run dev        # start Vite dev server with HMR
npm run build      # production build → client/dist/
npm run preview    # preview the production build locally
npm run lint       # run ESLint
```

No test runner is configured yet.

## Architecture

Monorepo with a single `client/` package and a `supabase/` reference directory.

```
client/
  src/
    context/     # AuthContext + OrdersContext (React Context + useReducer)
    data/        # localStorage data layer (userStore.js, orderStore.js)
    pages/       # One folder per route, each with JSX + CSS
    components/  # Shared UI (Navbar, PageWrapper, ProtectedRoute, VoltronTransition, OfflineBanner)
    styles/      # tokens.css (CSS custom props) + animations.css
    utils/       # hashPassword, generateId, formatDate, debounce
  skeleton/      # Design docs: app_outline.md, style.guide.md, user_journey.md, wireframe PNGs
supabase/
  reference/     # testing_schema.sql (DB schema — not yet wired to the app)
```

**Current data persistence: localStorage only.** Despite Supabase credentials existing in `client/.env`, the app does not call Supabase yet. All reads/writes go through `src/data/userStore.js` and `src/data/orderStore.js`. The Supabase schema lives in `supabase/reference/testing_schema.sql` as a reference for a future migration.

**Routing:** Wired in `src/App.jsx`. Public routes: `/login`, `/signup`, `/contact`, `/error`. All other routes are wrapped in `<ProtectedRoute>` which redirects to `/login` if no session exists.

**Auth flow:** `AuthContext` stores the logged-in user in React state and mirrors session to `localStorage` (`reorderly_session` key). `OrdersContext` watches `AuthContext` and resets on logout.

**Data layer API surface:**

- `userStore.js` — `createUser`, `getUserByUsername`, `getUserByEmail`, `getUserById`, `updateUser`, `saveSession`, `getSession`, `clearSession`
- `orderStore.js` — `createOrder`, `getOrdersByUser`, `getOrderById`, `updateOrder`, `deleteOrder`, `saveDraft`, `getDraft`, `clearDraft`

Passwords are SHA-256 hashed client-side (Web Crypto API) before storage — see `src/utils/hashPassword.js`.

## Application: Reorderly

A recurring-order tracker. Users create, update, and track orders (medications, food, household goods) and set delivery frequencies. Single user type — no admin role. All data is private per user.

**Pages:** Login, Sign-Up, Home, Orders, Create Order, Update Order, Track Order, Profile, Contact Us, Error.

**Order shape (key fields):** `id`, `userId`, `status` (draft/active/paused/completed/cancelled), `orderType` (one-time/recurring), `orderNickname`, `productName`, `productType`, `quantity`, `storeName`, `storeAddress`, `itemDescription`, `deliveryFrequency` (weekly/biweekly/monthly/custom), `customFrequencyDays`, `numberOfDeliveries`, `untilCancelled`, `deliveriesCompleted`, `lastDeliveryDate`, `expectedDeliveryDate`, `dateCreated`.

## Design System — Voltron Theme

`client/skeleton/style.guide.md` is the **single source of truth** for all visual and UX decisions. Read it before building any UI. Key rules:

**Per-page lion theming:** The five main functional pages each map to a Voltron lion. Apply the lion's colors as CSS custom properties on the page wrapper:

| Page | Lion | `--lion-color` | `--lion-accent` |
|---|---|---|---|
| Home | Black | `#1C1C2E` | `#C9A84C` |
| Create | Red | `#8B1A1A` | `#FF4040` |
| Orders | Blue | `#0D2B5E` | `#4A9EE8` |
| Update | Green | `#0F3320` | `#3DCA5A` |
| Track | Yellow | `#3D2E00` | `#F0C030` |

Supporting pages (Login, Sign-Up, Profile, Contact Us) use the full Voltron logo palette — all five lion accent colors as decorative highlights on a `#0D0D1A` deep space background.

The Error page uses the Galra Empire palette: `#0A0010` background, `#7B2FBE` primary accent.

**Fonts:** Orbitron (headings), Exo 2 (body/UI), Share Tech Mono (IDs, tracking numbers, timestamps) — all via Google Fonts.

**Icons:** Tabler Icons, outline style only, `1.5px` stroke.

**Buttons:** Angular (`border-radius: 4px`). Primary uses `--lion-accent` fill; secondary uses transparent fill with `--lion-accent` border.

**Page transitions:** The "Voltron assembly" effect — five colored bars sweep in from screen edges to center, hold one frame, then sweep back out as the new page appears. Total duration ≤ 600ms. Always wrap in `@media (prefers-reduced-motion: no-preference)` and fall back to a simple 150ms opacity crossfade. Implemented in `src/components/VoltronTransition/`.

**Microcopy tone:** Casual and witty, Voltron-universe flavored. 8th-grade reading level, active voice, sentence case. Examples: "Launch It" not "Submit", "The Galra got to this page. Try again." not "An error occurred."

**Accessibility:** WCAG AA contrast on all text, visible `:focus` states, `aria-label` on icon-only buttons, `<label>` on all form inputs, never use color as the sole error indicator.
