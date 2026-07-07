import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bell, FileText } from 'lucide-react'
import FormField from '../../../components/FormField'
import EntityFormPage from '../../../components/EntityFormPage'
import { getNotificationDetail, updateNotification } from '../../../api/admin'

export default function NotificationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getNotificationDetail(id)
        if (!cancelled) {
          setForm({ title: data.title || '', description: data.description || '' })
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err?.response?.data?.message || 'Failed to load notification.'
          if (msg === 'Notification Not Found' || msg.includes('Not Found')) {
            setNotFound(true)
          } else {
            setError(msg)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetch()
    return () => { cancelled = true }
  }, [id])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSave = form.title.trim() && form.description.trim()

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setError('')
    try {
      await updateNotification(id, {
        title: form.title.trim(),
        description: form.description.trim(),
      })
      navigate(`/admin/notifications/${id}`)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update notification.')
    } finally {
      setSaving(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mb-8 space-y-2">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  // Not found
  if (notFound) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">Notification not found</p>
        <button
          onClick={() => navigate('/admin/notifications')}
          className="mt-4 cursor-pointer text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Notifications
        </button>
      </div>
    )
  }

  return (
    <EntityFormPage
      backUrl={`/admin/notifications/${id}`}
      backLabel="Back to Notification"
      title="Edit Notification"
      description="Only title and content can be edited."
      saveLabel="Save Changes"
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      {error && (
        <div className="mb-4 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <div className="w-full max-w-[640px] space-y-5">
        <FormField label="Title" icon={Bell}>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. New hackathon registration is open"
            className="field-input"
          />
        </FormField>
        <FormField label="Message Body" icon={FileText}>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Write the notification message..."
            rows={10}
            className="field-input resize-y min-h-[200px]"
          />
        </FormField>
      </div>
    </EntityFormPage>
  )
}

