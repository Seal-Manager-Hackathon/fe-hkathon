# 02 — Project Structure

```
new-fe/
├── index.html                  # <title>SEAL Hackathon</title>
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite + React + Babel(React Compiler) + TailwindCSS v4
├── postcss.config.js           # Autoprefixer
├── design.md                   # Design system spec (Devpost brand)
├── skill.md                    # Claude skill
│
└── src/
    ├── main.jsx                # StrictMode + AuthProvider + App
    ├── App.jsx                 # createBrowserRouter(routes) → RouterProvider
    ├── index.css               # Tailwind + .field-input/.input-icon utility classes
    │
    ├── context/
    │   └── AuthContext.jsx     # user state, login(), logout(), localStorage tokens
    │
    ├── libs/
    │   └── api.js              # Axios: auth interceptor, 401 → /login redirect
    │
    ├── hooks/
    │   ├── useServerPagination.js  # Server pagination + filter (CORE REUSABLE HOOK)
    │   ├── useDashboardData.js     # Admin dashboard stats
    │   └── useStaffDashboardData.js
    │
    ├── utils/
    │   ├── cn.js               # Classname joiner
    │   ├── format.js           # formatDate(), formatDateTime()
    │   ├── toast.js            # SweetAlert2: toast.success/error/warning/info, confirm()
    │   └── error.js            # parseError(), getErrorMessage()
    │
    ├── constants/
    │   └── adminOptions.js     # Role options, statuses, seasons, badge colors
    │
    ├── data/
    │   └── mockAdminData.js    # Nav items, stat sections, icon maps, mock data
    │
    ├── api/
    │   ├── admin.js            # ALL admin API functions
    │   ├── auth.js             # Auth: login, register, getCurrentUser
    │   └── staff.js            # Staff API (mirrors admin)
    │
    ├── routes/
    │   └── index.jsx           # ALL routes defined here (lazy-loaded)
    │
    ├── layouts/
    │   ├── AdminLayout.jsx     # Sidebar + Header + <Outlet/>
    │   └── StudentLayout.jsx   # Header + Footer + <Outlet/>
    │
    └── pages/
        ├── auth/               # Login, Register, VerifyEmail, Profile, ProfileEdit
        ├── student/            # Home, hackathons, teams, scores, leaderboard
        ├── admin/              # ADMIN pages (see 06-admin-business-flows.md)
        │   ├── dashboard/      # Dashboard + stats + recent activity
        │   ├── hackathons/     # CRUD + detail with 7 tabs
        │   │   ├── rounds/     # Round CRUD + CriteriaTemplates CRUD
        │   │   ├── tracks/     # Track CRUD + Topic CRUD
        │   │   ├── awards/     # Award CRUD
        │   │   ├── assign/     # Judge assignments
        │   │   ├── register-teams/
        │   │   └── submissions/
        │   ├── users/          # List + create/edit/detail + ban/unban/delete
        │   ├── teams/          # List + edit/detail
        │   ├── notifications/  # List + create/edit/detail
        │   ├── reports/        # List + ReportDetail (resolve flow)
        │   ├── submissions/    # Submission detail with scores
        │   └── profile/        # Profile view + edit
        └── staff/              # MIRROR of admin structure — keep in sync
```


## Shared Components Directory

```
src/components/
├── Sidebar/            # Nav sidebar
├── Header/             # Top bar: notifications + user menu
├── BaseTable/          # Server/client paginated table + skeleton
├── FilterBar/          # Search + selects + dates + reset
├── DataManagementPage/ # Client-side CRUD list wrapper
├── EntityFormPage/     # Create/Edit form wrapper
├── FormField/          # Label + error wrapper
├── FormActions/        # Save + Cancel footer
├── PageHeader/         # Back + title + action
├── SectionTitle/       # Heading + "View All"
├── CardPanel/          # Bordered card + "View All"
├── StatCard/           # Icon + label + value
├── Badge/              # Rounded pill
├── TextInput/          # Input + icon + error
├── SearchInput/        # Search field
├── SelectInput/        # Dropdown
├── RichTextEditor/     # Tiptap WYSIWYG
├── RichTextViewer/     # Tiptap read-only
├── DetailField/        # Key-value display
├── Modal family:       # Round/Track/Topic/Swap/NextRound/Notification/Confirm modals
└── Card family:        # HackathonCard, RankingCard, EventInfoCard
```

**CRITICAL:** Admin and Staff directories are structurally identical mirrors. Every change to admin must be replicated to staff.
