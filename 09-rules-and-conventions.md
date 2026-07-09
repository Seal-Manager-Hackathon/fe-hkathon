# 09 — Rules & Conventions

## Naming Conventions

### Files
- **PascalCase** for components: `HackathonManagement.jsx`, `BaseTable/index.jsx`
- **camelCase** for utilities: `format.js`, `toast.js`, `useServerPagination.js`
- **camelCase** for data/constants: `adminOptions.js`, `mockAdminData.js`
- One component per folder with `index.jsx` entry point: `components/Badge/index.jsx`

### Variables & Functions
- **PascalCase** for component names: `HackathonCreate`
- **camelCase** for functions and variables: `handleSave`, `buildParams`, `canSave`
- **UPPER_SNAKE_CASE** for constants: `PAGE_SIZE`, `DEFAULT_VALUES`
- **camelCase + export const** for shared constant arrays: `ROLE_OPTIONS`, `HACKATHON_STATUS_OPTIONS_ALL`

### Imports
- Always use **relative imports** with `../` path traversal — no path aliases
- Order: React → third-party → components → hooks → utils → api → constants

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import BaseTable from '../../../components/BaseTable'
import { useServerPagination } from '../../../hooks/useServerPagination'
import { toast, confirm } from '../../../utils/toast'
import { getEvents } from '../../../api/admin'
```

## CSS Conventions

### ALWAYS use Tailwind utility classes. Never write raw CSS unless absolutely necessary.

### Input Elements: Always use `className="field-input"`
```jsx
<input type="text" className="field-input" />
<textarea className="field-input" rows={4} />
```

### Button Classes — copy exactly from these patterns:

**Primary button (teal)**:
```
inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#05404a] sm:px-5 sm:py-2.5 sm:text-[14px]
```

**Action button (light)**:
```
inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]
```

**Danger button (red)**:
```
inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#fce4ec] px-3 py-1.5 text-[13px] font-semibold text-[#c62828] transition-colors hover:bg-[#ffcdd2]
```

**Cancel/secondary button**:
```
inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50
```

**Back link**:
```
inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline
```

### Layout Conventions

**Page container**: `px-4 py-6 md:px-6 lg:px-8 lg:py-8`

**Page title**: `text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]`

**Subtitle**: `mt-1 text-[14px] sm:text-[15px] text-gray-500`

**Cards**: `rounded-xl border border-[#e8ecf0] bg-white`

**Error banner**: `rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]`

**Info banner**: `rounded-lg border border-[#e3f2fd] bg-[#e8f4fd] px-4 py-3 text-[13px] text-[#1565c0]`

**Table header gradient**: `bg-gradient-to-r from-[#064f5d] to-[#0a6e7d]`

## State Handling Rules

Every page must handle these states:
1. **Loading**: Show skeleton (animate-pulse) or spinner
2. **Error**: Show error banner with message + back link
3. **Empty**: Show empty state with icon + message (uses BaseTable built-in)
4. **Success**: Show data

## Form Validation Rules
- Required fields: check before enabling save (`canSave`)
- Show field-level errors via `FormField` error prop
- Auto-focus first error field (handled by FormField)
- Always use `toast.error()` for API errors

## Toast & Confirm Rules

```js
// Success after action
toast.success('Hackathon created')

// Error from API
toast.error(err?.response?.data?.message || 'Failed to save.')

// Confirmation before destructive actions
const ok = await confirm('Delete Hackathon', `Delete "${name}"?`)
if (!ok) return
await deleteEntity(id)
toast.success('Hackathon deleted')
```

## Code Style

- **No semicolons** in JSX return statements (JSX syntax)
- **Semicolons** in JS logic (following project convention)
- Arrow functions for handlers: `const handleSave = async () => { ... }`
- Early returns for guards: `if (!canSave) return`
- Destructure API responses: `const { data } = await api.get(...)`
- Use `useCallback` for functions passed as dependencies
- Use `useMemo` for derived data

## Admin ↔ Staff Sync Rule

**CRITICAL**: Every change to an admin page/component/API function MUST be replicated to the corresponding staff file. Admin is the canonical implementation. Staff is a mirror.

When syncing:
1. Copy the admin component to the matching staff path
2. Change API imports from `admin` to `staff`
3. Change route prefixes from `/admin/` to `/staff/`
4. Add corresponding staff API mock function in `src/api/staff.js`
5. Add staff route in `src/routes/index.jsx`
6. Add staff sidebar nav item in `src/data/mockStaffData.js`
7. Update `sidebarRoutes.js` for URL-to-active-key mapping

## Sidebar Icon Rule

**CRITICAL**: When adding a new sidebar item with a new icon:
1. Add the icon to `mockAdminNavItems` or `mockStaffNavItems` as a string (e.g., `icon: 'BarChart3'`)
2. Add the icon component to the import and `iconMap` in `src/components/Sidebar/SidebarNavItem.jsx`
3. Add URL-to-active-key mapping in `src/components/Sidebar/sidebarRoutes.js`

## Leaderboard Patterns

All leaderboard components follow the same pattern:
- Use `BaseTable` with `borderless` and `serverSide`
- Rank column shows Trophy/Medal icon for top 3, `#rank` text for others
- Score column highlights top 3 with gold/silver/bronze colors
- Team name columns are clickable links to detail pages
- View button opens a DetailModal with per-round/per-event score breakdown
- DetailModals use `<Link>` for navigation, `font-semibold text-[#064f5d] hover:underline` style

## Reusability Principles

1. **Use shared components** — never recreate a component that already exists in `src/components/`
2. **Use `useServerPagination`** — never write custom pagination logic in a management page
3. **Use `EntityFormPage`** — never create a custom form page shell
4. **Use `FilterBar`** — never build a custom filter UI
5. **Use `BaseTable`** — never build a custom table
6. **Use `toast`/`confirm`** — never use raw `alert()` or custom notification
7. **Use `field-input` CSS class** — never style inputs from scratch
8. **Use constants from `adminOptions.js`** — never hardcode option arrays in components

## General Principles

- Write clean, readable code that is easy to maintain
- Prioritize reusability — extract common patterns into shared components
- Make the UI beautiful and easy to interact with
- Follow accessibility best practices (keyboard navigation, focus indicators)
- Use confirmation dialogs for destructive actions
- Show clear feedback for every user action (toast, loading states)
- Handle all edge cases: loading, empty, error, not-found
