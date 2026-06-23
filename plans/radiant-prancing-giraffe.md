# Spargo — Modernize to Darkroom standards, new UI, custom domain

## Context

**Spargo** is a real-time GPU image-dithering tool (drop media → grayscale + ordered-dither on the GPU via WebGL postprocessing; controls for gamma, granularity, color, opacity, and ~19 dither matrices; export PNG / record webm). The dithering pipeline is the product's real value and works.

The shell around it is dated and half-WIP, built on Darkroom's **old satus starter**: Next.js 13 Pages Router, plain JS, SCSS + a sass-vars/vw system, **tweakpane** as the only "UI" (a dev panel, not a product UI — the image upload is an invisible full-screen dropzone), ESLint/Prettier, pnpm 8, and a large amount of dead satus cruft (Theatre.js, GSAP+ScrollTrigger, Lenis, embla, lottie, PWA, GTM/GA, header/footer/nav/hero, orchestra grid, `assets.studiofreight.com`). It deploys to `gpu-dithering.vercel.app` with CI hardcoded to the old `studio-freight` Vercel team, and there is no custom domain.

**Goal:** bring Spargo to Darkroom's *current* standards (defined by [satus](https://github.com/darkroomengineering/satus)), give it a real product UI built on **Base UI** (satus's UI lib), and wire it to **spargo.darkroom.engineering**.

## Target stack (mirror satus)

| | Current | Target (satus) |
|---|---|---|
| Framework | Next 13 Pages Router | **Next 16 App Router** (`app/`) |
| React | 18.2 | **19.2** |
| Language | JS | **TypeScript 6** (strict) |
| Styling | SCSS + sass-vars | **Tailwind v4** + CSS Modules |
| UI lib | tweakpane | **Base UI 1.5** |
| Tooling | ESLint/Prettier, pnpm 8 | **Biome 2.5 + Bun 1.3 + Turbopack** |
| State / validation | zustand 4 | **zustand 5 + zod 4** |
| WebGL | three 0.155, R3F 8, drei 9 | **three 0.184, R3F 9.6, drei 10.7** |
| Layout | `pages/`, `components/`, `libs/`, `styles/` | `app/`, `components/` (UI), `lib/` (hooks, webgl, styles, dev) |

**Decision — Base UI over shadcn.** satus standardizes on Base UI 1.5, so Spargo follows. Base UI has no color picker → use **react-colorful** (~2.8kb) inside a Base UI `Popover`. Keep file drag/drop via a small dropzone (native `input[type=file]` + drag handlers, or keep `react-dropzone`).

**Inputs:** keep **image + video + 3D (.glb/.gltf)** per request — carry forward `Image`/`Video`/`Model` webgl components, drei GLTF + draco.

## Approach

In-place modern rebuild (same repo, preserve git history): stand up the modern config + `app/` shell + Tailwind, **port the WebGL/dithering core to TS under `lib/webgl/`**, build the Base UI control panel wired to a zustand store, then delete all legacy/dead code. Use `context7` for Next 16 / R3F 9 / Base UI / Tailwind v4 APIs and `vercel:shadcn`-style skills as needed during execution.

### Phase 1 — Tooling & config baseline
- `package.json`: `packageManager: bun@1.3.x`; replace deps per target table; remove dead deps (theatre, gsap, lenis, embla, lottie, next-pwa/workbox, next-seo, next-sitemap, partytown, idb-keyval, stats.js, sass, svgr-as-loader if replaced, duplicate-package-checker, cross-env, jsonminify, glslify-loader unless GLSL imports needed). Add `tailwindcss`, `@tailwindcss/postcss`, `@base-ui-components/react`, `react-colorful`, `zod`, `postprocessing` (latest 6.x), `clsx`.
- Add satus-style configs: `biome.json`, `tsconfig.json` (strict, `@/*` paths), `next.config.ts`, `postcss.config.mjs`, `bunfig.toml`. Remove `.eslintrc.json`, `.prettierrc`, `.prettierignore`, `jsconfig.json`, `next-sitemap.config.js`.
- Tooling: replace husky/lint-staged with Biome (or a minimal pre-commit running `biome check`). Delete `pnpm-lock.yaml`; generate `bun.lock`. Update `.gitignore`, `.npmrc`, `turbo.json` (build/lint via bun+biome), `.vscode/settings.json` (Biome formatter).
- `bun install` and confirm the toolchain resolves.

### Phase 2 — App Router shell + Tailwind
- Create `app/layout.tsx` (root, metadata API for SEO replacing `next-seo`/`custom-head`, fonts) and `app/page.tsx` (the tool screen).
- `lib/styles/globals.css`: `@import "tailwindcss"`; port only the needed resets and Darkroom design tokens (colors/typography) as Tailwind v4 `@theme`. Drop the SCSS partials, `_tweakpane.scss`, sass-utils, `config/variables.js`, vw/desktop-vw functions.
- Port `CustomHead` → Next metadata; drop Lenis smooth-scroll, GTM/GA scripts, `RealViewport`/`DeviceDetectionProvider`/`Orchestra` from the app tree (keep a minimal debug toggle only if cheap). Update `public/` favicons/manifest, `robots.txt`; regenerate or remove sitemap.

