import { Link } from 'react-router-dom'

/**
 * Consistent "not found" placeholder used by all detail/edit pages
 * when the requested resource does not exist.
 */
export default function NotFoundState({ entity, fallbackTo }) {
  const label = entity || 'item'
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <p className="text-[18px] font-semibold text-gray-500">
        {label.charAt(0).toUpperCase() + label.slice(1)} not found.
      </p>
      <Link to={fallbackTo} className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
        &larr; Back to {label}s
      </Link>
    </div>
  )
}