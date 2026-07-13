import api from '../libs/api'

/**
 * Update the currently authenticated user's profile.
 * Supports multipart/form-data — pass a FormData object when including a file upload.
 *
 * @param {FormData|object} payload
 *   FormData fields: firstName, lastName, phoneNumber, bio, address, dateOfBirth, studentId, linkUrl, avatarUrl, avatarFile
 *   Plain-object fields: same keys (except avatarFile)
 * @returns {Promise<{ message: string }>}
 */
export async function updateProfile(payload) {
  const isFormData = payload instanceof FormData
  const { data } = await api.patch('/user/me', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  })
  return data
}
