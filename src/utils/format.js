/**
 * Lightweight date formatting utilities.
 */

/**
 * Format an ISO string to a human-readable date (e.g. "Jul 7, 2026").
 * Returns fallback text when input is falsy.
 * @param {string} iso
 * @param {string} [fallback='—']
 * @returns {string}
 */
export function formatDate(iso, fallback = '—') {
  if (!iso) return fallback
  try {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}
