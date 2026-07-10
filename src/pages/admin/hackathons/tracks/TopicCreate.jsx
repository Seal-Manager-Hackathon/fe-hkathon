import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import RichTextEditor from '../../../../components/RichTextEditor'
import { createTopic } from '../../../../api/admin'
import { toast } from '../../../../utils/toast'

export default function TopicCreate() {
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
      await createTopic(trackId, payload)
      toast.success('Topic created successfully')
      navigate(`/admin/tracks/${trackId}/topics`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create topic.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl={`/admin/tracks/${trackId}/topics`}
      backLabel="Back to Topics"
      title="Create Topic"
      description=""
      saveLabel="Create Topic"
      savingLabel="Creating..."
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
              </div>
            </div>
            <div className="space-y-2 px-5 py-3">
              <R icon={<Flag className="h-3.5 w-3.5 text-[#ef6c00]" />} label="Season" value={event.season || '—'} cls="text-[#ef6c00]" />
              <R icon={<Clock className="h-3.5 w-3.5 text-[#1565c0]" />} label="Start" value={formatDateTime(event.startTime)} mono />
              <R icon={<Clock className="h-3.5 w-3.5 text-[#c62828]" />} label="End" value={formatDateTime(event.endTime)} mono />
            </div>
          </div>
        </div>
      )}
      {track && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#0a6e7d] to-[#0d8a96] px-5 py-4">
            <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#80deea]" /> Track
            </h4>
          </div>
          <div className="space-y-2 px-5 py-3">
            <p className="text-[14px] font-bold text-[#064f5d] leading-snug">{track.title}</p>
            <R icon={<Users className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Max Teams" value={track.maxTeam != null ? String(track.maxTeam) : '—'} cls="text-[#2e7d32]" />
          </div>
        </div>
      )}
      {!event && !track && (
        <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
          <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
            <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#80deea]" /> Context
            </h4>
          </div>
          <div className="px-5 py-5 text-center text-[13px] text-gray-400">Loading info...</div>
        </div>
      )}
    </div>
  )
}

function R({ icon, label, value, cls = '', mono = false }) {
  return <p className="flex items-center gap-2 text-[13px]">{icon}<span className="text-gray-400">{label}</span><span className={`ml-auto font-semibold ${cls} ${mono ? 'text-[12px] font-medium' : ''}`}>{value}</span></p>
}
