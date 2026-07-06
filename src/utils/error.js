/**
 * Returns the error message from an API error response.
 * Falls back to a generic English message if no response is available.
 * @param {unknown} error - error from axios (or plain Error)
 * @returns {{ message: string, errors: Record<string, string> }}
 */
export function parseError(error) {
  const message = error?.response?.data?.message || 'An error occurred, please try again'
  const errors = error?.response?.data?.errors || {}
  return { message, errors }
}

/**
 * Returns just the top-level message string from an API error.
 */
export function getErrorMessage(error) {
  return error?.response?.data?.message || 'An error occurred, please try again'
}
