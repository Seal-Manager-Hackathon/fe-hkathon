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
