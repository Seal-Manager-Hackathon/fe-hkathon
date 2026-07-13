/**
 * Format an ISO string to a human-readable date (e.g. "Jul 7, 2026").
 * Displays in Vietnam time (ICT, UTC+7).
 * Returns fallback text when input is falsy.
 * @param {string} iso
 * @param {string} [fallback='—']
 * @returns {string}
 */
export function formatDate(iso, fallback = '—') {
  if (!iso) return fallback
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' })
  } catch {
    return iso
  }
}

/**
 * Format an ISO string to date + time (e.g. "Jul 7, 2026, 14:30:00").
 * Displays in Vietnam time (ICT, UTC+7).
 * @param {string} iso
 * @param {string} [fallback='—']
 * @returns {string}
 */
export function formatDateTime(iso, fallback = '—') {
  if (!iso) return fallback
  try {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return iso
  }
}

/**
 * Convert a datetime-local input value (YYYY-MM-DDTHH:MM, user local time)
 * to a UTC ISO string for sending to the API.
 * @param {string} localDatetime - value from <input type="datetime-local">
 * @returns {string} UTC ISO string with Z suffix
 */
export function toUTCISO(localDatetime) {
  if (!localDatetime) return ''
  try {
    return new Date(localDatetime).toISOString()
  } catch {
    return localDatetime
  }
}

/**
 * Convert a UTC ISO string to a local datetime value (YYYY-MM-DDTHH:MM)
 * suitable for <input type="datetime-local">, displayed in Vietnam time (ICT, UTC+7).
 * @param {string} utcIso - UTC ISO string from the API
 * @returns {string} YYYY-MM-DDTHH:MM in Vietnam timezone
 */
export function toLocalDatetimeInput(utcIso) {
  if (!utcIso) return ''
  try {
    const d = new Date(utcIso)
    // Get date parts in Vietnam timezone
    const dateStr = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' }) // YYYY-MM-DD
    const timeStr = d.toLocaleTimeString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    return `${dateStr}T${timeStr}`
  } catch {
    return utcIso
  }
}
