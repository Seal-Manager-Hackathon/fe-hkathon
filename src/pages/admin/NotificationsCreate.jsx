import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'

const TYPE_OPTIONS = [
  { value: '', label: 'Select type...' },
  { value: 'Announcement', label: 'Announcement' },
  { value: 'Update', label: 'Update' },
  { value: 'Alert', label: 'Alert' },
]

const AUDIENCE_OPTIONS = [
  { value: '', label: 'Select audience...' },
  { value: 'All Users', label: 'All Users' },
  { value: 'Participants', label: 'Participants' },
  { value: 'Staff', label: 'Staff' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'Select status...' },
  { value: 'Sent', label: 'Send immediately' },
  { value: 'Draft', label: 'Save as draft' },
]

export default function NotificationsCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    body: '',
    type: '',
    audience: '',
    status: '',
  })
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.title && form.body && form.type && form.audience && form.status

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate('/admin/notifications')
    }, 600)
  }

  return (
    <div className="px-8 py-8">
      <Link to="/admin/notifications" className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Notifications
      </Link>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Create Notification</h1>
        <p className="mt-1 text-[15px] text-gray-500">Send a new notification to users across the platform.</p>
      </div>

      <div className="w-full max-w-[640px] space-y-5">
        <FormField label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. New hackathon registration is open"
            className="field-input"
          />
        </FormField>

        <FormField label="Message Body" required>
          <textarea
            value={form.body}
            onChange={(e) => updateField('body', e.target.value)}
            placeholder="Write the notification message..."
            rows={5}
            className="field-input resize-y min-h-[120px]"
          />
        </FormField>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Type" required>
            <SelectInput options={TYPE_OPTIONS} value={form.type} onChange={(v) => updateField('type', v)} />
          </FormField>
          <FormField label="Audience" required>
            <SelectInput options={AUDIENCE_OPTIONS} value={form.audience} onChange={(v) => updateField('audience', v)} />
          </FormField>
          <FormField label="Action" required>
            <SelectInput options={STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
          </FormField>
        </div>

        {form.status === 'Sent' && (
          <div className="rounded-lg border border-[#fff3e0] bg-[#fff8e1] px-4 py-3 text-[13px] text-[#e65100]">
            This notification will be sent immediately to {form.audience || 'the selected audience'} upon creation.
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-[#e8ecf0] pt-6">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {saving ? 'Sending...' : form.status === 'Sent' ? 'Send Notification' : 'Save Notification'}
        </button>
        <Link to="/admin/notifications" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50">
          Cancel
        </Link>
      </div>
    </div>
  )
}