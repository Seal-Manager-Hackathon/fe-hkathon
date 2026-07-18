const RANK_SCORE_COLORS = {
  1: 'text-[#dc2626]',
  2: 'text-[#ea580c]',
  3: 'text-[#ca8a04]',
}

export function getRankScoreColor(rank) {
  return RANK_SCORE_COLORS[rank] || 'text-[#064f5d]'
}
