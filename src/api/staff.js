import api from '../libs/api'

// ============================ DASHBOARD ============================

/**
 * Count events by optional status filter.
 * @param {'Draft'|'Published'|'Closed'} [status]
 * @returns {Promise<{ total: number }>}
 */
export async function getEventsCount(status) {
  const params = status ? { Status: status } : {}
  const { data } = await api.get('/staff/events/count', { params })
  return data.data
}

/**
 * Count users by optional role filter.
 * @param {'Student'|'Lecturer'|'Staff'|'Admin'} [role]
 * @returns {Promise<{ total: number }>}
 */
export async function getUsersCount(role) {
  const params = role ? { Role: role } : {}
  const { data } = await api.get('/staff/users/count', { params })
  return data.data
}

/**
 * Count teams by optional IsDisable filter.
 * @param {boolean} [isDisable]
 * @returns {Promise<{ total: number }>}
 */
export async function getTeamsCount(isDisable) {
  const params = isDisable !== undefined ? { IsDisable: isDisable } : {}
  const { data } = await api.get('/staff/teams/count', { params })
  return data.data
}

/**
 * Get 5 most recent events.
 * @returns {Promise<{ events: Array }>}
 */
export async function getRecentEvents() {
  const { data } = await api.get('/staff/events/recent')
  return data.data
}

/**
 * Get 5 most recent users.
 * @returns {Promise<{ users: Array }>}
 */
export async function getRecentUsers() {
  const { data } = await api.get('/staff/users/recent')
  return data.data
}

/**
 * Get 5 most recent notifications.
 * @returns {Promise<{ notifications: Array }>}
 */
export async function getRecentNotifications() {
  const { data } = await api.get('/staff/notifications/recent')
  return data.data
}

/**
 * Get 5 most recent reports.
 * @returns {Promise<{ reports: Array }>}
 */
export async function getRecentReports() {
  const { data } = await api.get('/staff/reports/recent')
  return data.data
}

// ============================ EVENTS ============================

/**
 * Get paginated events list with search and filters.
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {'Draft'|'Published'|'Closed'} [params.Status]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ events: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getEvents(params = {}) {
  const { data } = await api.get('/staff/events', { params })
  return data.data
}

/**
 * Get events where the current staff user is assigned as Staff (EventRole = Staff).
 * Auto-excludes Draft events. Returns all events including disabled ones.
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {'Ongoing'|'Upcoming'|'Completed'} [params.Status]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ items: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getMyStaffEvents(params = {}) {
  const { data } = await api.get('/staff/events/my-staff', { params })
  return data.data
}

/**
 * Get event detail by ID (staff my-staff endpoint).
 * Only returns data if the current staff user is assigned to the event.
 * Returns 404 if not assigned — does not leak event existence.
 *
 * Extended fields vs list endpoint: registerLimitTime, limitTeam, minMember, maxMember, eventRoleId, eventRoleName.
 *
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
 *   eventRoleId: string,
 *   eventRoleName: string,
 *   isDisable: boolean,
 *   createdAt: string,
 *   updatedAt: string,
 * }>}
 */
export async function getEventDetail(eventId) {
  const { data } = await api.get(`/staff/events/${eventId}`)
  return data.data
}

/**
 * Create a new event.
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createEvent(payload) {
  const { data } = await api.post('/staff/events', payload)
  return data
}

/**
 * Update event by ID.
 * @param {string} eventId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateEvent(eventId, payload) {
  const { data } = await api.patch(`/staff/events/${eventId}`, payload)
  return data
}

/**
 * Soft-delete an event.
 * @param {string} eventId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteEvent(eventId) {
  const { data } = await api.post(`/staff/events/${eventId}/delete`)
  return data
}

/**
 * Restore a soft-deleted event.
 * @param {string} eventId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreEvent(eventId) {
  const { data } = await api.post(`/staff/events/${eventId}/restore`)
  return data
}

// ============================ USERS ============================

/**
 * Get paginated users list with search and filters (sorted with newest first).
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {'Admin'|'Staff'|'Student'|'Lecturer'} [params.Role]
 * @param {boolean} [params.IsDisable]
 * @param {boolean} [params.IsVerified]
 * @param {boolean} [params.IsBanned] — BanReason != null
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{
 *   users: Array<{
 *     id: string,
 *     email: string,
 *     firstName: string,
 *     lastName: string,
 *     role: string,
 *     status: string,
 *     isVerified: boolean,
 *     isDisable: boolean,
 *     banReason: string|null,
 *     bannedAt: string|null,
 *     avatarUrl: string|null,
 *     college: string|null,
 *     createdAt: string,
 *   }>,
 *   totalCount: number,
 *   pageIndex: number,
 *   pageSize: number,
 * }>}
 */
