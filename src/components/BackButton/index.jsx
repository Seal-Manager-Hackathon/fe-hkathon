import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * Back button that navigates to the previous page.
 * Falls back to `fallback` if there's no history.
 */
export default function BackButton({ fallback, label, className = '' }) {
  const navigate = useNavigate()

  function handleClick() {
    // react-router v7: window.history.length > 1 means we can go back
    if (window.history.length > 2) {
      navigate(-1)
    } else if (fallback) {
      navigate(fallback)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label || 'Back'}
    </button>
  )
}