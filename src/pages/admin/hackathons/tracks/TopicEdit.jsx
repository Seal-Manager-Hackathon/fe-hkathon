import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { getTopicDetail, updateTopic } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'

export default function TopicEdit() {
  const { trackId, topicId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      try {
        const data = await getTopicDetail(topicId)
        if (cancelled) return
        setTitle(data.title || '')
        setDescription(data.description || '')
      } catch {
        if (!cancelled) toast.error('Failed to load topic.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [topicId])

  const canSave = title.trim().length > 0

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = { title: title.trim() }
      if (description !== undefined) payload.description = description.trim() || null
      await updateTopic(topicId, payload)
      toast.success('Topic updated successfully')
      navigate(`/admin/tracks/${trackId}/topics`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update topic.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8"><p className="text-gray-400">Loading...</p></div>

  return (
    <EntityFormPage
      backUrl={`/admin/tracks/${trackId}/topics`}
      backLabel="Back to Topics"
      title="Edit Topic"
      description=""
      saveLabel="Save Changes"
      savingLabel="Saving..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="max-w-[640px] space-y-5">
        <FormField label="Topic Title" required icon={FileText}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. AI Chatbot for Education" maxLength={200} className="field-input" />
        </FormField>
        <FormField label="Description" icon={FileText}>
          <RichTextEditor value={description} onChange={setDescription} placeholder="Topic description..." />
        </FormField>
      </div>
    </EntityFormPage>
  )
}
