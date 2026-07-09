import { Search } from 'lucide-react';

export default function SearchBox({ value, onChange }) {
  return (
    <div className="relative w-full max-w-[360px]">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search hackathons..."
        className="w-full rounded-xl border border-[#d8e0e6] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1f2f3a] placeholder:text-[#9ca3af] outline-none transition-colors duration-150 focus:border-[#064f5d] focus:ring-2 focus:ring-[#064f5d]/10"
      />
    </div>
  );
}
