# 08 — Component Catalog

## Core Layout Components

### BaseTable
**File**: `src/components/BaseTable/index.jsx`
**Purpose**: Universal data table with server-side or client-side pagination.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | Array | `[]` | Column definitions: `{ key, header, headerIcon?, render?, className?, headerClassName? }` |
| data | Array | `[]` | Row data |
| page | number | `1` | Current page |
| pageSize | number | `10` | Rows per page |
| total | number | `0` | Total records (for pagination calc) |
| onPageChange | fn | — | `(page) => void` |
| loading | boolean | `false` | Shows skeleton rows |
| serverSide | boolean | `false` | If true, uses data directly (no client-side slice) |
| keyExtractor | fn | — | `(row, index) => uniqueKey` |
| emptyText | string | `'No data found.'` | Empty state message |
| minWidth | string | `'600px'` | Minimum table width for horizontal scroll |
| borderless | boolean | `false` | Remove border styling |
| onRowClick | fn | — | `(row) => void` |
| rowClassName | fn | — | `(row) => string` |

**Features**: Gradient header (`#064f5d`→`#0a6e7d`), skeleton loading, empty state with Inbox icon, pagination controls.

### FilterBar
**File**: `src/components/FilterBar/index.jsx`
**Purpose**: Render filter controls from a descriptor array.

| Prop | Type | Description |
|------|------|-------------|
| filters | Array | `[{ type, key, label, icon?, placeholder?, options?, className? }]` |
| values | Object | `{ key: value }` — current filter values |
| onChange | fn | `(key, value) => void` |
| onReset | fn | Reset all filters |
| hasActive | boolean | Enables reset button |

**Filter types**: `'search'` (SearchInput), `'select'` (SelectInput), `'date'` (DateInput), `'custom'` (render prop).

### EntityFormPage
**File**: `src/components/EntityFormPage/index.jsx`
**Purpose**: Wrapper for create/edit form pages.

| Prop | Description |
|------|-------------|
| backUrl | Link back destination (always a fixed URL, never browser history) |
| backLabel | Back link text |
| title | Page heading |
| description | Subtitle text |
| saveLabel | Primary button text |
| savingLabel | Text shown while saving |
| canSave | Boolean — enables/disables save button |
| onSave | Save handler |
| saving | Boolean — shows loading state |
| saveIcon | Lucide icon for save button |
| children | Form body content |

### FormField
**File**: `src/components/FormField/index.jsx`
**Purpose**: Label + error wrapper for individual form fields. Auto-focuses first error field.

```jsx
<FormField label="Name" required error={errors.name}>
  <input className="field-input" ... />
</FormField>
```

### FormActions
**File**: `src/components/FormActions/index.jsx`
**Purpose**: Save + Cancel button footer. Cancel uses `navigate(-1)`.

### PageHeader
**File**: `src/components/PageHeader/index.jsx`
**Purpose**: Back button + title + description + optional action button.

### DataManagementPage
**File**: `src/components/DataManagementPage/index.jsx`
**Purpose**: Generic client-side CRUD list page with local filtering. Use for static/mock data. For server-side, build a custom management page with `useServerPagination`.


## Input Components

### TextInput — Input with optional left icon + error state
```jsx
<TextInput label="Email" value={v} onChange={fn} placeholder="..." icon={Mail} error={err} />
```

### SearchInput — Search field with icon
```jsx
<SearchInput label="Search" placeholder="..." value={v} onChange={fn} />
```

### SelectInput — Dropdown with chevron icon
```jsx
<SelectInput label="Status" options={opts} value={v} onChange={fn} icon={Icon} />
```

### DateInput — Date picker
```jsx
<DateInput label="From" value={v} onChange={fn} />
```

### PasswordInput — Password with show/hide toggle
```jsx
<PasswordInput label="Password" value={v} onChange={fn} />
```

### RichTextEditor — Tiptap WYSIWYG
```jsx
<RichTextEditor value={html} onChange={(html) => setHtml(html)} placeholder="..." />
```

## Display Components

| Component | Usage |
|-----------|-------|
| Badge | `<Badge label="Published" className="bg-[#e8f5e9] text-[#2e7d32]" />` |
| StatCard | `<StatCard icon={Trophy} label="Total" value={48} color="bg-[#e3f2fd] text-[#1565c0]" />` |
| CardPanel | `<CardPanel title="Title" viewAllTo="/link">{children}</CardPanel>` |
| DetailField | `<DetailField label="Email">value</DetailField>` |
| RichTextViewer | `<RichTextViewer content={htmlString} />` — read-only Tiptap output |
| Avatar | `<Avatar user={user} />` — image or initials fallback |
| SectionTitle | `<SectionTitle viewAllTo="/link">Section</SectionTitle>` |

## Modal Components

| Component | Purpose |
|-----------|---------|
| ConfirmDialog | Yes/No confirmation dialog |
| PromptReason | Modal with textarea (e.g., ban reason) |
| NotificationModal | View notification detail |
| RoundSelectModal | Select a round |
| TrackSelectModal | Select a track |
| TopicSelectModal | Select a topic |
| RegisterTeamSelectModal | Select registered team |
| NextRoundModal | Confirm assign to next round |
| SwapModal | Swap two entities positions |
| RoundLeaderboardModal | Round leaderboard (per-round ranking) — uses BaseTable, 5 items/page |
| TableSelectModal | Searchable table in modal |
| DashboardModal | Generic modal shell |

## Leaderboard Components

### RoundLeaderboardModal
**File**: `src/components/RoundLeaderboardModal/index.jsx`
**Props**: `{ open, onClose, roundId, roundName }`
**Purpose**: Shows team rankings for a single round, sorted by scopeScore. Uses `BaseTable` with columns: Rank (trophy/medal), Team, Track/Topic, Score. 5 items per page.

### EventLeaderboardTab
**File**: `src/pages/admin/hackathons/leaderboard/EventLeaderboardTab.jsx`
**Props**: `{ eventId }`
**Purpose**: Event-level leaderboard tab in HackathonDetail. Shows team rankings by eventScore with View modal for per-round scores. Uses `BaseTable` with 5 items/page.

### ChapterLeaderboardPage
**File**: `src/pages/admin/leaderboard/ChapterLeaderboardPage.jsx`
**URL**: `/admin/leaderboard`
**Purpose**: Year-based chapter leaderboard. Year selector with < > stepper buttons. Shows team rankings by chapterScore with View modal for per-event scores. Teams link to `/admin/teams/{id}`. Uses `BaseTable` with 10 items/page.

## Layout Components

**Sidebar**: 248px fixed, teal bg, nav items with icon+label, mobile overlay. Icons resolved via `iconMap` in `SidebarNavItem.jsx` — must add new icon to both import and map.
**Header**: 56px sticky, white bg, notification bell + user menu, hamburger on mobile.