export async function getUsers(params = {}) {
  const { data } = await api.get('/staff/users', { params })
  return data.data
}

/**
 * Get user detail by ID.
 * @param {string} userId
 * @returns {Promise<{
 *   id: string,
 *   email: string,
 *   firstName: string,
 *   lastName: string,
 *   phoneNumber: string|null,
 *   avatarUrl: string|null,
 *   bio: string|null,
 *   address: string|null,
 *   dateOfBirth: string|null,
 *   studentId: string|null,
 *   college: string|null,
 *   imgUrl: string|null,
 *   linkUrl: string|null,
 *   role: string,
 *   status: string,
 *   isVerified: boolean,
 *   isDisable: boolean,
 *   banReason: string|null,
 *   bannedAt: string|null,
 *   verifyEmailAt: string|null,
 *   createdAt: string,
 *   updatedAt: string,
 * }>}
 */
export async function getUserDetail(userId) {
  const { data } = await api.get(`/staff/users/${userId}`)
  return data.data
}

/**
 * Get events that a user has participated in.
 * @param {string} userId
 * @param {object} [params]
 * @returns {Promise<{ events: Array, totalCount: number }>}
 */
export async function getUserEvents(userId, params = {}) {
  const { data } = await api.get(`/staff/users/${userId}/events`, { params })
  return data.data
}

/**
 * Create a new user.
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function createUser(payload) {
  const { data } = await api.post('/staff/users', payload)
  return data.data
}

/**
 * Update user by ID (multipart/form-data).
 * @param {string} userId
 * @param {FormData} formData
 * @returns {Promise<{ message: string }>}
 */
