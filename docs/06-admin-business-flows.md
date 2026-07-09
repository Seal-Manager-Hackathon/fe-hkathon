# 06 — Admin Business Flows

## 1. Hackathon Management

### List (HackathonManagement.jsx)
- URL: `/admin/hackathons`
- Server-side pagination via `getEvents(params)`
- Filters: keyword search, status (Draft/Published/Closed), deleted, from/to date
- Actions per row: View → detail, Edit → edit page, Delete (soft) / Restore
- Create button links to `/admin/hackathons/create`

### Create (HackathonCreate.jsx)
- Form: name, season, startTime, endTime, registerLimitTime, limitTeam, minMember, maxMember, description (rich text)
- Created as Draft + disabled by default
- Shows info banner: "Event will be created as Draft and disabled by default"

### Edit (HackathonEdit.jsx)
- Same form as create, pre-populated
- Updates via `updateEvent(id, payload)`
- Additional: visibility (Public/Private/Unlisted)

### Detail (HackathonDetail.jsx) — 7 Tabs
| Tab | Component | Features |
|-----|-----------|----------|
| Overview | OverviewTab | Event info cards (season, dates, limits), description (rich text), Edit button |
| Rounds | RoundsTab | List rounds, create/edit/delete rounds, link to criteria templates |
| Tracks | TracksTab | List tracks, create/edit/delete, link to topics |
| Awards | AwardsTab | List awards with prize amounts, CRUD |
| Assignments | AssignTab | Assign judges to rounds for grading |
| Register Teams | RegisterTeamsTab | View registered teams + assign to next/previous round |
| Submissions | SubmissionsTab | View submissions across all rounds |

## 2. Round Management (within a Hackathon)

- **List**: `/admin/hackathons/:id?tab=Rounds` — shows rounds in order
- **Create**: `/admin/hackathons/:id/rounds/create` — name, roundNo, startTime, endTime, passThreshold
- **Edit**: `/admin/hackathons/:id/rounds/:roundId/edit`
- **Detail**: `/admin/hackathons/:id/rounds/:roundId` — shows round info + criteria templates
- Each round has **Criteria Templates** (scoring rubrics)

### Criteria Template Management
- **List**: `/admin/hackathons/:id/rounds/:roundId/criteria-templates`
- **Create**: template title, description, list of criteria items
- Each criteria item: name, description (rich text), max score (0-100 slider)
- **Edit/Detail**: view and modify template + items

## 3. Track & Topic Management

### Tracks (themes/categories within a hackathon)
- List under `?tab=Tracks`
- Create/Edit: title, maxTeams
- Each track contains **Topics** (sub-categories)
- Topics CRUD: title, description

## 4. Award Management

- List under `?tab=Awards`
- Create/Edit: name, prize (USD), description
- Awards are linked to a hackathon event

## 5. Team Management

- URL: `/admin/teams`
- List: name, member count, locked status, created date
- Edit: team name
- Detail: team info + member list

## 6. User Management

- URL: `/admin/users`
- List: email, name, role, verified, disabled, ban status, created date
- Filters: keyword, role, disabled, verified, from/to date
- **Create**: email, password, firstName, lastName, role (Student/Lecturer/Staff), verified toggle
- **Edit**: same as create minus password
- **Detail**: full user info
- Actions: Delete (soft), Restore, Ban (with reason prompt), Unban

## 7. Notification Management

- URL: `/admin/notifications`
- List: title, type (Announcement/Update/Alert), audience, status (Sent/Draft), sentBy, date
- **Create/Edit**: title, body, type, audience target (All Users/Participants/Staff), target type (Personal/Team/System), status (Send/Draft)
- **Detail**: view notification content
- `/admin/my-notifications` — personal notification inbox

## 8. Report Management

- URL: `/admin/reports`
- List: title, type, status (Pending/Resolved/Rejected), date
- **ReportDetail** (`/admin/reports/:id`):
  - Hero card with report info
  - Status stepper (Pending → Under Review → Resolved/Rejected)
  - Content tabs (report body, evidence)
  - Sidebar with reporter info, reported entity, timeline
  - **Resolve action**: modal with resolution options + notes
- Filters: keyword, status, from/to date

## 9. Submission & Scoring

- **Submissions per hackathon**: `?tab=Submissions`
- **Submission detail** (`/admin/submissions/:id`):
  - Submission info (team, round, submitted date)
  - Grader scores list (paginated): each grader's evaluation
  - Score detail + score items (per-criteria breakdown)
  - Score items show: criteria name, score/max, grader comments

## 10. Register Team Round Progression

- Assign to next round: `POST /admin/register-teams/:id/assign-next-round`
- Revert to previous round: `POST /admin/register-teams/:id/revert-previous-round`
- View submission history per round

## 11. Dashboard

- URL: `/admin` (AdminDashboard.jsx)
- **Stats sections**: Hackathons (total/published/draft/closed), Users (total/student/lecturer/staff/admin), Teams (total/active/disabled)
- **Recent Activity tabs**: Hackathons, Users, Notifications, Reports
- Each tab shows 5 most recent items in a CardPanel
