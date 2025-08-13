# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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