export async function updateUser(userId, formData) {
  const { data } = await api.patch(`/staff/users/${userId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * Soft-delete a user.
 * @param {string} userId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteUser(userId) {
  const { data } = await api.post(`/staff/users/${userId}/delete`)
  return data
}

/**
 * Restore a soft-deleted user.
 * @param {string} userId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreUser(userId) {
  const { data } = await api.post(`/staff/users/${userId}/restore`)
  return data
}

/**
 * Ban a user with a reason.
 * @param {string} userId
 * @param {string} banReason
 * @returns {Promise<{ message: string }>}
 */
export async function banUser(userId, banReason) {
  const { data } = await api.post(`/staff/users/${userId}/ban`, { banReason })
  return data
}

/**
 * Unban a user.
 * @param {string} userId
 * @returns {Promise<{ message: string }>}
 */
export async function unbanUser(userId) {
  const { data } = await api.post(`/staff/users/${userId}/unban`)
  return data
}

// ============================ TEAMS ============================

/**
 * Get paginated teams list with search and filters.
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {boolean} [params.CanEdit]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ teams: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getTeams(params = {}) {
  const { data } = await api.get('/staff/teams', { params })
  return data.data
}

/**
 * Get team detail by ID.
 * @param {string} teamId
 * @returns {Promise<object>}
 */
export async function getTeamDetail(teamId) {
  const { data } = await api.get(`/staff/teams/${teamId}`)
  return data.data
}

/**
 * Update team by ID.
 * @param {string} teamId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateTeam(teamId, payload) {
  const { data } = await api.patch(`/staff/teams/${teamId}`, payload)
  return data
}

/**
 * Soft-delete a team.
 * @param {string} teamId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteTeam(teamId) {
  const { data } = await api.post(`/staff/teams/${teamId}/delete`)
  return data
}

/**
 * Restore a soft-deleted team.
 * @param {string} teamId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreTeam(teamId) {
  const { data } = await api.post(`/staff/teams/${teamId}/restore`)
  return data
}

/**
 * Lock a team.
 * @param {string} teamId
 * @returns {Promise<{ message: string }>}
 */
export async function lockTeam(teamId) {
  const { data } = await api.post(`/staff/teams/${teamId}/lock`)
  return data
}

/**
 * Unlock a team.
 * @param {string} teamId
 * @returns {Promise<{ message: string }>}
 */
export async function unlockTeam(teamId) {
  const { data } = await api.post(`/staff/teams/${teamId}/unlock`)
  return data
}

/**
 * Get register history for a team.
 * @param {string} teamId
 * @param {Object} [params]
 * @returns {Promise<{ registerTeams: Array, totalCount: number }>}
 */
export async function getTeamRegisterHistory(teamId, params = {}) {
  const { data } = await api.get(`/staff/teams/${teamId}/register-teams`, { params })
  return data.data
}

// ============================ NOTIFICATIONS ============================

/**
 * Get paginated notifications list with search and filters.
 * @param {Object} params
 * @param {string} [params.Title]
 * @param {'Personal'|'Team'|'System'} [params.TargetType]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ notifications: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getNotifications(params = {}) {
  const { data } = await api.get('/staff/notifications', { params })
  return data.data
}

/**
 * Get notification detail by ID.
 * @param {string} notificationId
 * @returns {Promise<object>}
 */
export async function getNotificationDetail(notificationId) {
  const { data } = await api.get(`/staff/notifications/${notificationId}`)
  return data.data
}

/**
 * Create a new notification.
 * @param {{ title: string, description: string, targetType: string, userId?: string, teamId?: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createNotification(payload) {
  const { data } = await api.post('/staff/notifications', payload)
  return data
}

/**
 * Update notification by ID.
 * @param {string} notificationId
 * @param {{ title?: string, description?: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateNotification(notificationId, payload) {
  const { data } = await api.patch(`/staff/notifications/${notificationId}`, payload)
  return data
}

/**
 * Soft-delete a notification.
 * @param {string} notificationId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteNotification(notificationId) {
  const { data } = await api.post(`/staff/notifications/${notificationId}/delete`)
  return data
}

/**
 * Restore a soft-deleted notification.
 * @param {string} notificationId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreNotification(notificationId) {
  const { data } = await api.post(`/staff/notifications/${notificationId}/restore`)
  return data
}

// ============================ REPORTS ============================

/**
 * Get paginated reports list with search and filters.
 * @param {Object} params
 * @param {string} [params.keyword]
 * @param {'Pending'|'Resolved'|'Rejected'} [params.status]
 * @param {number} [params.pageIndex]
 * @param {number} [params.pageSize]
 * @returns {Promise<{ items: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getReports(params = {}) {
  const { data } = await api.get('/staff/reports', { params })
  return data.data
}

/**
 * Get report detail by ID.
 * @param {string} reportId
 * @returns {Promise<Object>}
 */
export async function getReportDetail(reportId) {
  const { data } = await api.get(`/staff/reports/${reportId}`)
  return data.data
}

/**
 * Create a new report.
 * @param {{ title: string, description: string, typeReport: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createReport(payload) {
  const { data } = await api.post('/staff/reports', payload)
  return data
}

/**
 * Update report status (Resolve / Reject).
 * @param {string} reportId
 * @param {'Pending'|'Resolved'|'Rejected'} status
 * @param {string} [reason]
 * @returns {Promise<{ data: null, message: string, status: number }>}
 */
export async function updateReportStatus(reportId, status, reason) {
  const payload = { status }
  if (reason) payload.reason = reason
  const { data } = await api.patch(`/staff/reports/${reportId}/status`, payload)
  return data
}

// ============================ ROUNDS ============================

/**
 * Get paginated rounds for an event.
 * @param {string} eventId
 * @param {Object} [params]
 * @param {string} [params.Keyword]
 * @param {number} [params.RoundNo]
 * @param {boolean} [params.IsDisable]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ rounds: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getRounds(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/rounds`, { params })
  return data.data
}

