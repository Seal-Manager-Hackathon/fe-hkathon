# 01 — Tech Stack

## Core

| Tech | Version | Purpose |
|------|---------|---------|
| **React** | ^19.2.7 | UI library (latest with React Compiler) |
| **Vite** | ^8.1.1 | Build tool, HMR, dev server |
| **React Router** | ^7.18.1 | Client-side routing (createBrowserRouter) |
| **TailwindCSS** | ^4.3.2 | Utility-first CSS (v4 — no config file, `@theme` in CSS) |

## Key Libraries

| Library | Purpose |
|---------|---------|
| **axios** `^1.18.1` | HTTP client with interceptors |
| **Tiptap** `^3.27.2` | Rich text editor (StarterKit + Link extension) |
| **lucide-react** `^1.23.0` | Icon library — ALL icons come from here |
| **SweetAlert2** `^11.26.25` | Toast notifications + confirmation dialogs |

## Dev Tools

| Tool | Purpose |
|------|---------|
| **React Compiler** (babel-plugin-react-compiler) | Automatic memoization |
| **ESLint** `^10.6.0` | Linting (flat config) |
| **Autoprefixer** `^10.5.2` | CSS vendor prefixes |
| **GitNexus** | Code intelligence index for AI |

## Runtime

- Node.js ESM (`"type": "module"`)
- pnpm (lockfile is `pnpm-lock.yaml`)
- Environment: `VITE_API_BASE_URL` (defaults to `http://localhost:3000/api/v1`)

## Browserslist

```
Production: >0.2%, not dead, last 2 Chrome/Firefox/Safari/Edge, iOS>=14, Safari>=14, Firefox ESR
Development: last 1 Chrome/Firefox/Safari
```
