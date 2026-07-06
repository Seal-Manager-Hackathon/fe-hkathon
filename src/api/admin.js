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