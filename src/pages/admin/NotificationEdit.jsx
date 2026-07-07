import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SelectInput from '../../components/SelectInput'
import FormField from '../../components/FormField'
import NotFoundState from '../../components/NotFoundState'
import EntityFormPage from '../../components/EntityFormPage'
import { allNotifications } from '../../data/mockAdminData'
import { NOTIFICATION_TYPE_OPTIONS, AUDIENCE_OPTIONS, NOTIFICATION_STATUS_OPTIONS } from '../../constants/adminOptions'

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
    <EntityFormPage
      backUrl={`/admin/notifications/${id}`}
      backLabel="Back to Notification"
      title="Edit Notification"
      description="Update notification content and settings."
      saveLabel="Save Changes"
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
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
            <SelectInput options={NOTIFICATION_TYPE_OPTIONS} value={form.type} onChange={(v) => updateField('type', v)} />
          </FormField>
          <FormField label="Audience">
            <SelectInput options={AUDIENCE_OPTIONS} value={form.audience} onChange={(v) => updateField('audience', v)} />
          </FormField>
          <FormField label="Status">
            <SelectInput options={NOTIFICATION_STATUS_OPTIONS} value={form.status} onChange={(v) => updateField('status', v)} />
          </FormField>
        </div>
      </div>
    </EntityFormPage>
  )
}
