import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function SeasonSwitcher({ years, selectedYear, currentYear, onChange }) {
  const idx = years.indexOf(selectedYear);

  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-semibold text-[#5a6a73] uppercase tracking-wider">
        Season
      </span>
      <div className="flex items-center rounded-xl border border-[#d8e0e6] bg-white px-1 py-1 shadow-sm">
        <button
          type="button"
          onClick={() => onChange(selectedYear - 1)}
          disabled={idx <= 0}
          className={cn(
            'rounded-lg p-1.5 transition-colors',
            idx <= 0
              ? 'text-[#b0bec5] cursor-not-allowed'
              : 'text-[#5a6a73] hover:bg-[#e8edf1] hover:text-[#1f2f3a] cursor-pointer'
          )}
        >
          <ChevronLeft size={18} />
        </button>

        <span className="min-w-[60px] text-center text-[17px] font-bold text-[#1f2f3a] select-none">
          {selectedYear}
        </span>

        <button
          type="button"
          onClick={() => onChange(selectedYear + 1)}
          disabled={idx >= years.length - 1}
          className={cn(
            'rounded-lg p-1.5 transition-colors',
            idx >= years.length - 1
              ? 'text-[#b0bec5] cursor-not-allowed'
              : 'text-[#5a6a73] hover:bg-[#e8edf1] hover:text-[#1f2f3a] cursor-pointer'
          )}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
