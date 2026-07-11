import api from '../libs/api'

// ============================ DASHBOARD ============================

/**
 * Count events by optional status filter.
 * @param {'Draft'|'Published'|'Closed'} [status]
 * @returns {Promise<{ total: number }>}
 */
export async function getLecturerEventsCount(status) {
  const params = status ? { Status: status } : {}
  const { data } = await api.get('/lecturer/events/count', { params })
  return data.data
}

/**
 * Count users by optional role filter.
 * @param {'Student'|'Lecturer'|'Staff'|'Admin'} [role]
 * @returns {Promise<{ total: number }>}
 */
export async function getLecturerUsersCount(role) {
  const params = role ? { Role: role } : {}
  const { data } = await api.get('/lecturer/users/count', { params })
  return data.data
}

/**
 * Count teams by optional IsDisable filter.
 * @param {boolean} [isDisable]
 * @returns {Promise<{ total: number }>}
 */
export async function getLecturerTeamsCount(isDisable) {
  const params = isDisable !== undefined ? { IsDisable: isDisable } : {}
  const { data } = await api.get('/lecturer/teams/count', { params })
  return data.data
}

/**
 * Get 5 most recent events.
 * @returns {Promise<{ events: Array }>}
 */
export async function getLecturerRecentEvents() {
  const { data } = await api.get('/lecturer/events/recent')
  return data.data
}

/**
 * Get 5 most recent users.
 * @returns {Promise<{ users: Array }>}
 */
export async function getLecturerRecentUsers() {
  const { data } = await api.get('/lecturer/users/recent')
  return data.data
}

/**
 * Get 5 most recent notifications.
 * @returns {Promise<{ notifications: Array }>}
 */
export async function getLecturerRecentNotifications() {
  const { data } = await api.get('/lecturer/notifications/recent')
  return data.data
}

/**
 * Get 5 most recent reports.
 * @returns {Promise<{ reports: Array }>}
 */
export async function getLecturerRecentReports() {
  const { data } = await api.get('/lecturer/reports/recent')
  return data.data
}

// ============================ EVENTS ============================

/**
 * Get paginated events assigned to the current lecturer (Judge/Mentor).
 * Mirrors admin GET /api/v1/admin/events.
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {'Draft'|'Published'|'Closed'} [params.Status]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ events: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getLecturerEvents(params = {}) {
  const { data } = await api.get('/lecturer/events', { params })
  return data.data
}

/**
 * Get events assigned to the current lecturer via AssignEvents (Role = Judge/Mentor).
 * Auto-excludes Draft events. Returns all events including disabled ones.
 * Mirrors admin GET /api/v1/admin/events.
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {'Published'|'Closed'} [params.Status]
 * @param {boolean} [params.IsDisable]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ events: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getLecturerMyLecturerEvents(params = {}) {
  const { data } = await api.get('/lecturer/events/my-lecturer', { params })
  return data.data
}

/**
 * Get event detail by ID (lecturer must be assigned to the event).
 * Mirrors admin GET /api/v1/admin/events/{eventId}.
 * @param {string} eventId
 * @returns {Promise<{
 *   id: string,
 *   name: string,
 *   description: string,
 *   status: string,
 *   numberRound: number,
 *   season: string,
 *   startTime: string,
 *   endTime: string,
 *   registerLimitTime: string,
 *   limitTeam: number,
 *   minMember: number,
 *   maxMember: number,
 *   isDisable: boolean,
 *   createdAt: string,
 *   updatedAt: string,
 * }>}
 */
export async function getLecturerEventDetail(eventId) {
  const { data } = await api.get(`/lecturer/events/${eventId}`)
  return data.data
}

// ============================ CRITERIA TEMPLATES ============================

/**
 * Get criteria templates for a round (lecturer view).
 * Only returns active templates (isActive = true, isDisable = false).
 * @param {string} roundId
 * @param {Object} [params]
 * @param {string} [params.keyword]
 * @returns {Promise<{ templates: Array, totalCount: number }>}
 */
export async function getLecturerCriteriaTemplates(roundId, params = {}) {
  const { data } = await api.get(`/lecturer/rounds/${roundId}/criteria-templates`, { params })
  return data.data
}

/**
 * Get criteria template detail by ID (lecturer view).
 * @param {string} templateId
 * @returns {Promise<object>}
 */
export async function getLecturerCriteriaTemplateDetail(templateId) {
  const { data } = await api.get(`/lecturer/criteria-templates/${templateId}`)
  return data.data
}

/**
 * Get criteria items for a template (lecturer view).
 * @param {string} templateId
 * @param {Object} [params]
 * @returns {Promise<{ items: Array, totalCount: number }>}
 */
export async function getLecturerCriteriaItems(templateId, params = {}) {
  const { data } = await api.get(`/lecturer/criteria-templates/${templateId}/criteria-items`, { params })
  return data.data
}

// ============================ TEAMS ============================

/**
 * Get team detail by ID (lecturer view).
 * @param {string} teamId
 * @returns {Promise<{
 *   id: string,
 *   name: string,
 *   canEdit: boolean,
 *   isDisable: boolean,
 *   createdAt: string,
 *   updatedAt: string,
 *   members: Array,
 * }>}
 */
export async function getLecturerTeamDetail(teamId) {
  const { data } = await api.get(`/lecturer/teams/${teamId}`)
  return data.data
}

// ============================ ROUNDS ============================

/**
 * Get rounds for an event (lecturer view). Only returns active rounds (isDisable = false).
 * No pagination — returns all matching rounds.
 * @param {string} eventId
 * @param {Object} [params]
 * @param {string} [params.keyword]
 * @param {number} [params.roundNo]
 * @returns {Promise<{ rounds: Array, totalCount: number }>}
 */
