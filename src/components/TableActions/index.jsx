import { Link } from 'react-router-dom'
import { Eye, Edit } from 'lucide-react'

/**
 * Reusable View + Edit action buttons for table rows.
 * @param {string} viewTo  - link to detail page
 * @param {string} editTo  - link to edit page
 * @param {function} viewOnClick  - optional handler instead of Link
 * @param {string} editLabel - default "Edit"
 */
export default function TableActions({ viewTo, editTo, viewOnClick, editLabel = 'Edit' }) {
  const btnClass =
    'inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f4f6f8] px-3 py-1.5 text-[13px] font-semibold text-[#064f5d] transition-colors hover:bg-[#e0f2f1]'

  return (
    <div className="flex items-center justify-end gap-2">
      {viewOnClick ? (
        <button onClick={viewOnClick} className={btnClass}>
          <Eye className="h-3.5 w-3.5" /> View
        </button>
      ) : viewTo ? (
        <Link to={viewTo} className={btnClass}>
          <Eye className="h-3.5 w-3.5" /> View
        </Link>
      ) : null}
      {editTo && (
        <Link to={editTo} className={btnClass}>
          <Edit className="h-3.5 w-3.5" /> {editLabel}
        </Link>
      )}
    </div>
  )
}