/**
 * Get round detail by ID (same pattern as admin).
 * @param {string} roundId
 * @returns {Promise<object>}
 */
export async function getRoundDetail(roundId) {
  const { data } = await api.get(`/staff/rounds/${roundId}`)
  return data.data
}

/**
 * Create a new round for an event.
 * @param {string} eventId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createRound(eventId, payload) {
  const { data } = await api.post(`/staff/events/${eventId}/rounds`, payload)
  return data
}

/**
 * Update round by ID.
 * @param {string} roundId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateRound(roundId, payload) {
  const { data } = await api.patch(`/staff/rounds/${roundId}`, payload)
  return data
}

/**
 * Soft-delete a round.
 * @param {string} roundId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteRound(roundId) {
  const { data } = await api.post(`/staff/rounds/${roundId}/delete`)
  return data
}

/**
 * Restore a soft-deleted round.
 * @param {string} roundId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreRound(roundId) {
  const { data } = await api.post(`/staff/rounds/${roundId}/restore`)
  return data
}

/**
 * Get the highest round number in an event.
 * @param {string} eventId
 * @returns {Promise<number|null>}
 */
export async function getMaxRoundNo(eventId) {
  const { data } = await api.get(`/staff/events/${eventId}/rounds/max-round-no`)
  return data.data
}

/**
 * Swap two rounds within the same event.
 * @param {string} eventId
 * @param {string} roundId
 * @param {number} targetRoundNo
 * @returns {Promise<{ message: string }>}
 */
export async function swapRounds(eventId, roundId, targetRoundNo) {
  const { data } = await api.post(`/staff/events/${eventId}/rounds/${roundId}/swap`, { targetRoundNo })
  return data
}

// ============================ CRITERIA TEMPLATES ============================

/**
 * Get criteria templates for a round (same pattern as admin).
 * @param {string} roundId
 * @param {Object} [params]
 * @returns {Promise<{ criteriaTemplates: Array, totalCount: number }>}
 */
export async function getCriteriaTemplates(roundId, params = {}) {
  const { data } = await api.get(`/staff/rounds/${roundId}/criteria-templates`, { params })
  return data.data
}

/**
 * Get criteria template detail by ID.
 * @param {string} templateId
 * @returns {Promise<object>}
 */
export async function getCriteriaTemplateDetail(templateId) {
  const { data } = await api.get(`/staff/criteria-templates/${templateId}`)
  return data.data
}

/**
 * Create a criteria template for a round (same pattern as admin).
 * @param {string} roundId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createCriteriaTemplate(roundId, payload) {
  const { data } = await api.post(`/staff/rounds/${roundId}/criteria-templates`, payload)
  return data
}

/**
 * Update a criteria template.
 * @param {string} templateId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateCriteriaTemplate(templateId, payload) {
  const { data } = await api.patch(`/staff/criteria-templates/${templateId}`, payload)
  return data
}

/**
 * Soft-delete a criteria template.
 * @param {string} templateId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteCriteriaTemplate(templateId) {
  const { data } = await api.post(`/staff/criteria-templates/${templateId}/delete`)
  return data
}

/**
 * Restore a soft-deleted criteria template.
 * @param {string} templateId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreCriteriaTemplate(templateId) {
  const { data } = await api.post(`/staff/criteria-templates/${templateId}/restore`)
  return data
}

/**
 * Activate a criteria template.
 * @param {string} templateId
 * @returns {Promise<{ message: string }>}
 */
export async function activateCriteriaTemplate(templateId) {
  const { data } = await api.post(`/staff/criteria-templates/${templateId}/activate`)
  return data
}

// ============================ CRITERIA ITEMS ============================

/**
 * Get criteria items for a template (same pattern as admin).
 * @param {string} templateId
 * @param {Object} [params]
 * @returns {Promise<{ items: Array, totalCount: number }>}
 */
export async function getCriteriaItems(templateId, params = {}) {
  const { data } = await api.get(`/staff/criteria-templates/${templateId}/items`, { params })
  return data.data
}

/**
 * Get criteria item detail by ID.
 * @param {string} itemId
 * @returns {Promise<object>}
 */
