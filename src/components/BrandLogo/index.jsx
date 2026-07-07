/**
 * @param {{ className?: string, white?: boolean }} props
 */
export default function BrandLogo({ className = '', white = false }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex h-10 items-center justify-center rounded-md px-3 text-base font-extrabold ${
          white ? 'bg-white text-[#064f5d]' : 'bg-[#064f5d] text-white'
        }`}
      >
        SEAL
      </div>
      <span className={`text-xl font-bold ${white ? 'text-white' : 'text-[#064f5d]'}`}>
        Hackathon
      </span>
    </div>
  )
}
