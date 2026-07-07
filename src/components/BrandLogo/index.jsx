export default function BrandLogo({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`}>
      <div className="flex h-10 items-center justify-center rounded-md bg-[#064f5d] px-3 text-base font-extrabold text-white">
        SEAL
      </div>
      <span className="text-xl font-bold text-[#064f5d]">Hackathon</span>
    </div>
  )
}
