# Secret Friend

A mobile-friendly web app for organizing Secret Friend gift exchanges. Players take turns drawing names in person, with each assignment revealed privately — no sign-ups or accounts required.

Built as a Progressive Web App (PWA) so it can be installed on any device and works offline.

## Features

- **In-person drawing** — pass the phone around; each player draws a name privately
- **PIN-protected results** — only the organizer can reveal all assignments
- **Smart draw algorithm** — handles edge cases so nobody draws themselves
- **Add players mid-game** — latecomers can join after the draw has started
- **Bilingual** — English and Arabic with full RTL support
- **Sound effects & haptics** — audio feedback and vibration patterns
- **Confetti celebration** — because why not
- **Offline-ready PWA** — installable, works without internet
- **Persistent state** — game survives page refreshes via localStorage

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + Playwright |
| PWA | vite-plugin-pwa + Workbox |
| CI/CD | GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm ci --legacy-peer-deps
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview   # preview the production build locally
```

## Testing

```bash
npm run test            # unit tests (single run)
npm run test:watch      # unit tests (watch mode)
npm run test:coverage   # unit tests with coverage report
npm run test:e2e        # Playwright end-to-end tests
npm run test:e2e:ui     # Playwright with interactive UI
```

## Linting

```bash
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components (AddPlayersForm, PinInput, GameIdeaButton)
├── screens/          # Screen components (Home, SetupPin, SetupPlayers, Draw, Results)
├── i18n/             # Translations (EN/AR) and language context provider
├── utils/            # Draw algorithm, sound effects, haptics
├── assets/           # Static assets
├── fonts/            # Font files
└── test/             # Test setup and utilities
e2e/                  # Playwright end-to-end tests
public/               # PWA icons and manifest
.github/workflows/    # CI pipeline (lint, unit tests, e2e)
```

## How It Works

1. **Set a PIN** — the organizer creates a 4-digit PIN
2. **Add players** — enter at least 3 participant names
3. **Draw names** — each player taps to reveal who they got, then passes the device
4. **View results** — the organizer can unlock all assignments with the PIN

## License

MIT
