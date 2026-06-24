# Multi-Tenant Frontend — Monorepo

A minimal multi-tenant frontend architecture with a shell app and a brand theme package.

## Structure

```
apps/
  player-shell/          # Vite + React + TypeScript shell app
themes/
  theme-tenant-alpha/    # Brand theme package (CSS tokens + components)
```

## Prerequisites

- Node.js 18+
- npm 8+ (workspaces support)

## Setup

```bash
# Install all workspace dependencies from the repo root
npm install
```

## Run the shell app

```bash
# From repo root
npm run dev

# Or directly
cd apps/player-shell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Switch themes

- **URL param:** `http://localhost:5173?tenant=alpha` activates the Alpha brand theme
- **Runtime toggle:** click the **Theme** button in the header to switch without a page reload

## Run tests

```bash
# From repo root
npm test

# Watch mode
cd apps/player-shell && npm run test:watch
```

## Build

```bash
npm run build
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — tenant info, nav links, theme demo |
| `/auth/login` | Login form with validation |
| `/account/billing` | Billing dashboard (protected, requires login) |

### Login credentials (mock)

Any email + any password of 8+ characters. Use password `wrong` to trigger the error state.

## Packages

| Package | Version |
|---------|---------|
| React | 18 |
| React Router | 6 |
| Vite | 5 |
| TypeScript | 5 |
| Vitest | 2 |
| Testing Library | 16 |
