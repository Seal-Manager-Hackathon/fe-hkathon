import { Link } from 'react-router-dom'
import FormActions from '../FormActions'

/**
 * Generic Create/Edit form page wrapper.
 * backUrl is always a fixed link — never browser history.
 */
export default function EntityFormPage({
  backUrl,
  backLabel,
  title,
  description,
  saveLabel,
  canSave,
  onSave,
  saving,
  saveIcon,
  savingLabel,
  children,
}) {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <Link
          to={backUrl}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; {backLabel}
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">{title}</h1>
        <p className="mt-1 text-[15px] text-gray-500">{description}</p>
      </div>

      {children}

      <FormActions
        onSave={onSave}
        saving={saving}
        canSave={canSave}
        saveLabel={saveLabel}
        savingLabel={savingLabel}
        saveIcon={saveIcon}
      />
    </div>
  )
}
