# ai-photo-studio-web-app

A client-side **AI Photo Studio** web app. Upload a photo, tune it with live filter
presets and manual adjustments (brightness, contrast, saturation, grayscale, sepia,
invert), and export the edited image as a PNG. All processing runs in the browser via
the Canvas API — no backend and no API keys required.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Command           | Description                                  |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Start the Vite dev server                    |
| `npm run lint`    | Run ESLint                                    |
| `npm test`        | Run the Vitest suite                         |
| `npm run build`   | Type-check and build for production          |
| `npm run preview` | Preview the production build                 |

## Tech stack

Vite · React 18 · TypeScript · Vitest · ESLint
