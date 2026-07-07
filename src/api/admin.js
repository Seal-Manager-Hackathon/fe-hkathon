import api from '../libs/api'

/**
 * Count events by optional status filter.
 * @param {'Draft'|'Published'|'Closed'} [status]
 * @returns {Promise<{ total: number }>}
 */
export async function getEventsCount(status) {
  const params = status ? { Status: status } : {}
  const { data } = await api.get('/admin/events/count', { params })
  return data.data
}

/**
 * Count users by optional role filter.
 * @param {'Student'|'Lecturer'|'Staff'|'Admin'} [role]
 * @returns {Promise<{ total: number }>}
 */
export async function getUsersCount(role) {
  const params = role ? { Role: role } : {}
  const { data } = await api.get('/admin/users/count', { params })
  return data.data
}

/**
 * Count teams by optional IsDisable filter.
 * @param {boolean} [isDisable] - true=disabled, false=active, omit=all
 * @returns {Promise<{ total: number }>}
 */
export async function getTeamsCount(isDisable) {
  const params = isDisable !== undefined ? { IsDisable: isDisable } : {}
  const { data } = await api.get('/admin/teams/count', { params })
  return data.data
}

/**
 * Get 5 most recent events.
 * @returns {Promise<{ events: Array }>}
 */
export async function getRecentEvents() {
  const { data } = await api.get('/admin/events/recent')
  return data.data
}

/**
 * Get 5 most recent users.
 * @returns {Promise<{ users: Array }>}
 */
export async function getRecentUsers() {
  const { data } = await api.get('/admin/users/recent')
  return data.data
}

/**
 * Get paginated events (hackathons) list with search and filters.
 * @param {Object} params
 * @param {string} [params.Keyword] - Search event name (contains)
 * @param {'Draft'|'Published'|'Closed'} [params.Status]
 * @param {string} [params.FromDate] - ISO datetime
 * @param {string} [params.ToDate] - ISO datetime
 * @param {number} [params.PageIndex] - default 1
 * @param {number} [params.PageSize] - default 10
 * @returns {Promise<{ events: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getEvents(params = {}) {
  const { data } = await api.get('/admin/events', { params })
  return data.data
}

/**
 * Get event detail by ID.
 * @param {string} eventId
 * @returns {Promise<object>} full event object
 */
export async function getEventDetail(eventId) {
  const { data } = await api.get(`/admin/events/${eventId}`)
  return data.data
}

export async function getRecentNotifications() {
  const { data } = await api.get('/admin/notifications/recent')
  return data.data
}

/**
 * Get paginated users list with search and filters.
 * @param {Object} params
 * @param {string} [params.Keyword] - Search email, firstName, lastName, fullName
 * @param {'Admin'|'Staff'|'Student'|'Lecturer'} [params.Role]
 * @param {boolean} [params.IsDisable]
 * @param {boolean} [params.IsVerified]
 * @param {string} [params.FromDate] - ISO datetime
 * @param {string} [params.ToDate] - ISO datetime
 * @param {number} [params.PageIndex] - default 1
 * @param {number} [params.PageSize] - default 10
 * @returns {Promise<{ users: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getUsers(params = {}) {
  const { data } = await api.get('/admin/users', { params })
  return data.data
}

/**
 * Get user detail by ID.
 * @param {string} userId
 * @returns {Promise<object>} full user object
 */
export async function getUserDetail(userId) {
  const { data } = await api.get(`/admin/users/${userId}`)
  return data.data
}

/**
 * Update user by ID. Sends multipart/form-data.
 * Only included fields are updated; omitted fields remain unchanged.
 * @param {string} userId
 * @param {FormData} formData
 * @returns {Promise<{ message: string }>}
 */
