# Architecture

## Overview

The project is a monorepo with two workspaces:

```
apps/player-shell      → shell application (features, routing, API)
themes/theme-tenant-alpha → brand theme package (tokens, UI components)
```

The core invariant: **feature code never knows which theme is active.** It reads CSS custom properties. The theme only knows about design tokens and presentational concerns — never about business logic.

---

## Shell App (`apps/player-shell`)

### Layer diagram

```
main.tsx
  └─ App.tsx
       ├─ TenantProvider    (brandId, locale, currency)
       ├─ ThemeProvider     (applies CSS vars from active theme)
       ├─ ApiProvider       (injects API adapters)
       └─ BrowserRouter
            ├─ Layout       (nav, footer, theme toggle)
            └─ Pages
                 ├─ HomePage
                 ├─ LoginPage
                 └─ BillingPage (protected)
```

### TenantContext

Holds runtime tenant configuration: `brandId`, `locale`, `currency`. Resolved at startup from URL search params (`?tenant=alpha&locale=en-US&currency=USD`), with defaults for anything not specified. Any component can call `useTenant()` to read or change these values.

### ThemeProvider

Takes an optional `tokens` object (a `Record<string, string>` of CSS custom property names to values). On mount it writes each token to `document.documentElement.style`. On unmount it removes them — the fallback CSS vars from `styles/fallback.css` take effect again. This is the **only** place in the shell that knows about theme tokens.

### ApiContext

Injects `identityApi` and `billingApi` adapters into the React tree. Pages consume `useApi()` — they have no knowledge of the implementation. In tests, a mock adapter is supplied via `<ApiProvider>`. Swapping real implementations requires touching only `App.tsx`.

### API adapters (`src/api/`)

```
types.ts          → shared TypeScript interfaces (IdentityApi, BillingApi)
identityApi.ts    → mock: login (localStorage token), logout
billingApi.ts     → mock: getBillingInfo, updateBillingAmount
```

All adapter functions return Promises that match the interface in `types.ts`. A real HTTP implementation would be a drop-in replacement.

---

## Theme Package (`themes/theme-tenant-alpha`)

### What it contains

```
src/
  tokens.css         → CSS custom properties under :root (for standalone/CSS use)
  theme.config.ts    → same tokens as a typed JS object (for programmatic use)
  components/
    BrandButton.tsx  → presentational button, reads CSS vars
    BrandCard.tsx    → presentational card container, reads CSS vars
  index.ts           → public surface
```

### What it must NOT contain

- Business logic, API calls, routing
- Direct knowledge of the shell's page structure
- Imports from `player-shell`

### How the shell consumes the theme

```
App.tsx imports themeConfig.tokens from theme-tenant-alpha
    ↓
Passes to ThemeProvider (shell's own provider)
    ↓
ThemeProvider.useEffect writes CSS vars to document.documentElement
    ↓
All CSS in the app reads var(--color-primary) etc. — they pick up the brand values
```

The shell **never** imports `tokens.css` directly. The CSS file exists as documentation and for potential server-side or static embedding scenarios.

---

## Theme boundary rules

| Allowed | Forbidden |
|---------|-----------|
| Shell imports `themeConfig.tokens` (JS object) | Shell imports `tokens.css` from theme package |
| Shell imports `BrandButton`, `BrandCard` components | Theme package imports from shell |
| Pages use `var(--color-primary)` in CSS | Pages reference brand-specific values directly |
| `ThemeProvider` (shell) applies tokens at runtime | Page components apply tokens directly |

---

## Adding a new brand

1. Create `themes/theme-tenant-beta/` mirroring `theme-tenant-alpha`'s structure.
2. In `App.tsx`, add a branch: `tenant.brandId === 'beta' ? betaThemeConfig.tokens : ...`
3. No page or feature code changes.

## Adding a new page

1. Create `src/pages/NewPage.tsx` and its CSS file.
2. Add a `<Route>` in `App.tsx`.
3. Use `useApi()` for data, `useTenant()` for locale/currency formatting.
4. Wrap in `<ProtectedRoute>` if auth is required.

## Replacing API adapters

Implement the `IdentityApi` or `BillingApi` interface from `src/api/types.ts` and pass the new instance to `<ApiProvider>` in `App.tsx`. Zero page changes.
