import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createTopic } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'

export default function TopicCreate() {
  const { eventId, trackId } = useParams()
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
      await createTopic(trackId, payload)
      toast.success('Topic created successfully')
      navigate(`/admin/hackathons/${eventId}/tracks/${trackId}/topics`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create topic.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/hackathons/${eventId}/tracks/${trackId}/topics`}
      backLabel="Back to Topics"
      title="Create Topic"
      description=""
      saveLabel="Create Topic"
      savingLabel="Creating..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="space-y-5 max-w-2xl">
        <FormField label="Topic Title" required icon={FileText}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Chatbot hỗ trợ học tập"
            maxLength={200}
            className="field-input"
          />
        </FormField>
        <FormField label="Description" icon={FileText}>
          <RichTextEditor value={description} onChange={setDescription} placeholder="Topic description..." />
        </FormField>
      </div>
    </EntityFormPage>
  )
}
