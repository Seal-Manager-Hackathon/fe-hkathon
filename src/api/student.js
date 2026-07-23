import api from '../libs/api'

/**
 * Get paginated student-facing events.
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {'Published'|'Closed'} [params.Status]
 * @param {string} [params.FromDate]
 * @param {string} [params.ToDate]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ events: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getStudentEvents(params = {}) {
  const { data } = await api.get('/student/events', { params })
  return data.data
}

/**
 * Get recommended / "for you" events for the home page.
 */
export async function getStudentForYouEvents(params = {}) {
  const merged = { ...params }
  if (!merged.PageSize) merged.PageSize = 6
  return getStudentEvents(merged)
}

/**
 * Get popular / featured events for the home page.
 * GET /api/v1/student/events/popular
 * @param {Object} params - { PageIndex?, PageSize? }
 * @returns {Promise<{ events: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getStudentPopularEvents(params = {}) {
  const merged = { PageIndex: 1, PageSize: 4, ...params }
  const { data } = await api.get('/student/events/popular', { params: merged })
  return data.data
}

/**
 * Get student-facing event detail by ID.
 * @param {string} eventId
 * @returns {Promise<object>}
 */
export async function getStudentEventDetail(eventId) {
  const { data } = await api.get(`/student/events/${eventId}`)
  return data.data
}

/**
 * Get student rounds for an event (paginated, only non-disabled).
 * @param {string} eventId
 * @param {Object} params
 * @returns {Promise<{ rounds: Array, totalCount: number }>}
 */
export async function getStudentRounds(eventId, params = {}) {
  const { data } = await api.get(`/student/events/${eventId}/rounds`, { params })
  return data.data
}

/**
 * Get student round detail by round ID.
 * @param {string} roundId
 * @returns {Promise<object>}
 */
export async function getStudentRoundDetail(roundId) {
  const { data } = await api.get(`/student/rounds/${roundId}`)
  return data.data
}

/**
 * Get criteria templates for a round (only active, non-disabled).
 * @param {string} roundId
 * @param {Object} [params]
 * @returns {Promise<{ templates: Array, totalCount: number }>}
 */
export async function getStudentRoundCriteriaTemplates(roundId, params = {}) {
  const { data } = await api.get(`/student/rounds/${roundId}/criteria-templates`, { params })
  return data.data
}

/**
 * Get criteria template detail with its items.
 * @param {string} templateId
 * @returns {Promise<object>}
 */
export async function getStudentCriteriaTemplateDetail(templateId) {
  const { data } = await api.get(`/student/criteria-templates/${templateId}`)
  return data.data
}

/**
 * Get student awards for an event (paginated, only non-disabled).
 * @param {string} eventId
 * @param {Object} [params]
 * @returns {Promise<{ awards: Array, totalCount: number }>}
 */
export async function getStudentAwards(eventId, params = {}) {
  const { data } = await api.get(`/student/events/${eventId}/awards`, { params })
  return data.data
}

/**
 * Get award detail by ID.
 * @param {string} awardId
 * @returns {Promise<object>}
 */
