import { cn } from '../../utils/cn';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'closed', label: 'Closed' },
];

export default function FilterTabs({ activeFilter, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChange(f.key)}
          className={cn(
            'rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 cursor-pointer',
            activeFilter === f.key
              ? 'bg-[#064f5d] text-white shadow-[0_2px_8px_rgba(6,79,93,0.25)]'
              : 'bg-white text-[#5a6a73] border border-[#d8e0e6] hover:border-[#064f5d] hover:text-[#064f5d]'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
