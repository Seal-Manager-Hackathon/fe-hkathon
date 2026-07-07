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
  const { data } = await api.put(`/admin/users/${userId}`, formData, {
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