export async function getStudentAwardDetail(awardId) {
  const { data } = await api.get(`/student/awards/${awardId}`)
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Student Teams                                                      */
/* ------------------------------------------------------------------ */

/**
 * Get my teams (paginated, only active, non-disabled).
 * @param {Object} params - { keyword?, pageIndex?, pageSize? }
 * @returns {Promise<{ teams: Array, totalCount: number }>}
 */
export async function getStudentMyTeams(params = {}) {
  const { data } = await api.get('/student/teams/my-teams', { params })
  return data.data
}

/**
 * Get team detail by ID.
 * @param {string} teamId
 * @returns {Promise<object>}
 */
export async function getStudentTeamDetail(teamId) {
  const { data } = await api.get(`/student/teams/${teamId}`)
  return data.data
}

/**
 * Get events that a team has been approved to participate in.
 * @param {string} teamId
 * @param {Object} [params] - { pageIndex?, pageSize? }
 * @returns {Promise<{ items: Array, totalCount: number }>}
 */
export async function getStudentTeamEvents(teamId, params = {}) {
  const { data } = await api.get(`/student/teams/${teamId}/events`, { params })
  return data.data
}

/**
 * Get team members (active only, paginated).
 * @param {string} teamId
 * @param {Object} [params]
 * @returns {Promise<{ members: Array, totalCount: number, totalDisable: number }>}
 */
export async function getStudentTeamMembers(teamId, params = {}) {
  const { data } = await api.get(`/student/teams/${teamId}/members`, { params })
  return data.data
}

/**
 * Create a new team.
 * @param {string} name
 * @returns {Promise<object>}
 */
export async function createStudentTeam(name) {
  const { data } = await api.post('/student/teams', { name })
  return data.data
}

/**
 * Update team name (leader only).
 * @param {string} teamId
 * @param {{ name?: string }} body
 * @returns {Promise<object>}
 */
export async function updateStudentTeam(teamId, body) {
  const { data } = await api.patch(`/student/teams/${teamId}`, body)
  return data.data
}

/**
 * Disband team (leader only).
 * @param {string} teamId
 * @returns {Promise<object>}
 */
export async function disbandStudentTeam(teamId) {
  const { data } = await api.post(`/student/teams/${teamId}/disband`)
  return data.data
}

/**
 * Leave team (member only).
 * @param {string} teamId
 * @returns {Promise<object>}
 */
export async function leaveStudentTeam(teamId) {
  const { data } = await api.post(`/student/teams/${teamId}/leave`)
  return data.data
}

/**
 * Kick a member from team (leader only).
 * @param {string} teamId
 * @param {string} memberId
 * @returns {Promise<object>}
 */
export async function kickStudentTeamMember(teamId, memberId) {
  const { data } = await api.post(`/student/teams/${teamId}/members/${memberId}/kick`)
  return data.data
}

/**
 * Change team leader.
 * @param {string} teamId
 * @param {string} newLeaderUserId
 * @returns {Promise<object>}
 */
export async function changeStudentTeamLeader(teamId, newLeaderUserId) {
  const { data } = await api.post(`/student/teams/${teamId}/change-leader`, { newLeaderUserId })
  return data.data
}

/**
 * Send invitation to a user by email (leader only).
 * @param {string} teamId
 * @param {string} email
 * @returns {Promise<object>}
 */
export async function sendStudentTeamInvitation(teamId, email) {
  const { data } = await api.post(`/student/teams/${teamId}/invitations`, { email })
  return data.data
}

/**
 * List invitations sent by the team (leader only).
 * @param {string} teamId
 * @param {Object} [params]
 * @returns {Promise<{ items: Array, totalCount: number }>}
 */
export async function getStudentTeamInvitations(teamId, params = {}) {
  const { data } = await api.get(`/student/teams/${teamId}/invitations`, { params })
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Student Register Teams                                             */
/* ------------------------------------------------------------------ */

export async function getStudentTeamAllRegisterTeams(teamId, params = {}) {
  const { data } = await api.get(`/student/teams/${teamId}/register-teams/all`, { params })
  return data.data
}

export async function getStudentApprovedRegisterTeams(teamId, params = {}) {
  const { data } = await api.get(`/student/teams/${teamId}/register-teams`, { params })
  return data.data
}

export async function getStudentRegisterTeamDetail(registerTeamId) {
  const { data } = await api.get(`/student/register-teams/${registerTeamId}`)
  return data.data
}

export async function getStudentTrackDetail(trackId) {
  const { data } = await api.get(`/student/tracks/${trackId}`)
  return data.data
}

export async function getStudentTopicDetail(topicId) {
  const { data } = await api.get(`/student/topics/${topicId}`)
  return data.data
}

/**
 * Register a team to an event (team leader only).
 * POST /api/v1/student/register-teams
 * @param {{ teamId: string, eventId: string, trackId?: string, topicId?: string, description?: string }} payload
 * @returns {Promise<{ id: string, teamId: string, eventId: string, status: string, createdAt: string }>}
 */
export async function createStudentRegisterTeam(payload) {
  const { data } = await api.post('/student/register-teams', payload)
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Student Received Invitations                                       */
/* ------------------------------------------------------------------ */

export async function getStudentReceivedInvitations(params = {}) {
  const { data } = await api.get('/student/invitations', { params })
  return data.data
}

/**
 * Get invitation detail.
 * GET /api/v1/student/invitations/{invitationId}
 * @param {string} invitationId
 * @returns {Promise<object>}
 */
export async function getStudentInvitationDetail(invitationId) {
  const { data } = await api.get(`/student/invitations/${invitationId}`)
  return data.data
}

export async function acceptStudentInvitation(invitationId) {
  const { data } = await api.post(`/student/invitations/${invitationId}/accept`)
  return data.data
}

export async function rejectStudentInvitation(invitationId) {
  const { data } = await api.post(`/student/invitations/${invitationId}/reject`)
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Leaderboard                                                        */
/* ------------------------------------------------------------------ */

export async function getStudentLeaderboard(year, params = {}) {
  const { data } = await api.get(`/student/events/chapter/${year}/leaderboard`, { params })
  return data.data || {}
}

export async function getStudentEventLeaderboard(eventId, params = {}) {
  const { data } = await api.get(`/student/events/${eventId}/leaderboard`, { params })
  return data.data || {}
}

/* ------------------------------------------------------------------ */
/*  Assignments                                                        */
/* ------------------------------------------------------------------ */

export async function getStudentEventAssignments(eventId, params = {}) {
  const { data } = await api.get(`/student/assign/events/${eventId}/assigned`, { params })
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Submissions                                                        */
/* ------------------------------------------------------------------ */

/**
 * Submit work for a round (team leader only).
 * @param {{ registerTeamId: string, roundId: string, url: string, description?: string }} body
 * @returns {Promise<object>}
 */
export async function submitStudentSubmission(body) {
  const { data } = await api.post('/student/submissions', body)
  return data.data
}

/**
 * Get last submissions for each round of a register team.
 * @param {string} registerTeamId
 * @param {Object} [params] - { roundId? }
 * @returns {Promise<{ items: Array, totalCount: number }>}
 */
export async function getStudentTeamSubmissions(registerTeamId, params = {}) {
  const { data } = await api.get(`/student/register-teams/${registerTeamId}/submissions`, { params })
  return data.data
}

/**
 * Get submission detail by ID.
 * @param {string} submissionId
 * @returns {Promise<object>}
 */
export async function getStudentSubmissionDetail(submissionId) {
  const { data } = await api.get(`/student/submissions/${submissionId}`)
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Student Notifications                                             */
/* ------------------------------------------------------------------ */

/**
 * Get paginated student notifications (Personal, Team, System).
 * GET /api/v1/student/notifications
 * @param {Object} [params] - { keyword?, targetType?, status?, fromDate?, toDate?, pageIndex?, pageSize? }
 * @returns {Promise<{ notifications: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getStudentNotifications(params = {}) {
  const { data } = await api.get('/student/notifications', { params })
  return data.data
}

/**
 * Get detail of a single student notification.
 * GET /api/v1/student/notifications/{notificationId}
 * @param {string} notificationId
 * @returns {Promise<object>}
 */
export async function getStudentNotificationDetail(notificationId) {
  const { data } = await api.get(`/student/notifications/${notificationId}`)
  return data.data
}

/**
 * Get unread notification count for the current student.
 * GET /api/v1/student/notifications/unread-count
 * @returns {Promise<{ count: number }>}
 */
export async function getStudentNotificationUnreadCount() {
  const { data } = await api.get('/student/notifications/unread-count')
  return data.data
}

/**
 * Mark a single notification as read.
 * POST /api/v1/student/notifications/{notificationId}/read
 * @param {string} notificationId
 * @returns {Promise<object>}
 */
export async function markStudentNotificationRead(notificationId) {
  const { data } = await api.post(`/student/notifications/${notificationId}/read`)
  return data.data
}

/**
 * Mark all student notifications as read.
 * POST /api/v1/student/notifications/read-all
 * @returns {Promise<object>}
 */
export async function markStudentAllNotificationsRead() {
  const { data } = await api.post('/student/notifications/read-all')
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Mentor Notifications                                               */
/* ------------------------------------------------------------------ */

/**
 * Get paginated mentor notifications for a register team's track.
 * GET /api/v1/student/register-teams/{registerTeamId}/mentor-notifications
 * @param {string} registerTeamId
 * @param {Object} [params] - { pageIndex?, pageSize? }
 * @returns {Promise<{ notifications: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getStudentMentorNotifications(registerTeamId, params = {}) {
  const { data } = await api.get(`/student/register-teams/${registerTeamId}/mentor-notifications`, { params })
  return data.data
}

/**
 * Get detail of a single mentor notification.
 * GET /api/v1/student/mentor-notifications/{mentorNotificationId}
 * @param {string} mentorNotificationId
 * @returns {Promise<object>}
 */
export async function getStudentMentorNotificationDetail(mentorNotificationId) {
  const { data } = await api.get(`/student/mentor-notifications/${mentorNotificationId}`)
  return data.data
}

/* ------------------------------------------------------------------ */
/*  Student Reports                                                     */
/* ------------------------------------------------------------------ */

/**
 * Get paginated student reports.
 * GET /api/v1/student/reports
 * @param {Object} [params] - { keyword?, status?, fromDate?, toDate?, pageIndex?, pageSize? }
 * @returns {Promise<{ items: Array, totalCount: number, pageIndex: number, pageSize: number }>}
 */
export async function getStudentReports(params = {}) {
  const { data } = await api.get('/student/reports', { params })
  return data.data
}

/**
 * Get student report detail by ID.
 * GET /api/v1/student/reports/{reportId}
 * @param {string} reportId
 * @returns {Promise<{ id: string, userId: string, title: string, description: string, status: string, reason: string|null, typeReport: string, createdAt: string, updatedAt: string }>}
 */
export async function getStudentReportDetail(reportId) {
  const { data } = await api.get(`/student/reports/${reportId}`)
  return data.data
}

/**
 * Create a new report.
 * POST /api/v1/student/reports
 * @param {{ title: string, description?: string, typeReport?: string }} body
 * @returns {Promise<{ id: string, title: string, status: string, createdAt: string }>}
 */
export async function createStudentReport(body) {
  const { data } = await api.post('/student/reports', body)
  return data.data
}
