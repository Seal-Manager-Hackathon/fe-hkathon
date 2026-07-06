import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import { allNotifications } from '../../data/mockAdminData'

const TYPE_OPTIONS = [
  { value: 'Announcement', label: 'Announcement' },
  { value: 'Update', label: 'Update' },
  { value: 'Alert', label: 'Alert' },
]

const AUDIENCE_OPTIONS = [
  { value: 'All Users', label: 'All Users' },
  { value: 'Participants', label: 'Participants' },
  { value: 'Staff', label: 'Staff' },
]

const STATUS_OPTIONS = [
  { value: 'Sent', label: 'Sent' },
  { value: 'Draft', label: 'Draft' },
]

export default function NotificationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const notification = allNotifications.find((n) => n.id === Number(id))

  const [form, setForm] = useState({
    title: notification?.title || '',
    body: notification?.body || '',
    type: notification?.type || 'Announcement',
    audience: notification?.audience || 'All Users',
    status: notification?.status || 'Draft',
  })
  const [saving, setSaving] = useState(false)

  if (!notification) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">Notification not found.</p>
        <Link to="/admin/notifications" className="mt-4 text-[14px] font-medium text-[#064f5d] hover:underline">
          ← Back to Notifications
        </Link>
      </div>
    )
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.title && form.body && form.type && form.audience

  function handleSave() {
    if (!canSave) return
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate(`/admin/notifications/${id}`)
    }, 600)
  }

  return (
    <div className="px-8 py-8">
      <Link
        to={`/admin/notifications/${id}`}
        className="mb-6 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Notification
      </Link>

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#1f2f3a]">Edit Notification</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update notification content and settings.</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
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
              rows={10}
              className="field-input resize-y min-h-[200px]"
            />
          </FormField>
        </div>

        <div className="space-y-5">
          <FormField label="Type">
            <SelectInput options={TYPE_OPTIONS} value={form.type} onChange={(v) => updateField('type', v)} />
          </FormField>
          <FormField label="Audience">
            <SelectInput options={AUDIENCE_OPTIONS} value={form.audience} onChange={(v) => updateField('audience', v)} />
          </FormField>
          <FormField label="Status">
            <SelectInput options={STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
          </FormField>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-[#e8ecf0] pt-6">
        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#064f5d] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <Link
          to={`/admin/notifications/${id}`}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d8e0e6] bg-white px-6 py-3 text-[14px] font-semibold text-[#1f2f3a] transition-colors hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>
    </div>
  )
}