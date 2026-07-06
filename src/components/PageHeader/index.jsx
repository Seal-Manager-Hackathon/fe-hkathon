import { Link } from 'react-router-dom'

/**
 * Reusable page header with optional back button, title, description, and an optional action (e.g., create/edit button).
 *
 * @param {string} backTo       - where BackButton links to
 * @param {string} backLabel    - label for back button
 * @param {string} title        - page title
 * @param {string} description  - subtitle / description
 * @param {object} [actions]    - optional action buttons
 * @param {string} actions.to   - link for primary action (renders as Link)
 * @param {string} actions.label- link text
 * @param {object} actions.icon - lucide icon component
 */
export default function PageHeader({ backTo, backLabel, title, description, actions }) {
  const BackButton = backTo ? (
    <div className="mb-4">
      <Link
        to={backTo}
        className="inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-medium text-gray-400 transition-colors hover:text-[#064f5d]"
      >
        ← {backLabel}
      </Link>
    </div>
  ) : null

  return (
    <div className="mb-6">
      {BackButton}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#1f2f3a]">{title}</h1>
          {description && <p className="mt-1 text-[15px] text-gray-500">{description}</p>}
        </div>
        {actions && actions.to && (
          <Link
            to={actions.to}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
          >
            {actions.icon && <actions.icon className="h-4 w-4" />}
            {actions.label}
          </Link>
        )}
        {actions && actions.onClick && (
          <button
            onClick={actions.onClick}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]"
          >
            {actions.icon && <actions.icon className="h-4 w-4" />}
            {actions.label}
          </button>
        )}
      </div>
    </div>
  )
}