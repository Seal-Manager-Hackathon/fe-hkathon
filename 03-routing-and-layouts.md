# 03 — Routing & Layouts

## Route Architecture

All routes are defined in a single file: `src/routes/index.jsx`

Every page component is **lazy-loaded** using `React.lazy()` + `<Suspense>`. This gives automatic code splitting per route.

```jsx
const AdminDashboard = lazy(() => import('../pages/admin/dashboard/AdminDashboard'))
// ...
<Suspense fallback={<RouteFallback />}>
  <AdminDashboard />
</Suspense>
```

## Route Hierarchy

```
/                       → StudentLayout → HomePage
/login                  → LoginPage (standalone)
/register               → RegisterPage (standalone)
/verify-email           → VerifyEmailPage (standalone)
/profile                → StudentLayout → ProfilePage
/profile/edit           → StudentLayout → ProfileEditPage
/hackathons             → StudentLayout → HackathonsPage
/leaderboard            → StudentLayout → YearLeaderboardPage

/admin                  → AdminLayout → AdminDashboard
/admin/hackathons       → AdminLayout → HackathonManagement
/admin/hackathons/create → AdminLayout → HackathonCreate
/admin/hackathons/:id   → AdminLayout → HackathonDetail
/admin/hackathons/:id/edit → AdminLayout → HackathonEdit
/admin/hackathons/:id?tab=... → HackathonDetail (tabs via searchParams)
/admin/leaderboard      → AdminLayout → ChapterLeaderboardPage
/admin/users            → AdminLayout → UsersManagement
/admin/users/create     → AdminLayout → UsersCreate
/admin/users/:id        → AdminLayout → UserDetail
/admin/users/:id/edit   → AdminLayout → UserEdit
/admin/teams            → AdminLayout → TeamsManagement
/admin/teams/:id        → AdminLayout → TeamDetail
/admin/teams/:id/edit   → AdminLayout → TeamEdit
/admin/notifications    → AdminLayout → NotificationsManagement
/admin/notifications/create → AdminLayout → NotificationsCreate
/admin/notifications/:id → AdminLayout → NotificationDetail
/admin/notifications/:id/edit → AdminLayout → NotificationEdit
/admin/reports          → AdminLayout → ReportsManagement
/admin/reports/:id      → AdminLayout → ReportDetail
/admin/submissions/:id  → AdminLayout → SubmissionDetail
/admin/register-teams/:id → AdminLayout → RegisterTeamDetail
/admin/rounds/:id       → AdminLayout → RoundDetail
/admin/profile          → AdminLayout → AdminProfile
/admin/profile/edit     → AdminLayout → AdminProfileEdit
/admin/my-notifications → AdminLayout → MyNotifications

/staff/*                → StaffLayout → (mirror of /admin/*)
/*                      → NotFoundPage (catch-all)
```

## AdminLayout

```jsx
<div className="flex min-h-screen bg-white">
  <Sidebar navItems={mockAdminNavItems} open={sidebarOpen} />
  <div className="flex-1 lg:ml-[248px]">
    <Header user={user} menuItems={menuItems} onLogout={logout} />
    <main className="min-w-0 flex-1">
      <Outlet />
    </main>
  </div>
</div>
```

**Sidebar**: 248px wide, teal background (`bg-[#064f5d]`), fixed left, mobile: overlay with backdrop. Nav items: Dashboard, Hackathons, Leaderboard, Teams, Users, Notifications, Reports.

**Sidebar Icon Map** (in `SidebarNavItem.jsx`): Icons are resolved from a string-to-component map. When adding a new sidebar item with a new icon, you must also add the icon to the `iconMap` object.

**Header**: 56px height, sticky top, white background. Right side: NotificationBell + UserMenu. Left side: hamburger toggle on mobile.

## Detail Page Tabs Pattern

Hackathon detail uses URL search params for tab state:

```jsx
const [searchParams, setSearchParams] = useSearchParams()
const tab = searchParams.get('tab') || 'Overview'
// switchTab(key) → setSearchParams({ tab: key }, { replace: true })
```

Tabs: Overview, Rounds, Tracks, Awards, Assignments, Register Teams, Submissions, Leaderboard.
