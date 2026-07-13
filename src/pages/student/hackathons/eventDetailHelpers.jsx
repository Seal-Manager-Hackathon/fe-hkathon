import { formatDateTime } from '../../../utils/format';

const LB_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
  '#F0B27A',
  '#82E0AA',
  '#F1948A',
  '#85929E',
  '#73C6B6',
  '#E59866',
  '#A3E4D7',
  '#F9E79F',
  '#AED6F1',
  '#D7BDE2',
];

/**
 * Split name by whitespace, take first 2 words' first letters, uppercase them.
 * Returns '?' if no name is provided.
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

/**
 * Determine the relative status of an event based on its time range.
 * @param {string} startTime - ISO string for event start
 * @param {string} endTime - ISO string for event end
 * @returns {{ label: string, color: string, dot: string }}
 */
export function getRelativeStatus(startTime, endTime) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) {
    return { label: 'Upcoming', color: '#3498DB', dot: '🟦' };
  }
  if (now >= start && now <= end) {
    return { label: 'In Progress', color: '#2ECC71', dot: '🟢' };
  }
  return { label: 'Ended', color: '#95A5A6', dot: '⬜' };
}

/**
 * Extract a display value from an event object based on the card field key.
 * @param {Record<string, any>} event
 * @param {string} key
 * @returns {string}
 */
export function getCardValue(event, key) {
  switch (key) {
    case 'startTime':
    case 'endTime':
    case 'registerLimitTime':
      return formatDateTime(event[key]);
    case 'limitTeam':
    case 'numberRound':
      return event[key] ?? '—';
    case 'teamSize':
      return `${event.minMember ?? '?'}–${event.maxMember ?? '?'}`;
    default:
      return event[key] ?? '—';
  }
}

/**
 * Alias for getInitials used in leaderboard context.
 * @param {string} name
 * @returns {string}
 */
export function getLbInitials(name) {
  return getInitials(name);
}

/**
 * Pick a deterministic color from LB_COLORS based on a hash of the id.
 * @param {string|number} id
 * @returns {string}
 */
export function getLbColor(id) {
  if (id == null) return LB_COLORS[0];
  const hash = String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return LB_COLORS[hash % LB_COLORS.length];
}
