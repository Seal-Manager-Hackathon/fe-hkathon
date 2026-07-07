import BackButton from '../BackButton'
import FormActions from '../FormActions'

/**
 * Generic Create/Edit form page wrapper.
 *
 * Props:
 * - backUrl      – fallback URL for the back button
 * - backLabel    – label for the back button
 * - title        – page heading
 * - description  – subtitle text below the heading
 * - saveLabel    – label for the primary save button
 * - canSave      – whether the form is valid for submission
 * - onSave       – save handler
 * - saving       – loading state for the save button
 * - saveIcon     – optional icon component (default Save from lucide)
 * - savingLabel  – text shown while saving (default "Saving...")
 * - children     – form fields rendered between header and actions
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
      <BackButton fallback={backUrl} label={backLabel} />

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
