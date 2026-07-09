# 07 — API Layer

## Axios Instance (`src/libs/api.js`)

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})
```

## Request Interceptor
- Attaches `Authorization: Bearer <token>` from localStorage
- Adds `ngrok-skip-browser-warning: true` header (for ngrok tunneling)

## Response Interceptor
- On 401: clears token, redirects to `/login` (except from `/login` or `/verify-email`)

## API Function Convention

All functions follow this pattern:

```js
export async function getResourceList(params = {}) {
  const { data } = await api.get('/admin/resource', { params })
  return data.data  // { items: [], totalCount: number, pageIndex: number, pageSize: number }
}

export async function getResourceDetail(id) {
  const { data } = await api.get(`/admin/resource/${id}`)
  return data.data  // single object
}

export async function createResource(payload) {
  const { data } = await api.post('/admin/resource', payload)
  return data  // { message, data: { ... } }
}

export async function updateResource(id, payload) {
  const { data } = await api.put(`/admin/resource/${id}`, payload)
  return data
}

export async function deleteResource(id) {
  const { data } = await api.delete(`/admin/resource/${id}`)
  return data
}
```

## API Response Structure

All responses from backend:

```json
{
  "data": {
    // For lists:
    "events": [],
    "totalCount": 100,
    "pageIndex": 1,
    "pageSize": 10
    // For counts:
    "total": 42
    // For single entity:
    "id": "...", "name": "...", ...
    // For operations:
    "message": "Success"
  }
}
```

Error responses:
```json
{
  "message": "Error description",
  "errors": { "field": "Field error message" }
}
```

## Pagination Convention

All list endpoints accept: `PageIndex` (default 1), `PageSize` (default 10)
Return: `{ items, totalCount, pageIndex, pageSize }`

## Admin API Endpoints Reference

| Module | Endpoint Pattern | Key Functions |
|--------|-----------------|---------------|
| Events | `/admin/events`, `/admin/events/count`, `/admin/events/recent` | getEvents, getEventDetail, createEvent, updateEvent, deleteEvent, restoreEvent, publishEvent, closeEvent |
| Users | `/admin/users`, `/admin/users/count`, `/admin/users/recent` | getUsers, getUserDetail, createUser, updateUser, deleteUser, restoreUser, banUser, unbanUser |
| Teams | `/admin/teams`, `/admin/teams/count` | getTeams, getTeamDetail, updateTeam |
| Rounds | `/admin/events/{id}/rounds` | getRounds, createRound, updateRound, deleteRound, getRoundDetail, swapRounds |
| Round Leaderboard | `/admin/rounds/{id}/leaderboard` | getRoundLeaderboard(roundId, params) |
| Event Leaderboard | `/admin/events/{id}/leaderboard` | getEventLeaderboard(eventId, params) |
| Chapter Leaderboard | `/admin/events/chapter/{year}/leaderboard` | getChapterLeaderboard(year, params) |
| Criteria Templates | `/admin/rounds/{id}/criteria-templates` | getTemplates, createTemplate, updateTemplate, deleteTemplate |
| Criteria Items | `/admin/criteria-templates/{id}/items` | getItems, createItem, updateItem, deleteItem |
| Tracks | `/admin/events/{id}/tracks` | getTracks, createTrack, updateTrack, deleteTrack |
| Topics | `/admin/tracks/{id}/topics` | getTopics, createTopic, updateTopic, deleteTopic |
| Awards | `/admin/events/{id}/awards` | getAwards, createAward, updateAward, deleteAward, swapAwards |
| Notifications | `/admin/notifications`, `/admin/notifications/recent` | getNotifications, createNotification, updateNotification, getNotificationDetail |
| Reports | `/admin/reports`, `/admin/reports/recent` | getReports, getReportDetail, updateReportStatus |
| Submissions | `/admin/events/{id}/submissions`, `/admin/submissions/{id}` | getEventSubmissions, getSubmissionDetail, getGraderScores |
| Scores | `/admin/scores/{id}`, `/admin/scores/{id}/items`, `/admin/score-items/{id}` | getScoreDetail, getScoreItems, getScoreItemDetail |
| Register Teams | various endpoints | assignToNextRound, revertToPreviousRound, getRegisterTeamSubmissions |
| Assignments | `/admin/events/{id}/event-assigns` | getAssignedUsers, assignUserToEvent, removeAssign, assignTrack, removeTrack |

## Staff API

Staff API (`src/api/staff.js`) mirrors admin but uses **mock data** with simulated delay. When adding a new admin API function, also add the corresponding staff mock function.

## Error Handling Pattern

```js
try {
  await apiCall()
  toast.success('Success')
} catch (err) {
  toast.error(err?.response?.data?.message || 'Something went wrong')
}
```
