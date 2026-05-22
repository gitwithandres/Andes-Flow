# ANDES Connect 3D — Agent Guide

## Stack & run

- **Framework**: TanStack Start v1 (React 19 + Vite 7) + TypeScript. Uses `@lovable.dev/vite-tanstack-config` preset.
- **PM**: `bun`. Commands: `bun dev`, `bun run build`, `bun run lint`, `bun run format`.
- **No test framework** exists — no test scripts, no test runner in `package.json`.
- **No typecheck script** — `tsc` not wired; TS errors only surface at build or in-editor.

## Vite config quirk

`vite.config.ts` uses the `@lovable.dev/vite-tanstack-config` preset. The file has a critical comment warning: **do not add tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare, or componentTagger manually** — the preset includes them. Pass extra config via `defineConfig({ vite: { ... } })`.

## Routes (file-based, TanStack Router)

| Path             | File                           | Purpose                                   |
| ---------------- | ------------------------------ | ----------------------------------------- |
| `/`              | `src/routes/index.tsx`         | Landing page with hero, featured cards    |
| `/catalogo`      | `src/routes/catalogo.tsx`      | 3D catalog with category filter           |
| `/solicitar/$id` | `src/routes/solicitar.$id.tsx` | Request form + Factus invoice integration |
| `/admin`         | `src/routes/admin.tsx`         | Dashboard — 6 tabs, Supabase CRUD         |
| `/seguimiento`   | `src/routes/seguimiento.tsx`   | Order tracking + ratings                  |

Route tree is auto-generated at `src/routeTree.gen.ts` — **do not edit manually**. Prettier ignores it.

## SSR entrypoint

`src/server.ts` — custom fetch handler with error capture for h3-swallowed SSR errors. `src/start.ts` wraps the TanStack Start instance with error middleware. **If you change the server entry, update the `tanstackStart.server.entry` in vite.config.ts**.

## Data layer

- **Public catalog**: `src/data/materials.ts` — static data, references Khronos GLB sample assets and local `/models/*.glb` files.
- **Admin dashboard**: loads live data from **Supabase** (`src/lib/supabase.ts`). Credentials in `.env`.
- **Local models** live in `modelos3d/` at root, served from `public/models/`. When adding new 3D models, place `.glb` files in `modelos3d/` and copy to `public/models/`.
- **`requests-store.ts`**: legacy localStorage-based store (not used by admin; used for the old client-side request list).

## Factus API (electronic invoicing)

Sandbox credentials are in `.env`. The integration runs in `solicitar.$id.tsx` → `src/services/factus.ts`. The sandbox uses Factus API **v1** endpoints despite docs referencing v2.

## Styling

- Tailwind CSS v4 via `@import "tailwindcss" source(none); @source "../src"` in `src/styles.css`.
- **All colors must use oklch format** (both `:root` and `.dark`).
- shadcn/ui with `new-york` style, `rsc: false`.

## Lint & format

```sh
bun run lint    # eslint — also bans `server-only` import (use `*.server.ts` files instead)
bun run format  # prettier — printWidth 100, trailingComma all, semi: true, singleQuote: false
```

## Deployment

- **Vercel**: `vercel.json` rewrites all to `/api/index` → `api/index.js` imports `dist/server/server.js`. Build auto-sets `SERVER_PRESET=vercel` and `NITRO_PRESET=vercel` when `process.env.VERCEL` is truthy.
- **Cloudflare**: `wrangler.jsonc` with `main: "src/server.ts"`. The Cloudflare Vite plugin is **disabled** when Vercel env is detected (`vite.config.ts:20`).
- **Build** (`bun run build`): `vite build && node -e ...` copies `dist/client/` → `dist/` for Vercel compatibility.

## Env vars required

All in `.env` (sandbox values committed):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `VITE_FACTUS_API_URL`, `VITE_FACTUS_USERNAME`, `VITE_FACTUS_PASSWORD`, `VITE_FACTUS_CLIENT_ID`, `VITE_FACTUS_CLIENT_SECRET`

## Model viewer

Google `<model-viewer>` v3.5 loaded via CDN script in `__root.tsx`. React type shim in `src/components/model-viewer.tsx`. Enable camera controls + auto-rotate by default.