export async function getCriteriaItemDetail(itemId) {
  const { data } = await api.get(`/staff/criteria-items/${itemId}`)
  return data.data
}

/**
 * Create a criteria item in a template.
 * @param {string} templateId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function createCriteriaItem(templateId, payload) {
  const { data } = await api.post(`/staff/criteria-templates/${templateId}/criteria-items`, payload)
  return data
}

/**
 * Update a criteria item.
 * @param {string} itemId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
export async function updateCriteriaItem(itemId, payload) {
  const { data } = await api.patch(`/staff/criteria-items/${itemId}`, payload)
  return data
}

/**
 * Soft-delete a criteria item.
 * @param {string} itemId
 * @returns {Promise<{ message: string }>}
 */
export async function deleteCriteriaItem(itemId) {
  const { data } = await api.post(`/staff/criteria-items/${itemId}/delete`)
  return data
}

/**
 * Restore a soft-deleted criteria item.
 * @param {string} itemId
 * @returns {Promise<{ message: string }>}
 */
export async function restoreCriteriaItem(itemId) {
  const { data } = await api.post(`/staff/criteria-items/${itemId}/restore`)
  return data
}

// ============================ TRACKS ============================

/**
 * Get tracks for an event.
 * @param {string} eventId
 * @param {Object} [params]
 * @returns {Promise<{ tracks: Array, totalCount: number }>}
 */
export async function getTracks(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/tracks`, { params })
  return data.data
}

/**
 * Get track detail by ID.
 * @param {string} eventId
 * @param {string} trackId
 * @returns {Promise<object>}
 */
export async function getTrackDetail(trackId) {
  const { data } = await api.get(`/staff/tracks/${trackId}`)
  return data.data
}

/**
 * Get topics for a track.
 * @param {string} trackId
 * @param {Object} [params]
 * @returns {Promise<{ topics: Array, totalCount: number }>}
 */
export async function getTopics(trackId, params = {}) {
  const { data } = await api.get(`/staff/tracks/${trackId}/topics`, { params })
  return data.data
}

/**
 * Get topic detail by ID.
 * @param {string} topicId
 * @returns {Promise<object>}
 */
export async function getTopicDetail(topicId) {
  const { data } = await api.get(`/staff/topics/${topicId}`)
  return data.data
}

// ============================ AWARDS ============================

/**
 * Get awards for an event.
 * @param {string} eventId
 * @param {Object} [params]
 * @returns {Promise<{ awards: Array, totalCount: number }>}
 */
export async function getAwards(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/awards`, { params })
  return data.data
}

/**
 * Get award detail by ID.
 * @param {string} awardId
 * @returns {Promise<object>}
 */
export async function getAwardDetail(awardId) {
  const { data } = await api.get(`/staff/awards/${awardId}`)
  return data.data
}

/**
 * Create an award in an event.
 * @param {string} eventId
 * @param {object} payload
 * @returns {Promise<{ message: string }>}
 */
// ============================ ASSIGN ============================

/**
 * Get users assigned to an event.
 * @param {string} eventId
 * @param {Object} [params]
 */
export async function getAssignedUsers(eventId, params = {}) {
  const { data } = await api.get(`/staff/assign/events/${eventId}/assigned`, { params })
  return data.data
}

/**
 * Get lecturers available to be assigned.
 * @param {string} eventId
 * @param {Object} [params]
 */
export async function getAvailableLecturers(eventId, params = {}) {
  const { data } = await api.get(`/staff/assign/events/${eventId}/lecturers/available`, { params })
  return data.data
}

/**
 * Get staff available to be assigned.
 * @param {string} eventId
 * @param {Object} [params]
 */
export async function getAvailableStaff(eventId, params = {}) {
  const { data } = await api.get(`/staff/assign/events/${eventId}/staff/available`, { params })
  return data.data
}

/**
 * Assign a user to an event.
 * @param {string} eventId
 * @param {{ userId: string, eventRole: string }} payload
 */
export async function assignUserToEvent(eventId, payload) {
  const { data } = await api.post(`/staff/assign/events/${eventId}/assign/users`, payload)
  return data
}

/**
 * Soft-delete a user assignment.
 * @param {string} assignEventId
 */
