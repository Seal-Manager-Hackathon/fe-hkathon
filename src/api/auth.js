import api from '../libs/api'

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ accessToken: string, refreshToken: string }>}
 */
export async function login({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return data.data
}

/**
 * Get the currently authenticated user from the stored token.
 * @returns {Promise<object>} user object
 */
export async function getCurrentUser() {
  const { data } = await api.get('/auth/me')
  return data.data
}
