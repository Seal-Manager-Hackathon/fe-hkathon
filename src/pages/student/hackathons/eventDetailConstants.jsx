import { Calendar, Clock, Users, UserPlus, Layers, MapPin, Award, FileText, UsersRound } from 'lucide-react';

export const STATUS_STYLES = {
  Draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60' },
  Published: { label: 'Published', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' },
  Closed: { label: 'Closed', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200/60' },
};

export const TABS = [
  { key: 'description', label: 'Description', icon: FileText },
  { key: 'rounds', label: 'Rounds', icon: Layers },
  { key: 'awards', label: 'Awards', icon: Award },
  { key: 'assignments', label: 'Assignments', icon: UsersRound },
  { key: 'leaderboard', label: 'Leaderboard', icon: MapPin },
];

export const LEVEL_LABELS = {
  1: { label: '1st Prize', color: 'bg-yellow-100 text-yellow-800 ring-1 ring-yellow-300/60', icon: 'from-[#f59e0b] to-[#f97316]' },
  2: { label: '2nd Prize', color: 'bg-slate-100 text-slate-700 ring-1 ring-slate-300/60', icon: 'from-[#94a3b8] to-[#64748b]' },
  3: { label: '3rd Prize', color: 'bg-orange-100 text-orange-800 ring-1 ring-orange-300/60', icon: 'from-[#d97706] to-[#b45309]' },
};

export function getLevelLabel(level) {
  return LEVEL_LABELS[level] || { label: `Prize ${level}`, color: 'bg-gray-100 text-gray-700 ring-1 ring-gray-300/60', icon: 'from-gray-400 to-gray-500' };
}

export const ITEM_META = {
  startTime: { label: 'Start', icon: Calendar },
  endTime: { label: 'End', icon: Calendar },
  registerLimitTime: { label: 'Reg. Deadline', icon: Clock },
  limitTeam: { label: 'Max Teams', icon: Users },
  teamSize: { label: 'Team Size', icon: UserPlus },
  numberRound: { label: 'Rounds', icon: Layers },
};

export const GROUP_INFO = [
  { key: 'timeline', items: ['startTime', 'registerLimitTime', 'endTime'] },
  { key: 'constraints', items: ['limitTeam', 'teamSize'] },
];

export const LB_COLORS = [
  'bg-blue-600',
  'bg-emerald-600',
  'bg-violet-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-cyan-600',
  'bg-indigo-600',
  'bg-teal-600',
];
