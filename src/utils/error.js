/**
 * Returns the error message from an API error response.
 * Falls back to a generic English message if no response is available.
 * @param {unknown} error - error from axios (or plain Error)
 * @returns {string}
 */
export function getErrorMessage(error) {
  return error?.response?.data?.message || 'An error occurred, please try again'
}