export async function updateUser(userId, formData) {
  const { data } = await api.patch(`/admin/users/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}


/**
 * Create a new user (Admin only).
 * @param {{ email, password, firstName, lastName, role, college }} payload
 * @returns {Promise<{ id, email, firstName, lastName, role, college }>}
 */
export async function createUser(payload) {
  const { data } = await api.post('/admin/users', payload)
  return data.data
}

/**
 * Get paginated notifications list with search and filters.
 * @param {Object} params
 * @param {string} [params.Title] - Search contains (case-insensitive)
 * @param {'Personal'|'Team'|'System'} [params.TargetType]
 * @param {string} [params.FromDate] - ISO datetime
 * @param {string} [params.ToDate] - ISO datetime
 * @param {number} [params.PageIndex] - default 1
 * @param {number} [params.PageSize] - default 10
 * @returns {Promise<{ notifications: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getNotifications(params = {}) {
  const { data } = await api.get('/admin/notifications', { params })
  return data.data
}

/**
 * Get paginated teams list with search and filters.
 * @param {Object} params
 * @param {string} [params.Keyword] - Search team name (contains)
 * @param {boolean} [params.CanEdit]
 * @param {string} [params.FromDate] - ISO datetime
 * @param {string} [params.ToDate] - ISO datetime
 * @param {number} [params.PageIndex] - default 1
 * @param {number} [params.PageSize] - default 10
 * @returns {Promise<{ teams: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getTeams(params = {}) {
  const { data } = await api.get('/admin/teams', { params })
  return data.data
}

/**
 * Get team detail by ID, including member list.
 * @param {string} teamId
 * @returns {Promise<{ id, name, canEdit, isDisable, createdAt, updatedAt, members: Array }>}
 */
export async function getTeamDetail(teamId) {
  const { data } = await api.get(`/admin/teams/${teamId}`)
  return data.data
}

/**
 * Update team by ID. Only included fields are updated; omitted fields remain unchanged.
 * @param {string} teamId
 * @param {{ name?: string, canEdit?: boolean, isDisable?: boolean }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateTeam(teamId, payload) {
  const { data } = await api.patch(`/admin/teams/${teamId}`, payload)
  return data
}

export async function deleteTeam(teamId) {
  const { data } = await api.post(`/admin/teams/${teamId}/delete`)
  return data
}

export async function restoreTeam(teamId) {
  const { data } = await api.post(`/admin/teams/${teamId}/restore`)
  return data
}

/**
 * Get notification detail by ID.
 * @param {string} notificationId
 * @returns {Promise<{ id, userId, teamId, title, status, description, targetType, createdAt, updatedAt }>}
 */
export async function getNotificationDetail(notificationId) {
  const { data } = await api.get(`/admin/notifications/${notificationId}`)
  return data.data
}

/**
 * Update notification title and/or description.
 * Only included fields are updated; omitted fields remain unchanged.
 * @param {string} notificationId
 * @param {{ title?: string, description?: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateNotification(notificationId, payload) {
  const { data } = await api.patch(`/admin/notifications/${notificationId}`, payload)
  return data
}

/**
 * Soft-delete a notification (set IsDisable = true).
 * @param {string} notificationId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteNotification(notificationId) {
  const { data } = await api.post(`/admin/notifications/${notificationId}/delete`)
  return data
}

/**
 * Restore a soft-deleted notification (set IsDisable = false).
 * @param {string} notificationId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreNotification(notificationId) {
  const { data } = await api.post(`/admin/notifications/${notificationId}/restore`)
  return data
}

/**
 * Create a new notification.
 * @param {{ title: string, description: string, targetType: 'Personal'|'Team'|'System', userId?: string, teamId?: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createNotification(payload) {
  const { data } = await api.post('/admin/notifications', payload)
  return data
}

/**
 * Create a new event (hackathon). Defaults: Status=Draft, IsDisable=true, NumberRound=0.
 * @param {{ name: string, startTime: string, endTime: string, description?: string, registerLimitTime?: string, limitTeam?: number, minMember?: number, maxMember?: number, season?: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createEvent(payload) {
  const { data } = await api.post('/admin/events', payload)
  return data
}

/**
 * Update event by ID. Only included fields are updated; omitted fields remain unchanged.
 * @param {string} eventId
 * @param {{ name?: string, description?: string, startTime?: string, endTime?: string, registerLimitTime?: string, limitTeam?: number, minMember?: number, maxMember?: number, season?: string, isDisable?: boolean, status?: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateEvent(eventId, payload) {
  const { data } = await api.patch(`/admin/events/${eventId}`, payload)
  return data
}

/**
 * Get paginated rounds for an event.
 * @param {string} eventId
 * @param {Object} params
 * @param {string} [params.Keyword] - Search round name (contains)
 * @param {number} [params.RoundNo]
 * @param {boolean} [params.IsDisable]
 * @param {number} [params.PageIndex] - default 1
 * @param {number} [params.PageSize] - default 10
 * @returns {Promise<{ rounds: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getRounds(eventId, params = {}) {
  const { data } = await api.get(`/admin/events/${eventId}/rounds`, { params })
  return data.data
}

/**
 * Create a new round for an event. RoundNo is auto-calculated.
 * @param {string} eventId
 * @param {{ name: string, startTime: string, endTime: string, description?: string, startSubmission?: string, endSubmission?: string, limitTeam?: number }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createRound(eventId, payload) {
  const { data } = await api.post(`/admin/events/${eventId}/rounds`, payload)
  return data
}

/**
 * Soft-delete a user (set IsDisable = true).
 * @param {string} userId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteUser(userId) {
  const { data } = await api.post(`/admin/users/${userId}/delete`)
  return data
}

/**
 * Restore a soft-deleted user (set IsDisable = false).
 * @param {string} userId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreUser(userId) {
  const { data } = await api.post(`/admin/users/${userId}/restore`)
  return data
}

export async function banUser(userId, banReason) {
  const { data } = await api.post(`/admin/users/${userId}/ban`, { banReason })
  return data
}

export async function unbanUser(userId) {
  const { data } = await api.post(`/admin/users/${userId}/unban`)
  return data
}

/**
 * Get the highest round number in an event (null if none).
 * @param {string} eventId
 * @returns {Promise<number|null>}
 */
export async function getMaxRoundNo(eventId) {
  const { data } = await api.get(`/admin/events/${eventId}/rounds/max-round-no`)
  return data.data
}

/**
 * Soft-delete a round.
 * @param {string} roundId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteRound(roundId) {
  const { data } = await api.post(`/admin/rounds/${roundId}/delete`)
  return data
}

/**
 * Restore a soft-deleted round.
 * @param {string} roundId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreRound(roundId) {
  const { data } = await api.post(`/admin/rounds/${roundId}/restore`)
  return data
}

/**
 * Swap two rounds within the same event.
 * @param {string} eventId
 * @param {string} roundId - source round
 * @param {number} targetRoundNo - target round number to swap with
 * @returns {Promise<{ message: string }>}
 */
export async function swapRounds(eventId, roundId, targetRoundNo) {
  const { data } = await api.post(`/admin/events/${eventId}/rounds/${roundId}/swap`, { targetRoundNo })
  return data
}

/**
 * Get round detail by ID.
 * @param {string} roundId
 * @returns {Promise<object>}
 */
export async function getRoundDetail(roundId) {
  const { data } = await api.get(`/admin/rounds/${roundId}`)
  return data.data
}

/**
 * Update round by ID. Only included fields are updated; omitted fields remain unchanged.
 * @param {string} roundId
 * @param {{ name?: string, description?: string, startTime?: string, endTime?: string, startSubmission?: string, endSubmission?: string, limitTeam?: number }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateRound(roundId, payload) {
  const { data } = await api.patch(`/admin/rounds/${roundId}`, payload)
  return data
}

// ─── Criteria Templates ──────────────────────────────────────────────────────

export async function getCriteriaTemplates(roundId, params = {}) {
  const { data } = await api.get(`/admin/rounds/${roundId}/criteria-templates`, { params })
  return data.data
}

// ─── Tracks ─────────────────────────────────────────────────────────────────────

export async function getTracks(eventId, params = {}) {
  const { data } = await api.get(`/admin/events/${eventId}/tracks`, { params })
  return data.data
}

export async function createTrack(eventId, payload) {
  const { data } = await api.post(`/admin/events/${eventId}/tracks`, payload)
  return data
}

export async function updateTrack(eventId, trackId, payload) {
  const { data } = await api.patch(`/admin/events/${eventId}/tracks/${trackId}`, payload)
  return data
}

export async function getTrackDetail(eventId, trackId) {
  const { data } = await api.get(`/admin/events/${eventId}/tracks/${trackId}`)
  return data.data
}

export async function deleteTrack(trackId) {
  const { data } = await api.post(`/admin/tracks/${trackId}/delete`)
  return data
}

export async function restoreTrack(trackId) {
  const { data } = await api.post(`/admin/tracks/${trackId}/restore`)
  return data
}

// ─── Topics ──────────────────────────────────────────────────────────────

export async function getTopics(trackId, params = {}) {
  const { data } = await api.get(`/admin/tracks/${trackId}/topics`, { params })
  return data.data
}

export async function createTopic(trackId, payload) {
  const { data } = await api.post(`/admin/tracks/${trackId}/topics`, payload)
  return data
}

export async function getTopicDetail(topicId) {
  const { data } = await api.get(`/admin/topics/${topicId}`)
  return data.data
}

export async function updateTopic(topicId, payload) {
  const { data } = await api.patch(`/admin/topics/${topicId}`, payload)
  return data
}

export async function deleteTopic(topicId) {
  const { data } = await api.post(`/admin/topics/${topicId}/delete`)
  return data
}

export async function restoreTopic(topicId) {
  const { data } = await api.post(`/admin/topics/${topicId}/restore`)
  return data
}

// ─── Team Lock/Unlock ─────────────────────────────────────────────────────────

export async function lockTeam(teamId) {
  const { data } = await api.post(`/admin/teams/${teamId}/lock`)
  return data
}

export async function unlockTeam(teamId) {
  const { data } = await api.post(`/admin/teams/${teamId}/unlock`)
  return data
}

// ─── Event Delete/Restore ──────────────────────────────────────────────────

export async function deleteEvent(eventId) {
  const { data } = await api.post(`/admin/events/${eventId}/delete`)
  return data
}

export async function restoreEvent(eventId) {
  const { data } = await api.post(`/admin/events/${eventId}/restore`)
  return data
}

