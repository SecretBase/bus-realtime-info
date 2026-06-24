# Agent Guide — Bus Realtime Info

Instructions for AI agents working in this repository.

## Project overview

**Bus Realtime Info** is a Progressive Web App (PWA) for checking real-time bus arrival times (ETA) in Hong Kong. Users browse routes, view stops along a route, and see live ETAs from multiple operators.

| Area | Detail |
|------|--------|
| Domain | Hong Kong public bus ETA |
| Operators | CTB (Citybus), KMB; NWFB shares the Citybus API surface |
| UI language | Traditional Chinese (`tc`) for user-facing copy |
| Deployment | Netlify with Edge Functions (`@sveltejs/adapter-netlify`) |
| Package manager | **Bun** (`bun@1.3.14`) — use `bun`, not npm/yarn/pnpm |

## Tech stack

- **SvelteKit 2** + **Svelte 5** (runes: `$state`, `$derived`, `$props`, `{@render}`)
- **TypeScript** (strict)
- **Tailwind CSS 4** — theme tokens in `src/routes/app.css` (`vesuvius-*` palette)
- **TanStack Query** (`@tanstack/svelte-query`) for data fetching and caching
- **TanStack Virtual** (`@tanstack/svelte-virtual`) for large route lists
- **Axios** with `fetch` adapter (`src/lib/api/api.ts`)
- **Workbox** service worker for PWA caching
- **date-fns** for ETA formatting (`zhHK` locale on stop pages)

## Commands

```bash
bun install          # install dependencies
bun run dev          # dev server (opens browser)
bun run build        # production build
bun run preview      # preview production build
bun run check        # TypeScript + Svelte type check
bun run lint         # Prettier + ESLint
bun run format       # auto-format with Prettier
```

There is no test runner configured. Do not add a test framework unless explicitly requested.

## Project structure

```
src/
├── routes/                         # SvelteKit file-based routing
│   ├── +page.svelte                # Home — route list with search + virtual scroll
│   ├── +layout.svelte / +layout.ts # QueryClientProvider, footer, analytics
│   ├── favorites/+page.svelte      # Saved stops (local storage)
│   └── [companyId]/route/[route]/
│       ├── +page.svelte            # Route detail — stop list, direction toggle
│       └── stop/[stopId]/+page.svelte  # Stop detail — live ETA, favorites
├── lib/
│   ├── api/
│   │   ├── api.ts                  # Shared Axios instance
│   │   ├── common/types.ts         # APIResponse<T> wrapper
│   │   ├── ctb/                    # Citybus / NWFB API client + types
│   │   └── kmb/                    # KMB API client + types
│   ├── components/                 # Reusable Svelte components
│   ├── stores/favorites.ts         # Persisted favorites (localStorage)
│   ├── utils/eta.ts                # ETA sort/format helpers
│   └── constants.ts                # e.g. REFETCH_EVERY_TEN_SECONDS
└── service-worker.ts               # PWA precache + API caching
```

## Data sources

| Operator | Base URL | Client module |
|----------|----------|---------------|
| CTB / NWFB | `https://rt.data.gov.hk/v2/transport/citybus` | `src/lib/api/ctb/` |
| KMB | `https://data.etabus.gov.hk` | `src/lib/api/kmb/` |

All responses use the shared `APIResponse<Data, ApiType>` shape:

```ts
{ type, version, generated_timestamp, data }
```

The service worker caches CTB route/stop endpoints (not ETA) with stale-while-revalidate. KMB caching is configured separately in `src/service-worker.ts`.

## Architecture patterns

### TanStack Query

- `QueryClient` is created in `src/routes/+layout.ts` with `staleTime: 5000` and `enabled: browser`.
- Each API function has a matching `get*QueryKey` helper in the same module — always use these for `queryKey`.
- Route lists use `staleTime: Infinity` (static data). ETA queries use `refetchInterval: REFETCH_EVERY_TEN_SECONDS` (10s).
- Wrap pages in the layout's `QueryClientProvider`; use `createQuery` in page components.

### Dual-operator branching

CTB and KMB have different API shapes. Pages branch on `companyId` from route params:

```ts
companyId === 'CTB'
  ? getRoute({ companyId, route })
  : getKMBRoute({ direction, route, serviceType: '1' })
```

KMB routes are normalized on the home page (`bound === 'I'`, `co: 'KMB'`). Expect `as unknown as Promise<APIResponse<...>>` casts where types diverge — fix types at the source when possible, but do not refactor both operators unless the task requires it.

### Svelte 5 conventions

- Use runes (`$state`, `$derived`, `$derived.by`, `$props`) — not legacy `export let` / `$:` reactive statements.
- Snippets: `{@render children()}` in layout and button components.
- Prefer `$derived(createQuery(...))` when query inputs are reactive (see route pages).
- Components live in `src/lib/components/` and are imported via `$lib/...`.

### Styling

