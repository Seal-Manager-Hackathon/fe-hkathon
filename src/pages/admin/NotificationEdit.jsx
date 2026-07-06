import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import BackButton from '../../components/BackButton'
import NotFoundState from '../../components/NotFoundState'
import FormActions from '../../components/FormActions'
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
    return <NotFoundState entity="Notification" fallbackTo="/admin/notifications" />
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
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <BackButton fallback={`/admin/notifications/${id}`} label="Back to Notification" />

      <div className="mb-8">
        <h1 className="text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit Notification</h1>
        <p className="mt-1 text-[15px] text-gray-500">Update notification content and settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <FormField label="Title" required>
            <input type="text" value={form.title} onChange={(e) => updateField('title', e.target.value)} placeholder="e.g. New hackathon registration is open" className="field-input" />
          </FormField>
          <FormField label="Message Body" required>
            <textarea value={form.body} onChange={(e) => updateField('body', e.target.value)} placeholder="Write the notification message..." rows={10} className="field-input resize-y min-h-[200px]" />
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

      <FormActions onSave={handleSave} saving={saving} canSave={canSave} />
    </div>
  )
}