# ai-photo-studio-web-app

A client-side AI Photo Studio web app: upload a photo, apply live filter presets and manual adjustments (brightness, contrast, saturation, grayscale, sepia, invert), and export the edited PNG. All image processing runs in the browser via Canvas — there is no backend and no external API keys are required.

## Tech stack

- Vite + React 18 + TypeScript
- Vitest + Testing Library (jsdom) for tests
- ESLint (v8, `.eslintrc.cjs`) for linting

## Commands

Standard scripts are defined in `package.json`:

- `npm run dev` — start the Vite dev server (http://localhost:5173)
- `npm run lint` — run ESLint
- `npm test` — run the Vitest suite once
- `npm run build` — type-check (`tsc -b`) then build for production
- `npm run preview` — serve the production build

## Cursor Cloud specific instructions

- Single frontend service only; no backend/database. `npm run dev` is the only service to run and it serves on port 5173 (configured with `host: true` in `vite.config.ts`).
- Pure image-processing logic lives in `src/lib/adjustments.ts` and is DOM-free so it can be unit tested under jsdom; the React UI in `src/App.tsx` uses a CSS `filter` for live preview and re-applies the same math on a Canvas for the PNG export.
- Core functionality (upload + edit + download) needs a real raster image; a throwaway sample can be generated with Pillow, e.g. `pip install pillow` then create a PNG under `/tmp` for manual upload testing.
