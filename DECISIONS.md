# Decisions

## Vite over Next.js

Vite was used because the requirements describe a shell app with client-side routing — no SSR, ISR, or file-based routing was needed. Vite starts faster, has zero framework opinions, and the existing scaffold was already Vite-based. Next.js would add complexity (app vs pages router, RSC vs client components) without any benefit for this scope.

## npm workspaces over Turborepo/Nx

npm workspaces is built into npm 8+ with no extra tooling. For two packages it covers everything needed: shared `node_modules`, `workspace:*` resolution, and root-level scripts. Turborepo or Nx would add incremental build caching and task orchestration, which are valuable at 5+ packages but overkill here.

## Theme tokens as a JS object, not just CSS

`theme.config.ts` exports tokens as a typed `Record<string, string>`. This lets the shell's `ThemeProvider` apply them programmatically via `document.documentElement.style.setProperty()` without importing any CSS file from app code. The `tokens.css` file still exists in the theme package for documentation and for cases where you want to embed the theme statically (e.g., in a `<link>` tag or a CSS-in-HTML email).

## ThemeProvider writes to `document.documentElement`, not a wrapper div

Writing to `:root` keeps specificity minimal — the same specificity as the fallback CSS, so overrides work without `!important`. A wrapper div would require every CSS selector in the app to be scoped under it, which is invasive. The `documentElement` approach is transparent to all existing CSS.

## ApiContext for adapter injection

Pages call `useApi()` — they don't import adapter files directly. This makes API adapters replaceable without touching any page component (acceptance criterion). It also makes unit testing straightforward: supply a mock adapter via `<ApiProvider>`.

## API adapters are factories, not singletons

`createBillingApi()` returns a closure over local state. This means the in-memory "database" is scoped to one adapter instance. Tests create fresh instances, preventing cross-test state leakage.

## React Router v6 (BrowserRouter) over file-based routing

Explicit `<Routes>` in `App.tsx` keeps the routing visible in one place. For a white-label shell that might wrap different route trees per tenant, having routing in code (not the filesystem) is easier to make conditional or composable.

## TenantProvider reads URL params at startup

Tenant is resolved from `?tenant=alpha&locale=en-US` on load. This lets you share a URL with a specific brand active — useful for QA and demos. A production implementation might also check a subdomain, a JWT claim, or an API response; the `setTenant()` function makes that extensible without changing page code.

## Protected routes via ProtectedRoute wrapper, not per-page checks

A single `<ProtectedRoute>` component at the router level keeps auth logic out of page components. Pages do not need to check tokens or redirect. Auth mechanism (currently `localStorage`) is contained in one file.

## Fallback theme is pure CSS, brand theme is CSS-vars-as-JS

The fallback (`styles/fallback.css`) is a plain CSS file imported in `main.tsx` — it always loads and defines all custom property defaults. Brand tokens only override specific properties. This means: if the theme package is unavailable or the `brandId` is unrecognised, the app still renders correctly with the default blue palette.

## React 18 (not 19)

The existing scaffold used React 19 RC, but `@testing-library/react` 16 targets React 18. Using React 18 avoids compatibility issues in tests without sacrificing any feature used in this project.

## What was deliberately not built

- **Storybook** — the two `BrandButton` / `BrandCard` components are simple enough to review in context. Storybook would be valuable if the theme package grew to 10+ components with complex states.
- **i18n library** — `Intl.DateTimeFormat` and `Intl.NumberFormat` cover the locale/currency requirements without a dependency.
- **State management library** — React context is sufficient for two small contexts (tenant + API). A store would be premature.
- **CSS-in-JS** — CSS modules + CSS custom properties are already a strong, zero-runtime theming system. Adding styled-components or vanilla-extract would not improve the architecture for this scope.
