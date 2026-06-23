# Spargo — Engineering

Real-time GPU image dithering. Single-screen client-side WebGL tool.

## Setup

1. Install dependencies (requires [Bun](https://bun.sh) ≥ 1.3):

   ```bash
   bun install
   ```

2. (Optional) Link Vercel + pull env vars — Spargo needs none to run locally, but linking enables `vercel` CLI deploys:

   ```bash
   bunx vercel link
   bunx vercel env pull
   ```

3. Run the dev server:

   ```bash
   bun dev          # http://localhost:3000 (Turbopack)
   ```

## Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Dev server (Turbopack) |
| `bun run build` | Production build |
| `bun start` | Serve the production build |
| `bun run check` | `biome check` + `tsc --noEmit` |
| `bun run lint` / `lint:fix` | Biome lint |
| `bun run format` | Biome format |

## Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev)
- **Language:** TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + CSS Modules
- **UI:** [Base UI](https://base-ui.com) + [react-colorful](https://github.com/omgovich/react-colorful)
- **WebGL:** [three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), [postprocessing](https://github.com/pmndrs/postprocessing)
- **State:** [Zustand](https://github.com/pmndrs/zustand) + [Zod](https://zod.dev) (config validation)
- **Tooling:** [Bun](https://bun.sh) (pm + runtime), [Biome](https://biomejs.dev) (lint/format), [Lefthook](https://github.com/evilmartians/lefthook) (pre-commit)
- **Hosting:** [Vercel](https://vercel.com/) — `spargo.darkroom.engineering`

## Architecture

- `app/` — App Router entry (`layout.tsx` holds metadata, `page.tsx` renders the canvas + controls).
- `components/controls/` — Base UI control panel (the product UI).
- `lib/store.ts` — Zustand store: dithering config + loaded file + canvas-registered export/record actions. Zod schema validates imported configs.
- `lib/webgl/` — R3F canvas, the `DitheringEffect` postprocessing pass, media components (image/video/model), and the ordered-dither matrices.
- `lib/hooks/`, `lib/styles/` — shared hooks and global CSS / Tailwind theme.

The DOM control panel and the in-canvas effect share the Zustand store: controls write config, `useDitheringEffect` reads it and pushes uniforms / rebuilds the matrix texture on the GPU.
