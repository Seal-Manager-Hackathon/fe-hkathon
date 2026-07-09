# 00 — Project Overview

## What is SEAL Hackathon?

SEAL Hackathon is a **hackathon management platform** where universities/organizations can:

- Create and manage hackathon events
- Organize tracks (themes) and topics within tracks  
- Define multiple rounds with criteria-based judging
- Manage teams and registrations
- Collect and score submissions per round
- Send notifications to users
- Handle reports from users
- Award winners per track/round

## User Roles

| Role | Description | Access |
|------|-------------|--------|
| **Admin** | Full platform control | `/admin/*` — all CRUD, dashboard, user management |
| **Staff** | Operations/event management | `/staff/*` — event CRUD, team/user review, submissions |
| **Student** | End user — participant | `/student/*` — browse hackathons, register teams, submit work |
| **Lecturer** | Judge/mentor | Can be assigned to judge rounds, view submissions |

> **Note:** The `admin/` and `staff/` directories are structurally identical clones. Admin has the canonical implementation; staff is a mirror. Any feature added to admin should also be added to staff.

## High-Level Domain Model

```
Hackathon (Event)
  ├── Tracks (categories/themes)
  │   └── Topics (sub-categories within a track)
  ├── Rounds (multiple judging rounds)
  │   └── Criteria Templates (scoring rubrics)
  │       └── Criteria Items (individual scoring dimensions)
  ├── Awards (prizes)
  ├── Register Teams (teams registered for this event)
  │   └── Submissions (per-round submissions)
  │       └── Grader Scores (judge evaluations)
  │           └── Score Items (per-criteria scores)
  ├── Users (platform users)
  ├── Teams (global team entities)
  ├── Notifications (announcements/alerts/updates)
  └── Reports (user-submitted reports)
```

## Hackathon Lifecycle States

```
Draft → Published → Closed
  ↓         ↓          ↓
Can edit   Active     Finished
(invisible (visible   (visible,
to users)  to users)  read-only)
```
