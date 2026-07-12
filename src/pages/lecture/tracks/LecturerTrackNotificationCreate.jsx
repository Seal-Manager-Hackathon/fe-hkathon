import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bell, FileText } from 'lucide-react'
import FormField from '../../../components/FormField'
import EntityFormPage from '../../../components/EntityFormPage'
import RichTextEditor from '../../../components/RichTextEditor'
import { createLecturerMentorNotification } from '../../../api/lecturer'
import { toast } from '../../../utils/toast'

export default function LecturerTrackNotificationCreate() {
  const { trackId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const canSave = title.trim().length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = { title: title.trim() }
      if (description.trim()) payload.description = description.trim()
      await createLecturerMentorNotification(trackId, payload)
      toast.success('Notification sent successfully')
      navigate(`/lecture/tracks/${trackId}/notifications`)
    } catch (err) {
      const msg = err?.response?.data?.message
      if (msg?.toLowerCase().includes('not assigned')) {
        toast.error('You are not assigned to this track.')
      } else if (msg?.toLowerCase().includes('not found')) {
        toast.error('Track not found.')
      } else {
        toast.error(msg || 'Failed to send notification.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/lecture/tracks/${trackId}/notifications`}
      backLabel="Back to Notifications"
      title="Create Notification"
      description="Send a notification to students in this track."
      saveLabel="Send Notification"
      savingLabel="Sending..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
      saveIcon={Bell}
    >
      <div className="max-w-[640px] space-y-5">
        <FormField label="Title" required icon={FileText}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Schedule Change Notice"
            maxLength={200}
            className="field-input"
          />
        </FormField>
        <FormField label="Description" icon={FileText}>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Write notification content..."
          />
        </FormField>
      </div>
    </EntityFormPage>
  )
}