- Tailwind utility classes; custom theme colors are `vesuvius-50` through `vesuvius-900`.
- Mobile-first layout: `max-w-md` containers, `100dvh` page height, safe-area footer.
- Reuse existing components (`Button`, `LoadingSkeleton`, `LoadingSpinner`, `RouteHeader`, `CompanyBadge`, `StopListItem`) before creating new ones.

### Favorites

- Stored in `favorites` persisted store (`src/lib/stores/favorites.ts`).
- Shape: `{ companyId, routeId, stopId, direction? }`.
- `CompanyId` type is currently `'CTB'` only; KMB favorites use the same store with runtime values.

### ETA display

- `src/lib/utils/eta.ts` — sort by arrival time, format minutes.
- Buses arriving within 1 minute show **即將到達** (not a minute count).
- ETA data auto-refreshes every 10 seconds on stop detail pages.

## Coding guidelines

### Scope and style

- **Minimize diff size.** Fix the root cause in shared code rather than patching every caller.
- **Reuse before adding.** Check `src/lib/` for existing utils, components, and API helpers.
- **No new dependencies** unless necessary and requested.
- **No test framework** unless explicitly asked.
- Match indentation and formatting of the file you edit (the codebase mixes tabs in some files).
- Run `bun run check` and `bun run lint` after substantive changes.

### TypeScript

- Types for CTB live in `src/lib/api/ctb/types.ts`; KMB in `src/lib/api/kmb/types.ts`.
- Shared response wrapper: `src/lib/api/common/types.ts`.
- Avoid widening `CompanyId` or API types without checking all route pages and favorites usage.

### UI work

For new or polished UI, consult `.agents/skills/interface-kit/SKILL.md` and its `references/` directory (accessibility, component patterns, animation). The app uses a warm orange (`vesuvius`) palette — stay consistent with `app.css` tokens.

### General agent behavior

The repo includes agent skills and rules under `.agents/`:

| Path | Purpose |
|------|---------|
| `.agents/rules/ponytail.mdc` | Prefer simplest working solution; YAGNI; smallest correct diff |
| `.agents/rules/ponytail-review-gate.mdc` | Run ponytail-review after feature implementation |
| `.agents/skills/interface-kit/` | UI implementation quality |
| `.agents/skills/ponytail/` | Lazy senior dev workflow |
| `.agents/skills/ponytail-review/` | Over-engineering review format (what to delete) |
| `.agents/skills/review-ponytail/` | Manual `/review-ponytail` invoke |
| `.cursor/hooks.json` | Auto-trigger ponytail-review after agent edits code |

Follow ponytail principles: understand the flow before editing, fix shared functions once, question unnecessary complexity.

## Common tasks

### Add a new API endpoint

1. Add the fetch function and `get*QueryKey` in `src/lib/api/ctb/` or `src/lib/api/kmb/`.
2. Add/update types in that module's `types.ts`.
3. Use `createQuery` in the consuming page with the exported query key.
4. If the endpoint is cacheable and not real-time, consider adding a Workbox route in `src/service-worker.ts`.

### Add a new page or route

1. Create under `src/routes/` following existing dynamic segment naming (`[companyId]`, `[route]`, `[stopId]`).
2. Use `+page.svelte` only (no `+page.ts` loaders for API data — queries run client-side).
3. Add `<svelte:head><title>...</title></svelte:head>` for page titles.
4. Handle loading and empty states with `LoadingSkeleton` / `LoadingSpinner`.

### Add a reusable component

1. Place in `src/lib/components/`.
2. Use `$props()` with typed props and `{@render children()}` for slots.
3. Use Tailwind + `vesuvius-*` colors to match existing components.

## Gotchas

- **SSR vs client**: queries are `enabled: browser` — do not expect data during SSR.
- **KMB direction**: KMB uses `bound: 'I' | 'O'` internally; CTB uses `inbound | outbound`. Home page filters KMB to inbound only.
- **KMB service type**: route/stop/ETA calls hardcode `serviceType: '1'`.
- **NWFB**: listed in README; uses the same Citybus API with a different `companyId` param where applicable.
- **`$inspect`**: present in some route pages (dev debugging) — do not remove unless cleaning up intentionally.
- **No `.env` secrets**: all APIs are public Hong Kong government endpoints.

## Files to read first

When onboarding to a task, start with:

1. `README.md` — feature overview and structure
2. The route page closest to your change (`src/routes/...`)
3. The relevant API module (`src/lib/api/ctb/` or `src/lib/api/kmb/`)
4. `src/routes/+layout.ts` — QueryClient defaults
5. `src/routes/app.css` — design tokens

## Out of scope unless asked

- Adding authentication or user accounts
- Backend/API proxy layers (client calls government APIs directly)
- Committing, pushing, or opening PRs (only when explicitly requested)
- Large refactors across CTB/KMB abstractions
- New markdown docs beyond what the task requires