export async function getLecturerRounds(eventId, params = {}) {
  const { data } = await api.get(`/lecturer/events/${eventId}/rounds`, { params })
  return data.data
}

/**
 * Get round detail by ID (lecturer view).
 * @param {string} roundId
 * @returns {Promise<object>}
 */
export async function getLecturerRoundDetail(roundId) {
  const { data } = await api.get(`/lecturer/rounds/${roundId}`)
  return data.data
}

// ============================ REGISTER TEAMS ============================

/**
 * Get paginated register teams for an event (lecturer view).
 * Supports keyword, status, isBanned, isDisable, round, track, topic filters.
 * Mirrors admin GET /api/v1/admin/events/{eventId}/register-teams.
 * @param {string} eventId
 * @param {Object} [params]
 * @param {string} [params.Keyword]
 * @param {'Pending'|'Approved'|'Rejected'|'Banned'} [params.Status]
 * @param {boolean} [params.IsBanned]
 * @param {boolean} [params.IsDisable]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {string} [params.RoundId]
 * @param {string} [params.TrackId]
 * @param {string} [params.TopicId]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ registerTeams: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getLecturerRegisterTeams(eventId, params = {}) {
  const { data } = await api.get(`/lecturer/events/${eventId}/register-teams`, { params })
  return data.data
}

/**
 * Get register team detail by ID (lecturer view).
 * Returns full info including event, team, track, topic, members.
 * @param {string} registerTeamId
 * @returns {Promise<object>}
 */
export async function getLecturerRegisterTeamDetail(registerTeamId) {
  const { data } = await api.get(`/lecturer/register-teams/${registerTeamId}`)
  return data.data
}

// ============================ TRACKS ============================

/**
 * Get my assigned tracks for an event (lecturer view).
 * Only returns active tracks with event role info.
 * @param {string} eventId
 * @param {Object} [params]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{
 *   tracks: Array<{
 *     id: string, eventId: string, title: string, description: string,
 *     maxTeam: number, isDisable: boolean,
 *     eventRoleId: string, eventRoleName: string,
 *     createdAt: string, updatedAt: string,
 *   }>,
 *   totalCount: number, pageIndex: number, pageSize: number
 * }>}
 */
export async function getLecturerMyTracks(eventId, params = {}) {
  const { data } = await api.get(`/lecturer/events/${eventId}/my-tracks`, { params })
  return data.data
}

/**
 * Get track detail by ID (lecturer view).
 * Includes registerTeamCount and eventRoleName.
 * @param {string} trackId
 * @returns {Promise<object>}
 */
export async function getLecturerTrackDetail(trackId) {
  const { data } = await api.get(`/lecturer/tracks/${trackId}`)
  return data.data
}

// ============================ TOPICS ============================

/**
 * Get topics for a track (lecturer view).
 * Only returns active topics (isDisable = false).
 * @param {string} trackId
 * @param {Object} [params]
 * @param {string} [params.Keyword]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ topics: Array, totalCount: number }>}
 */
export async function getLecturerTopics(trackId, params = {}) {
  const { data } = await api.get(`/lecturer/tracks/${trackId}/topics`, { params })
  return data.data
}

/**
 * Get topic detail by ID (lecturer view).
 * @param {string} topicId
 * @returns {Promise<object>}
 */
export async function getLecturerTopicDetail(topicId) {
  const { data } = await api.get(`/lecturer/topics/${topicId}`)
  return data.data
}

// ============================ AWARDS ============================

/**
 * Get awards for an event (lecturer view).
 * Only returns active awards (isDisable = false).
 * @param {string} eventId
 * @param {Object} [params]
 * @param {string} [params.Keyword]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ awards: Array, totalCount: number }>}
 */
export async function getLecturerAwards(eventId, params = {}) {
  const { data } = await api.get(`/lecturer/events/${eventId}/awards`, { params })
  return data.data
}

/**
 * Get award detail by ID (lecturer view).
 * @param {string} awardId
 * @returns {Promise<object>}
 */
export async function getLecturerAwardDetail(awardId) {
  const { data } = await api.get(`/lecturer/awards/${awardId}`)
  return data.data
}

// ============================ LEADERBOARD ============================

/**
 * Get chapter leaderboard for a year (lecturer view).
 * @param {number} year
 * @param {Object} [params]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ year: number, eventCount: number, items: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getLecturerChapterLeaderboard(year, params = {}) {
  const { data } = await api.get(`/lecturer/events/chapter/${year}/leaderboard`, { params })
  return data.data
}

/**
 * Get event leaderboard (lecturer view).
 * @param {string} eventId
 * @param {Object} [params]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ eventId: string, eventName: string, totalRounds: number, items: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getLecturerEventLeaderboard(eventId, params = {}) {
  const { data } = await api.get(`/lecturer/events/${eventId}/leaderboard`, { params })
  return data.data
}

// ============================ ASSIGN ============================

/**
 * Get users assigned to an event (lecturer view).
 * @param {string} eventId
 * @param {Object} [params]
 * @param {string} [params.Keyword]
 * @param {string} [params.EventRole]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ items: Array, totalCount: number }>}
 */
export async function getLecturerEventAssign(eventId, params = {}) {
  const { data } = await api.get(`/lecturer/events/${eventId}/assign`, { params })
  return data.data
}

/**
 * Get round leaderboard (lecturer view).
 * @param {string} roundId
 * @param {Object} [params]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ roundId: string, roundName: string, eventName: string, items: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getLecturerRoundLeaderboard(roundId, params = {}) {
  const { data } = await api.get(`/lecturer/rounds/${roundId}/leaderboard`, { params })
  return data.data
}
