# 04 — Design System

## Visual Identity

- **Brand**: SEAL Hackathon (platform name)
- **Style**: Clean, functional, professional — dark teal + white + subtle grays
- **Font**: Circular, Helvetica Neue, Helvetica, Arial, sans-serif (16px base)

## Color Palette

### Brand Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#064f5d` | Buttons, sidebar, links, active states, focus borders |
| Primary Hover | `#05404a` | Button hover state |
| Primary Gradient | `#064f5d` → `#0a6e7d` | Table headers |
| Text Primary | `#1f2f3a` | Headings, body text |
| Text Secondary | `#233136` | Base text color |
| Text Muted | `gray-400` / `#9ca3af` | Placeholders, labels |
| Link | `#064f5d` | All links (with hover:underline) |

### Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Page Background | `#ffffff` | Main background |
| Card Background | `#ffffff` | Cards, tables |
| Border | `#e8ecf0` | Card borders, table borders |
| Divider | `#f0f0f0` / `#f5f5f5` | Section dividers, row separators |
| Input Border | `#d8e0e6` | Form inputs |
| Muted Background | `#fafbfc` | Table row hover, editor toolbar |
| Sidebar | `#064f5d` | Navigation sidebar |

### Status/Semantic Colors

| Status | Background | Text |
|--------|-----------|------|
| Draft | `#f5f5f5` | `#757575` |
| Published / Active / Sent | `#e8f5e9` | `#2e7d32` |
| Closed / Rejected / Error | `#e0f2f1` / `#fce4ec` | `#00695c` / `#c62828` |
| Pending / Warning | `#fff3e0` | `#e65100` |
| Info | `#e3f2fd` | `#1565c0` |
| Warning Banner | `#e8f4fd` / `#fff5f5` | `#1565c0` / `#c62828` |

### Role Badge Colors

| Role | Background | Text |
|------|-----------|------|
| Admin | `#fce4ec` | `#c62828` |
| Staff | `#fff3e0` | `#e65100` |
| Student | `#e3f2fd` | `#1565c0` |
| Lecturer | `#f3e5f5` | `#7b1fa2` |

## Typography

- Headings: `#1f2f3a`, font-bold
  - Page title: `text-[28px]` (mobile: `text-[22px]`)
  - Section title: `text-[15px]` font-bold
- Body: `text-[14px]` or `text-[15px]`, `text-[#1f2f3a]` or `text-gray-500`
- Small labels: `text-[11px]` / `text-[12px]` / `text-[13px]`, uppercase tracking-wider, `text-gray-400`
- Table headers: `text-[12px]` font-bold uppercase tracking-wider text-white

## Spacing & Layout

- Page padding: `px-4 py-6 md:px-6 lg:px-8 lg:py-8`
- Card padding: `p-4` or `p-5`
- Gap between sections: `gap-4`, `gap-6`, `gap-8`
- Form grid: `grid grid-cols-1 gap-x-8 gap-y-5 lg:grid-cols-2`

## Border Radius

- Cards: `rounded-xl`
- Inputs: `rounded-lg`
- Badges: `rounded-full`
- Buttons: `rounded-lg`
- Tables: `rounded-xl`

## Shadows

- Cards: `shadow-sm`, hover: `shadow-md`
- Generally subtle, minimal shadows

## Component States

Every interactive element must handle:
- **Default** — standard appearance
- **Hover** — color shift (e.g., bg `#05404a` from `#064f5d`)
- **Focus** — `focus:border-[#064f5d]` outline on inputs
- **Disabled** — `disabled:opacity-50` or `disabled:opacity-40`, `disabled:cursor-not-allowed`
- **Loading** — skeleton animations (`animate-pulse`) or saving label change
- **Error** — red border (`#f87171`), red text, auto-focus first error field

## CSS Utility Classes

```css
/* Defined in src/index.css */
.field-input  → full-width input with border, padding, focus ring
.input-icon   → same but with left padding for icon
.input-icon.input-error → red border on error
```

## Icons

ALL icons are from **lucide-react**. No other icon library. Common ones:
- `Plus`, `Edit`, `Eye`, `Trash2`, `RotateCcw`, `Save`, `Search`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `Trophy`, `Users`, `UserPlus`, `Bell`, `Calendar`, `Clock`, `X`, `Menu`
