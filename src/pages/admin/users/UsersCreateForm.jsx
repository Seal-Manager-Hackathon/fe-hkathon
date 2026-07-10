import FormField from '../../../components/FormField'
import SelectInput from '../../../components/SelectInput'
import FormActions from '../../../components/FormActions'
import { UserPlus } from 'lucide-react'
import { ROLE_OPTIONS_SELECT_NO_ADMIN } from '../../../constants/adminOptions'

/**
 * User creation form component.
 * Receives all data and handlers via props — no API import.
 *
 * @param {{
 *   form: { firstName: string, lastName: string, email: string, role: string },
 *   fieldErrors: Record<string, string>,
 *   saveError: string,
 *   saving: boolean,
 *   canSave: boolean,
 *   onFieldChange: (field: string, value: string) => void,
 *   onSave: () => void,
 * }} props
 */
export default function UsersCreateForm({ form, fieldErrors, saveError, saving, canSave, onFieldChange, onSave }) {
  return (
    <div className="space-y-5">
      {saveError && (
        <div className="rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="First Name" required error={fieldErrors.firstName}>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            placeholder="e.g. John"
            className={`field-input ${fieldErrors.firstName ? 'input-error' : ''}`}
          />
        </FormField>
        <FormField label="Last Name" required error={fieldErrors.lastName}>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            placeholder="e.g. Doe"
            className={`field-input ${fieldErrors.lastName ? 'input-error' : ''}`}
          />
        </FormField>
      </div>

      <FormField label="Email" required error={fieldErrors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(e) => onFieldChange('email', e.target.value)}
          placeholder="e.g. admin@fpt.edu.vn"
          className={`field-input ${fieldErrors.email ? 'input-error' : ''}`}
        />
      </FormField>

      <FormField label="Role" required error={fieldErrors.role}>
        <SelectInput
          options={ROLE_OPTIONS_SELECT_NO_ADMIN}
          value={form.role}
          onChange={(v) => onFieldChange('role', v)}
        />
      </FormField>

      <FormActions
        onSave={onSave}
        saving={saving}
        canSave={canSave}
        saveLabel="Create User"
        saveIcon={UserPlus}
      />
    </div>
  )
}
