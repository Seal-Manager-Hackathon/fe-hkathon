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
 * Register a new account.
 * @param {{ email: string, password: string, firstName: string, lastName: string }} payload
 * @returns {Promise<{ message: string }>}
 */
export async function register({ email, password, firstName, lastName }) {
  const { data } = await api.post('/auth/register', { email, password, firstName, lastName })
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