export async function removeAssign(assignEventId) {
  const { data } = await api.post(`/staff/assign/event-assigns/${assignEventId}/remove`)
  return data
}

/**
 * Restore a user assignment.
 * @param {string} assignEventId
 */
export async function restoreAssign(assignEventId) {
  const { data } = await api.post(`/staff/assign/event-assigns/${assignEventId}/restore`)
  return data
}

/**
 * Assign a track to an event assign.
 * @param {string} assignEventId
 * @param {{ trackId: string }} payload
 */
export async function assignTrackToEventAssign(assignEventId, payload) {
  const { data } = await api.post(`/staff/assign/event-assigns/${assignEventId}/tracks`, payload)
  return data
}

/**
 * Remove a track from an assign event.
 * @param {string} assignEventId
 * @param {string} trackId
 */
export async function removeTrackFromAssign(assignEventId, trackId) {
  const { data } = await api.post(`/staff/assign/event-assigns/${assignEventId}/tracks/${trackId}/remove`)
  return data
}

/**
 * Restore a track to an assign event.
 * @param {string} assignEventId
 * @param {string} trackId
 */
export async function restoreTrackToAssign(assignEventId, trackId) {
  const { data } = await api.post(`/staff/assign/event-assigns/${assignEventId}/tracks/${trackId}/restore`)
  return data
}

// ============================ REGISTER TEAMS ============================

/**
 * Get register teams for an event.
 * @param {string} eventId
 * @param {Object} [params]
 */
export async function getEventRegisterTeams(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/register-teams`, { params })
  return data.data
}

export async function getEventRegisterTeamsWithScores(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/register-teams/with-scores`, { params })
  return data.data
}

/**
 * Get register team detail.
 * @param {string} registerTeamId
 */
export async function getRegisterTeamDetail(registerTeamId) {
  const { data } = await api.get(`/staff/register-teams/${registerTeamId}`)
  return data.data
}

/**
 * Approve a register team.
 * @param {string} registerTeamId
 */
export async function approveRegisterTeam(registerTeamId) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/approve`)
  return data
}

/**
 * Reject a register team.
 * @param {string} registerTeamId
 * @param {object} [payload]
 */
export async function rejectRegisterTeam(registerTeamId, payload = {}) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/reject`, payload)
  return data
}

/**
 * Ban a register team.
 * @param {string} registerTeamId
 * @param {object} payload
 */
export async function banRegisterTeam(registerTeamId, payload) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/ban`, payload)
  return data
}

/**
 * Unban a register team.
 * @param {string} registerTeamId
 */
export async function unbanRegisterTeam(registerTeamId) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/unban`)
  return data
}

/**
 * Update a register team.
 * @param {string} registerTeamId
 * @param {object} payload
 */
export async function updateRegisterTeam(registerTeamId, payload) {
  const { data } = await api.patch(`/staff/register-teams/${registerTeamId}`, payload)
  return data
}

/**
 * Assign track and topic to a register team.
 * @param {string} registerTeamId
 * @param {{ trackId: string, topicId?: string }} payload
 */
export async function assignTrackTopicToRegisterTeam(registerTeamId, payload) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/assign-track-topic`, payload)
  return data
}

/**
 * Remove track and topic from a register team.
 * @param {string} registerTeamId
 */
export async function removeTrackTopicFromRegisterTeam(registerTeamId) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/remove-track-topic`)
  return data
}

/**
 * Assign a register team to the next round.
 * @param {string} registerTeamId
 */
export async function assignRegisterTeamToNextRound(registerTeamId) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/assign-next-round`)
  return data
}

/**
 * Revert a register team to the previous round.
 * @param {string} registerTeamId
 */
export async function revertRegisterTeamToPreviousRound(registerTeamId) {
  const { data } = await api.post(`/staff/register-teams/${registerTeamId}/revert-previous-round`)
  return data
}

/**
 * Get submissions for a register team.
 * @param {string} registerTeamId
 * @param {Object} [params]
 */
export async function getRegisterTeamSubmissions(registerTeamId, params = {}) {
  const { data } = await api.get(`/staff/register-teams/${registerTeamId}/submissions`, { params })
  return data.data
}

// ============================ SUBMISSIONS ============================

/**
 * Get submissions for an event.
 * @param {string} eventId
 * @param {Object} [params]
 */
export async function getEventSubmissions(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/submissions`, { params })
  return data.data
}

