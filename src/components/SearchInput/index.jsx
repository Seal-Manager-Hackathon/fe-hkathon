export default function SearchInput({
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        className={`w-full rounded-lg border border-[#d8e0e6] py-2.5 pl-10 pr-4 text-[14px] text-[#1f2f3a] placeholder-gray-400 outline-none transition-colors focus:border-[#064f5d] ${inputClassName}`}
        {...props}
      />
    </div>
  )
}