# Learn App frontend UI source

This bundle contains the original frontend source (`src/`), public assets (if present), and frontend build/dependency configuration from the uploaded Learn-app project. Backend code and `node_modules` are excluded.

## Run
1. Install Node.js (LTS).
2. In this folder run `npm install`.
3. Run `npm run dev`.

## Reuse in another project
- Copy `src/components/`, `src/pages/`, `src/index.css`, `src/theme.js`, `src/data.js`, and any referenced `src/assets/` files.
- `src/App.jsx` and `src/main.jsx` contain the app shell and entry point. Adapt imports/routes and API calls in `src/api/client.js` for the destination project.
- Install dependencies listed in `package.json`.
- The source includes application logic and backend API integration; if you only need visual UI, replace API calls/data with your own mock data or endpoints.
