# SEAL Hackathon — Project Context for AI

> Complete project documentation for AI agents and developers to understand the codebase deeply.

## How to Read

| Role | Path |
|------|------|
| **New AI/Dev — first read** | Read files in order: `00` → `01` → ... → `09` |
| **Need to build an admin CRUD page** | Start with `05-code-patterns.md` + `06-admin-business-flows.md` |
| **Need to change UI/styling** | Start with `04-design-system.md` + `08-component-catalog.md` |
| **Need to add API endpoints** | Start with `07-api-layer.md` + `05-code-patterns.md` |
| **Need to add leaderboard features** | Start with `06-admin-business-flows.md` §11 + `08-component-catalog.md` |

## Document Index

| # | File | Description |
|---|------|-------------|
| 00 | [00-project-overview.md](./00-project-overview.md) | Domain, user roles, project scope, leaderboard system |
| 01 | [01-tech-stack.md](./01-tech-stack.md) | Full tech stack: Vite, React 19, TailwindCSS v4, React Router v7, Tiptap |
| 02 | [02-project-structure.md](./02-project-structure.md) | Directory tree with explanation of each folder and file |
| 03 | [03-routing-and-layouts.md](./03-routing-and-layouts.md) | Route organization, lazy loading, Admin/Staff/Student layouts, sidebar icon map |
| 04 | [04-design-system.md](./04-design-system.md) | Visual identity: colors, fonts, spacing, component states, CSS tokens |
| 05 | [05-code-patterns.md](./05-code-patterns.md) | Reusable patterns: list pages, form pages, detail pages, hooks, modals, leaderboard |
| 06 | [06-admin-business-flows.md](./06-admin-business-flows.md) | All admin business flows: hackathon, rounds, leaderboard, teams, users, reports, submissions |
| 07 | [07-api-layer.md](./07-api-layer.md) | Axios instance, interceptors, auth tokens, error handling, API function conventions, leaderboard APIs |
| 08 | [08-component-catalog.md](./08-component-catalog.md) | Full catalog of every shared component and leaderboard components with props |
| 09 | [09-rules-and-conventions.md](./09-rules-and-conventions.md) | Unified rules: naming, CSS classes, toast/confirm, form validation, sidebar icons |
