export default function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 shrink-0 cursor-pointer rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1] hover:text-[#064f5d]"
    >
      View
    </button>
  )
}
