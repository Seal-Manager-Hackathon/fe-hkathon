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
 * Verify email with token from email link.
 * @param {{ token: string }} payload
 * @returns {Promise<{ accessToken?: string, refreshToken?: string }>}
 */
export async function verifyEmail({ token }) {
  const { data } = await api.post('/auth/verify-email', { token })
  return data.data
}

/**
 * Send forgot-password email.
 * Always returns success (200) even if email doesn't exist — prevents email enumeration.
 * @param {{ email: string }} payload
 * @returns {Promise<null>}
 */
export async function forgotPassword({ email }) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data.data
}

/**
 * Reset password using token from email.
 * @param {{ token: string, newPassword: string }} payload
 * @returns {Promise<null>}
 */
export async function resetPassword({ token, newPassword }) {
  const { data } = await api.post('/auth/reset-password', { token, newPassword })
  return data.data
}

/**
 * Get the currently authenticated user from the stored token.
 * @returns {Promise<object>} user object
 */
export async function getCurrentUser() {
  const { data } = await api.get('/user/me')
  return data.data
}
