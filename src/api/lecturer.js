import api from '../libs/api'

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
