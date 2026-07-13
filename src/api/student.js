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
 */
export async function getStudentPopularEvents(params = {}) {
  const merged = { ...params }
  if (!merged.PageSize) merged.PageSize = 4
  return getStudentEvents(merged)
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

/* ------------------------------------------------------------------ */
/*  Student Received Invitations                                       */
/* ------------------------------------------------------------------ */

export async function getStudentReceivedInvitations(params = {}) {
  const { data } = await api.get('/student/invitations', { params })
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
