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
