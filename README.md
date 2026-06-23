# spargo

Real-time GPU image dithering in the browser, via WebGL.

> _spargo_ — Latin, "to scatter": dithering scatters pixels to simulate tone and shade.

**[spargo.darkroom.engineering →](https://spargo.darkroom.engineering)**

## Features

- **GPU dithering** — real-time ordered dithering on the GPU via WebGL (19 matrices: Bayer, dot, diagonal, spiral… + random)
- **Drop anything** — images, video, and 3D models (`.glb`/`.gltf`), dithered live
- **Browser-only** — runs entirely client-side, no upload, no server
- **Tweak & export** — gamma, granularity, opacity, color and mode; export a PNG, record a WebM, or save/load a config

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · [Base UI](https://base-ui.com) · React Three Fiber + [`postprocessing`](https://github.com/pmndrs/postprocessing) · Zustand + Zod · Bun · Biome.

## Develop

```bash
bun install
bun dev          # http://localhost:3000
bun run build    # production build
bun run check    # biome + tsc
```

---

Built by [Darkroom Engineering](https://darkroom.engineering).
