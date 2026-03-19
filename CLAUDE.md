# Secret Friend

Mobile-friendly PWA for organizing Secret Friend (Secret Santa) gift exchanges. Players draw names in person on a single device — no accounts needed. Bilingual (English/Arabic with RTL).

## Tech Stack

React 19 + TypeScript 5.9, Vite 8, Tailwind CSS 4, Vitest + Testing Library, Playwright, vite-plugin-pwa + Workbox.

## Commands

```bash
npm ci --legacy-peer-deps   # Install dependencies (Node 20+)
npm run dev                  # Dev server with HMR
npm run build                # TypeScript check + production build
npm run lint                 # ESLint
npm run test                 # Vitest (once)
npm run test:watch           # Vitest watch mode
npm run test:coverage        # Vitest with v8 coverage
npm run test:e2e             # Playwright e2e tests
npm run test:e2e:ui          # Playwright interactive UI
```

## Project Structure

- `src/App.tsx` — Central state management and phase-based screen routing
- `src/screens/` — Full-page screens: Home, Setup, Draw, Results
- `src/components/` — Reusable UI: AddPlayersForm, GameIdeaButton, PinInput
- `src/utils/` — Draw algorithm, sounds (Web Audio), haptics, localStorage persistence
- `src/i18n/` — Translation dictionary, LanguageContext, useLanguage hook
- `src/types.ts` — TypeScript types (GameState, GamePhase, Assignments)
- `src/test/` — Test setup and helpers
- `e2e/` — Playwright e2e tests

## Architecture

- **State**: Centralized in App.tsx via `useState`, persisted to localStorage during draw/results phases.
- **Phases**: `home → setup-pin → setup-players → draw → results → home` (with continue from save).
- **i18n**: Key-value dictionary with `{param}` interpolation. RTL toggled via `document.dir`.
- **Styling**: Tailwind utility classes + custom animations in `index.css`. Rose primary, amber accent.
- **Draw algorithm** (`src/utils/draw.ts`): `getAvailableRecipients` → `drawRandom` → `performSwap` (edge-case handler ensuring nobody draws themselves).

## Conventions

- Functional components with hooks, props drilling for state updates.
- Unit tests co-located with source (`*.test.ts` / `*.test.tsx` in same directory or `src/test/`).
- E2E tests in `e2e/` directory, run against preview build on port 4173.
- ESLint flat config; unused vars must match `^[A-Z_]`.
- Accessibility: ARIA labels, roles, live regions, focus management, keyboard trapping.
- PWA: auto-update via Workbox, offline caching for static assets.