### Phase 3 — Port WebGL/dithering core to `lib/webgl/` (TS)
- Move + convert to TS: `canvas/`, `content/`, `image/`, `video/`, `model/`, `postprocessing/` (incl. `effects/dithering/{effect,index}`, `pixelation`), `raf`, `hooks/{use-canvas,use-image-texture,use-video-texture}`, `utils/{blend,glsl,noise,ordered-ditherers}`. Type the `DitheringEffect` uniforms.
- **R3F 8→9 / three 0.155→0.184 upgrade** (the riskiest step): verify `Canvas` props (`frameloop="never"`, `linear`/`flat` color-management changes in three 0.184), `useThree`/`useFrame`, drei `OrthographicCamera`/`useTexture`/`GradientTexture`/GLTF, and `postprocessing` `EffectComposer`/`EffectPass`/`RenderPass` + custom `Effect` subclass against current versions. Keep `tunnel-rat`. Test the dither output renders identically.
- Replace `@react-three/drei` GradientTexture debug mesh and the stray `components/hero/webgl.js` satus demo (spinning box) — delete it; it's dead.

### Phase 4 — Base UI control panel + state (replace tweakpane)
- New `lib/store.ts` (zustand 5): `{ gammaCorrection, granularity, color {r,g,b}, opacity, mode, file }` + setters; a zod schema for import/export validation. The `DitheringEffect` subscribes to the store (replacing the tweakpane `.on('change')` bindings in `effects/dithering/index.js` and the export-folder logic in `content/index.js`).
- `components/controls/` (Base UI, Tailwind-themed, floating glassy panel over full-bleed canvas):
  - **Sliders** — gamma (0–2/0.01), granularity (1–10/1), opacity (0–1/0.01) via Base UI `Slider`.
  - **Select** — dither mode (19 ditherers + `RANDOM`) via Base UI `Select`.
  - **Color** — `react-colorful` in Base UI `Popover`.
  - **Upload** — visible dropzone with affordance + filename/thumbnail; accepts image/video/glb.
  - **Export** — buttons: export PNG, start/stop recording (port logic from `content/index.js`), import/export config JSON (port from `libs/gui.js`, now via store + zod).
- Delete `libs/gui.js`, `config/gui_config.json`, tweakpane dep.

### Phase 5 — Cleanup & dead-code removal
- Delete: `pages/`, `styles/`, `layouts/`, `components/{header,footer,navigation,hero,theatre,custom-head,real-viewport,device-detection}`, `libs/{theatre,orchestra,gui,store(old),analytics,zustand-broadcast,sass-utils,slugify,maths?}`, `config/`, `checklist.md`, `todo.md`, dead `public/` (draco kept only if 3D retained, sw.js/workbox*, partytown). Run a `deslopper`/`biome check` pass.
- Rewrite `PROD-README.md` + `README.md` for the new stack/commands; align `.env.example` (drop GTM/GA/UA, WEBSITE_URL→site URL).

### Phase 6 — Domain + deploy (Vercel MCP)
- Link/create Vercel project **spargo** under Darkroom team `team_7wz1cK9b7WKqO2U1qLRaZfoa` (`vercel link`/MCP); set framework Next 16, install `bun install`, build `bun run build`.
- Add domain **spargo.darkroom.engineering**; create the DNS record Vercel specifies (CNAME `spargo` → `cname.vercel-dns.com` if `darkroom.engineering` NS is on Vercel; otherwise output the record for the external DNS host). Verify SSL issues.
- Fix CI: `.github/workflows/*` — replace `vercel_team_id: 'studio-freight'` with `darkroom-engineering`, update/replace lighthouse + size-limit for the bun/biome toolchain (or retire). Keep `vercel.json` (`github.silent`).
- Add `/home → /` redirect equivalent in `next.config.ts` (currently in `next.config.js`).

## Critical files

- **Port (JS→TS):** `libs/webgl/**` → `lib/webgl/**`, esp. `components/postprocessing/effects/dithering/effect.js` + `index.js`, `components/content/index.js`, `components/canvas/{index,webgl}.js`, `utils/ordered-ditherers.js`, `hooks/use-canvas.js`.
- **Replace:** `libs/gui.js` + `config/gui_config.json` → `lib/store.ts` + `components/controls/*`.
- **New shell:** `app/layout.tsx`, `app/page.tsx`, `lib/styles/globals.css`, `next.config.ts`, `biome.json`, `tsconfig.json`, `postcss.config.mjs`, `bunfig.toml`.
- **Delete:** `pages/`, `styles/`, `layouts/`, dead `components/*`, dead `libs/*`, `config/`, lock + lint configs.

## Verification

1. `bun install` clean; `bun run build` (Turbopack) succeeds; `biome check` clean; `tsc --noEmit` passes (strict).
2. `bun dev` → drop an **image**: renders dithered identically to current output; sliders (gamma/granularity/opacity), mode select, and color picker update the GPU effect live.
3. Drop a **video** and a **.glb**: both render and dither.
4. Export PNG downloads a correct dithered image; start/stop recording downloads a webm; config export→import round-trips via the zod schema.
5. Lighthouse: a11y ≥ 90 on the control panel (Base UI gives keyboard/ARIA); no console errors; verify in Chrome via devtools MCP.
6. Vercel preview deploy green; **spargo.darkroom.engineering** resolves over HTTPS and serves the tool.

## Risks / notes

- **R3F 8→9 + three 0.184** is the highest-risk step (color management `linear`/`flat`, postprocessing peer compat). Pin `postprocessing` to a 6.x that supports three ≥0.184; validate dither output pixel-for-pixel before deleting the old pipeline.
- Base UI has no color picker — `react-colorful` chosen deliberately; confirm it themes cleanly in the Popover.
- DNS step depends on where `darkroom.engineering` nameservers live; if external, the DNS record is handed off rather than created via MCP.