/**
 * Get submission detail.
 * @param {string} submissionId
 */
export async function getSubmissionDetail(submissionId) {
  const { data } = await api.get(`/staff/submissions/${submissionId}`)
  return data.data
}

/**
 * Get grader scores for a submission.
 * @param {string} submissionId
 * @param {Object} [params]
 */
export async function getSubmissionGraderScores(submissionId, params = {}) {
  const { data } = await api.get(`/staff/submissions/${submissionId}/grader-scores`, { params })
  return data.data
}

/**
 * Get score detail.
 * @param {string} scoreId
 */
export async function getScoreDetail(scoreId) {
  const { data } = await api.get(`/staff/scores/${scoreId}`)
  return data.data
}

/**
 * Get score items for a score.
 * @param {string} scoreId
 * @param {Object} [params]
 */
export async function getScoreItems(scoreId, params = {}) {
  const { data } = await api.get(`/staff/scores/${scoreId}/items`, { params })
  return data.data
}

/**
 * Get score item detail.
 * @param {string} scoreItemId
 */
export async function getScoreItemDetail(scoreItemId) {
  const { data } = await api.get(`/staff/score-items/${scoreItemId}`)
  return data.data
}

// ============================ LEADERBOARD ============================

/**
 * Get round leaderboard.
 * @param {string} roundId
 * @param {Object} [params]
 */
export async function getRoundLeaderboard(roundId, params = {}) {
  const { data } = await api.get(`/staff/rounds/${roundId}/leaderboard`, { params })
  return data.data
}

/**
 * Get event leaderboard.
 * @param {string} eventId
 * @param {Object} [params]
 */
export async function getEventLeaderboard(eventId, params = {}) {
  const { data } = await api.get(`/staff/events/${eventId}/leaderboard`, { params })
  return data.data
}

/**
 * Get chapter leaderboard.
 * @param {number} year
 * @param {Object} [params]
 */
export async function getChapterLeaderboard(year, params = {}) {
  const { data } = await api.get(`/staff/events/chapter/${year}/leaderboard`, { params })
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Staff My Notifications (Personal + System)                        */
/* ------------------------------------------------------------------ */

/**
 * Get paginated staff "my notifications" (Personal + System).
 * GET /api/v1/staff/notifications/my
 * @param {Object} [params] - { keyword?, targetType?, status?, fromDate?, toDate?, pageIndex?, pageSize? }
 * @returns {Promise<{ notifications: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getStaffMyNotifications(params = {}) {
  const { data } = await api.get('/staff/notifications/my', { params })
  return data.data
}

/**
 * Get detail of a single staff notification.
 * GET /api/v1/staff/notifications/my/{notificationId}
 * @param {string} notificationId
 * @returns {Promise<object>}
 */
export async function getStaffMyNotificationDetail(notificationId) {
  const { data } = await api.get(`/staff/notifications/my/${notificationId}`)
  return data.data
}

/**
 * Get unread notification count for the current staff.
 * GET /api/v1/staff/notifications/my/unread-count
 * @returns {Promise<{ count: number }>}
 */
export async function getStaffMyNotificationUnreadCount() {
  const { data } = await api.get('/staff/notifications/my/unread-count')
  return data.data
}

/**
 * Mark a single staff notification as read.
 * POST /api/v1/staff/notifications/my/{notificationId}/read
 * @param {string} notificationId
 * @returns {Promise<object>}
 */
export async function markStaffMyNotificationRead(notificationId) {
  const { data } = await api.post(`/staff/notifications/my/${notificationId}/read`)
  return data.data
}

/**
 * Mark all staff notifications as read.
 * POST /api/v1/staff/notifications/my/read-all
 * @returns {Promise<object>}
 */
export async function markStaffAllMyNotificationsRead() {
  const { data } = await api.post('/staff/notifications/my/read-all')
  return data.data
}
