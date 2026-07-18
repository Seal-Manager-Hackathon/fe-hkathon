const RANK_SCORE_COLORS = {
  1: 'text-[#0EA5E9]',
  2: 'text-[#EAB308]',
  3: 'text-[#22C55E]',
}

export function getRankScoreColor(rank) {
  return RANK_SCORE_COLORS[rank] || 'text-[#064f5d]'
}
