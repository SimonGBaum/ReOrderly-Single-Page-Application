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

This is a monorepo with a single `client/` package. There is no backend in the repository yet — the backend is Supabase, accessed directly from the frontend via environment variables.

```
client/
  src/           # React source (currently scaffold — build the app here)
  public/        # Static assets (icons.svg, favicon.svg)
  skeleton/      # Design documents: app_outline.md, style.guide.md, user_journey.md, wireframe PNGs
  dist/          # Production build output (git-ignored)
```

**Backend:** Supabase — URL and anon key live in `client/.env` (git-ignored). Access them via `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.

**Routing:** `react-router-dom` v7 is installed. All page routing should be wired up in `client/src/App.jsx`.

## Application: Reorderly

A recurring-order tracker. Users create, update, and track orders (medications, food, household goods) and set delivery frequencies. Single user type — no admin role. All data is private per user.

**Planned pages:** Login/Sign-Up, Home, Orders, Create Order, Update Order, Track Order, Draft, Sort, Profile, Contact Us, Error.

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

Supporting pages (Login, Sign-Up, Draft, Sort, Profile, Contact Us) use the full Voltron logo palette — all five lion accent colors as decorative highlights on a `#0D0D1A` deep space background.

The Error page uses the Galra Empire palette: `#0A0010` background, `#7B2FBE` primary accent.

**Fonts:** Orbitron (headings), Exo 2 (body/UI), Share Tech Mono (IDs, tracking numbers, timestamps) — all via Google Fonts.

**Icons:** Tabler Icons, outline style only, `1.5px` stroke.

**Buttons:** Angular (`border-radius: 4px`). Primary uses `--lion-accent` fill; secondary uses transparent fill with `--lion-accent` border.

**Page transitions:** The "Voltron assembly" effect — five colored bars sweep in from screen edges to center, hold one frame, then sweep back out as the new page appears. Total duration ≤ 600ms. Always wrap in `@media (prefers-reduced-motion: no-preference)` and fall back to a simple 150ms opacity crossfade.

**Microcopy tone:** Casual and witty, Voltron-universe flavored. 8th-grade reading level, active voice, sentence case. Examples: "Launch It" not "Submit", "The Galra got to this page. Try again." not "An error occurred."

**Accessibility:** WCAG AA contrast on all text, visible `:focus` states, `aria-label` on icon-only buttons, `<label>` on all form inputs, never use color as the sole error indicator.
