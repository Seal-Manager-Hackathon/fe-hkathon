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
 * Get student-facing event detail by ID.
 * @param {string} eventId
 * @returns {Promise<object>} full event object
 */
export async function getStudentEventDetail(eventId) {
  const { data } = await api.get(`/student/events/${eventId}`)
  return data.data
}

/**
 * Get student rounds for an event (paginated, only non-disabled).
 * @param {string} eventId
 * @param {Object} params
 * @param {string} [params.Keyword]
 * @param {number} [params.RoundNo]
 * @param {number} [params.PageIndex]
 * @param {number} [params.PageSize]
 * @returns {Promise<{ rounds: Array, totalCount: number, pageIndex: number, pageSize: number }>}
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
