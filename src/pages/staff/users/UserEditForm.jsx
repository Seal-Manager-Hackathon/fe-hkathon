import { User, Phone, FileText, GraduationCap, Calendar, MapPin, IdCard } from 'lucide-react'
import FormField from '../../../components/FormField'

const FIELDS = [
  [
    { key: 'firstName', label: 'First Name', icon: User, type: 'text', placeholder: 'e.g. John' },
    { key: 'lastName', label: 'Last Name', icon: User, type: 'text', placeholder: 'e.g. Doe' },
  ],
  [
    { key: 'phoneNumber', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: 'e.g. 0123456789' },
  ],
  [
    { key: 'bio', label: 'Bio', icon: FileText, type: 'textarea', placeholder: 'A short introduction...', rows: 3 },
  ],
  [
    { key: 'college', label: 'College', icon: GraduationCap, type: 'text', placeholder: 'e.g. FPT University' },
    { key: 'studentId', label: 'Student ID', icon: IdCard, type: 'text', placeholder: 'e.g. SE123456' },
  ],
  [
    { key: 'dateOfBirth', label: 'Date of Birth', icon: Calendar, type: 'date' },
    { key: 'address', label: 'Address', icon: MapPin, type: 'text', placeholder: 'e.g. Ho Chi Minh City' },
  ],
]

/**
 * Edit user form fields.
 * Receives form data and change handler via props — no API import.
 *
 * @param {{
 *   form: Record<string, string>,
 *   onChange: (field: string, value: string) => void,
 * }} props
 */
export default function UserEditForm({ form, onChange }) {
  return (
    <>

      <div className="rounded-xl border border-[#e8ecf0] bg-white p-6">
        <div className="space-y-4">
          {FIELDS.map((row, ri) => (
            <div key={ri} className={`grid grid-cols-1 gap-4 ${row.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {row.map((field) => (
                <FormField key={field.key} label={field.label} icon={field.icon}>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={form[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={field.rows || 3}
                      className="field-input resize-y"
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      value={form[field.key] || ''}
                      onChange={(e) => onChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="field-input"
                    />
                  )}
                </FormField>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
