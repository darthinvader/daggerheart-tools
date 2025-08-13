# Daggerheart Tools (React + TypeScript + Vite)

Web-based mobile-first toolkit for the Daggerheart TTRPG. Built with React 19, TypeScript, Vite, Tailwind, and TanStack Router. This README highlights routes, mobile editing patterns, deployment, and troubleshooting.

## Character Routes & Flow

- `/characters`  Characters hub (index/list)
- `/characters/new`  Generates a UUID and redirects to `/characters/$id`
- `/characters/$id`  Canonical per-character sheet route (all editing happens here)

Editing model on mobile:

- Each section (Identity, Class, Traits, Resources, Domains, Equipment, Inventory) opens a bottom Drawer for edits
- Drawers use 100dvh and include safe-area padding so Save/Cancel remain tappable
- Pressing the browser Back button while a drawer is open will close the drawer first (history interception)

Persistence (localStorage, per character id):

- `dh:characters:{id}:identity:v1`
- `dh:characters:{id}:resources:v1`
- `dh:characters:{id}:traits:v1`
- `dh:characters:{id}:class:v1`

Current limitations and notes:

- Domains: Loadout capacity UI shows a read-only "Recall used" summary; final budget rules are pending (no count-based cap enforced)
- Equipment Items: Items are edited via the Inventory drawer only; the Equipment drawer does not include an Items tab
- Accessibility: Dialogs auto-provide an sr-only description; Drawers provide description via an internal scaffold; some test runs may log non-blocking a11y warnings

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Deployment (Vercel)

This project is a client-side rendered SPA using Vite + TanStack Router. To make it work on Vercel:

1. Ensure a `vercel.json` exists at the repo root (already added) with a rewrite sending all routes to `/index.html` so client routing works.
2. In Vercel project settings set:
   - Build Command: `pnpm build`
   - Install Command: `pnpm install --frozen-lockfile`
   - Output Directory: `dist`
3. Environment: Use Node 18+ (Vercel default is fine). No serverless functions are required.
4. If you see a 404 on deep links (e.g. refreshing a nested route), confirm the rewrite rule is active (Deployment > View Build Output should show `vercel.json`).
5. If build fails:
   - Check that `pnpm` is the package manager (Vercel auto-detects via lockfile)
   - Inspect logs for TypeScript errors from `tsc -b` (the build script runs type checking first). If needed you can temporarily adjust build script to `vite build` to confirm it's a type issue.
6. After deploy, test both the root path and a nested character route directly via address bar.

Common issues & fixes:

- Blank page + console error about failing to load chunk: Clear browser cache after a deployment that changes chunk names (Vite hashing) or disable aggressive CDN caching.
- 404 on refresh of nested route: Missing SPA rewrite — ensure `vercel.json` is present in the deployed commit.
- Build times out: Remove optional analysis plugins (don't set `ANALYZE=true`).

Local production preview:

```bash
pnpm build
pnpm preview --host
```

Then open the LAN URL to verify before pushing.
