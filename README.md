# SEAL Hackathon

A comprehensive hackathon management platform with role-based access control, built for managing the full lifecycle of hackathon events — from team registration and submission grading to leaderboards and chapter-level rankings.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [React 19](https://react.dev/) with [React Compiler](https://react.dev/learn/react-compiler) |
| **Build Tool** | [Vite 8](https://vite.dev/) |
| **Routing** | [React Router DOM v7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Rich Text** | [Tiptap](https://tiptap.dev/) (StarterKit + Link) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Dialogs** | [SweetAlert2](https://sweetalert2.github.io/) |
| **Linting** | ESLint + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` |

## Features

### Role-Based Portals

The platform serves four distinct user roles, each with its own dedicated layout and feature set:

| Role | Path | Capabilities |
|------|------|-------------|
| **Student** | `/` | Browse hackathons, form & manage teams, register for events, view leaderboards, receive invitations & notifications |
| **Lecturer** | `/lecture` | Judge submissions, grade teams against criteria templates, manage tracks/topics, view leaderboards, send track notifications |
| **Staff** | `/staff` | Manage hackathons, users, teams, notifications, reports, and submissions; view leaderboards |
| **Admin** | `/admin` | Full system control — create/manage hackathons, rounds, tracks, topics, awards, users, teams, notifications, reports, submissions, and assignments |

### Core Functionality

- **Authentication & Authorization** — Login, registration, email verification, password reset, and role-based route protection
- **Hackathon Lifecycle** — Create, edit, publish, and close events with configurable registration limits
- **Round-Based Competition** — Multi-round hackathons with automatic round numbering, swap, and end-round actions
- **Tracks & Topics** — Categorize hackathons into tracks with sub-topics for focused competition areas
- **Team Management** — Team creation, member invitations, registration, approval/rejection workflow
- **Grading System** — Criteria templates with configurable items, judge scoring per submission
- **Leaderboards** — Round-level, event-level, and yearly chapter leaderboards
- **Notifications** — Personal, team, and system-wide notifications with read/unread tracking
- **User Management** — CRUD operations, ban/unban, role assignment, email verification status
- **Report Management** — Users can submit reports; admins/staff can resolve or reject them
- **Award Management** — Create and manage awards with level-based ordering
- **Submissions** — File and text submissions per round with grader score tracking
- **Assignment System** — Assign lecturers (as judges/mentors) and staff to events and tracks
- **Responsive UI** — Full mobile-responsive design with Tailwind CSS

## Project Structure

```
src/
├── api/              # API service modules (admin, auth, lecturer, staff, student, user)
├── components/       # Reusable UI components (30+ components)
│   ├── Avatar/
│   ├── Badge/
│   ├── BaseTable/
│   ├── CardPanel/
│   ├── FilterBar/
│   ├── FormField/
│   ├── Header/
│   ├── LeaderboardList/
│   └── ...
├── constants/        # Navigation & option constants per role
├── context/          # AuthContext — authentication state management
├── data/             # Mock data for development
├── hooks/            # Custom React hooks
│   ├── useNotifications.js
│   ├── useServerPagination.js
│   ├── useDashboardData.js
│   └── ...
├── layouts/          # Role-based layout shells (Admin, Staff, Lecturer, Student, Root)
├── libs/             # API client (Axios instance with interceptors)
├── pages/            # Page components organized by role and feature
│   ├── admin/
│   ├── auth/
│   ├── lecture/
│   ├── staff/
│   └── student/
└── routes/           # Centralized route definitions with lazy loading
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd fe-hkathon

# Install dependencies
pnpm install
```

### Development

```bash
# Start the dev server (default: http://localhost:5173)
pnpm dev
```

The app connects to an API at `http://localhost:3000/api/v1` by default. Override this with the `VITE_API_BASE_URL` environment variable.

### Build

```bash
pnpm build       # Production build → dist/
pnpm preview     # Preview the production build locally
```

### Lint

```bash
pnpm lint
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend API base URL |

## Deployment

The project includes a [Vercel](https://vercel.com/) configuration (`vercel.json`) with SPA rewrite rules for client-side routing. Deploy directly via Vercel:

```bash
npx vercel
```

### Browser Support

Targets modern browsers (last 2 versions of Chrome, Firefox, Safari, Edge; iOS >= 14; Safari >= 14; Firefox ESR).

## Architecture Highlights

- **Lazy-Loaded Routes** — All page components are loaded via `React.lazy()` with `Suspense` fallbacks for optimal bundle splitting
- **Protected Routes** — `ProtectedRoute` wrapper enforces authentication and role-based access; unauthenticated users are redirected to `/login`
- **Centralized API Client** — A single Axios instance handles token attachment, `401` interception, and `ngrok-skip-browser-warning` headers
- **JWT Auth** — Access + refresh token flow with localStorage persistence
- **Soft Delete** — Most entities support soft-delete/restore patterns (users, teams, notifications, rounds, etc.)

## License

<!-- Add your license here -->
