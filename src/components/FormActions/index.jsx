import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'

/**
 * Reusable form footer with primary save action + cancel button.
 * `onSave`  – handler for the save button.
 * `saving`  – when true, the button shows a loading state and is disabled.
 * `canSave` – whether save criteria are met; disables the button when false.
 * `saveLabel`  – what the primary button says (default "Save Changes").
 * `savingLabel` – shown while `saving` is true (default "Saving...").
 * `saveIcon`    – icon for the primary button (default Save from lucide).
 */
export default function FormActions({
  onSave,
  saving = false,
  canSave = true,
  saveLabel = 'Save Changes',
  savingLabel = 'Saving...',
  saveIcon: SaveIcon = Save,
  cancelLabel = 'Cancel',
}) {
  const navigate = useNavigate()

  return (
    <div className="mt-8 flex items-center gap-4 border-t border-[#e8ecf0] pt-6">
      <button
        onClick={onSave}
        disabled={!canSave || saving}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SaveIcon className="h-4 w-4" />
        {saving ? savingLabel : saveLabel}
      </button>
      <button
        onClick={() => navigate(-1)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
      >
        {cancelLabel}
      </button>
    </div>
  )
}