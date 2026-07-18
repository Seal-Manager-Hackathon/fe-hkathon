import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FileText, CircleCheck, Shield } from 'lucide-react'
import FormField from '../../../../components/FormField'
import EntityFormPage from '../../../../components/EntityFormPage'
import StaffEventInfoCard from '../../../../components/StaffEventInfoCard'
import { getRegisterTeamDetail, getEventDetail, updateRegisterTeam } from '../../../../api/staff'
import { formatDateTime } from '../../../../utils/format'
import { toast } from '../../../../utils/toast'

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
]

const TABS = [
  { key: 'description', label: 'Description', icon: <FileText className="h-4 w-4" /> },
  { key: 'status', label: 'Status & Reason', icon: <CircleCheck className="h-4 w-4" /> },
]

export default function RegisterTeamEdit() {
  const { registerTeamId } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [description, setDescription] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [event, setEvent] = useState(null)
  const [tab, setTab] = useState('description')

  useEffect(() => {
    let cancelled = false
    getRegisterTeamDetail(registerTeamId).then((result) => {
      if (cancelled) return
      setData(result)
      setStatus(result.status || '')
      setDescription(result.description || '')
      setRejectionReason(result.rejectionReason || '')
      if (result.eventId) {
        getEventDetail(result.eventId).then((evt) => {
          if (!cancelled) setEvent(evt)
        }).catch(() => {})
      }
    }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [registerTeamId])

  const backUrl = data?.eventId
    ? `/staff/hackathons/${data.eventId}?tab=Register+Teams`
    : '/staff/hackathons'

  async function handleSave() {
    setSaving(true)
    try {
      const payload = { status, description: description.trim(), rejectionReason: rejectionReason.trim() }
      await updateRegisterTeam(registerTeamId, payload)
      toast.success('Registration updated')
      navigate(backUrl)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update.')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200 mb-6" />
        <div className="h-8 w-64 animate-pulse rounded bg-gray-200 mb-8" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-100" />
      </div>
    )
  }

  return (
    <EntityFormPage
      backUrl={backUrl}
      backLabel="Back to Register Teams"
      title="Edit Registration"
      description={`${data?.teamName || '—'} — ${data?.teamName ? 'modify registration details' : ''}`}
      saveLabel="Save Changes"
      savingLabel="Saving..."
      canSave={true}
      onSave={handleSave}
      saving={saving}
      saveIcon={FileText}
    >
      <div className="grid grid-cols-1 gap-x-10 gap-y-5 lg:grid-cols-[1fr_320px]">
        <div>
          {/* Tab bar */}
          <div className="flex gap-1 mb-5 rounded-lg bg-[#f5f5f5] p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-[13px] font-semibold transition-all cursor-pointer ${
                  tab === t.key
                    ? 'bg-white text-[#1f2f3a] shadow-sm'
                    : 'text-gray-500 hover:text-[#1f2f3a]'
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'description' && (
            <FormField label="Description" icon={FileText}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="field-input resize-y"
                placeholder="Team description..."
              />
            </FormField>
          )}

          {tab === 'status' && (
            <div className="space-y-5">
              <FormField label="Status" icon={CircleCheck}>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="field-input">
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Reason" icon={Shield}>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="field-input resize-y"
                  placeholder="Optional reason..."
                />
              </FormField>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          <RegistrationSummaryCard data={data} />
          {event && <StaffEventInfoCard event={event} />}
        </div>
      </div>
    </EntityFormPage>
  )
}

function RegistrationSummaryCard({ data }) {
  if (!data) return null

  return (
    <div className="rounded-xl border border-[#e8ecf0] bg-white shadow-sm self-start overflow-hidden">
      <div className="bg-gradient-to-r from-[#064f5d] to-[#0a6e7d] px-5 py-4">
        <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
          <FileText className="h-4 w-4 text-[#80deea]" /> Registration Info
        </h4>
      </div>
      <div className="divide-y divide-[#f5f5f5]">
        <div className="px-5 py-3.5">
          <p className="text-[14px] font-bold text-[#1f2f3a]">{data.teamName}</p>
          <p className="mt-0.5 text-[12px] text-gray-400">Registered {data.createdAt ? formatDateTime(data.createdAt) : '—'}</p>
        </div>
        <div className="px-5 py-3 space-y-2">
          {data.trackTitle && (
            <R icon={<FileText className="h-3.5 w-3.5 text-[#1565c0]" />} label="Track" value={data.trackTitle} cls="text-[#1565c0]" />
          )}
          {data.topicTitle && (
            <R icon={<FileText className="h-3.5 w-3.5 text-[#7b1fa2]" />} label="Topic" value={data.topicTitle} cls="text-[#7b1fa2]" />
          )}
          <R icon={<CircleCheck className="h-3.5 w-3.5 text-[#2e7d32]" />} label="Status" value={data.status} cls="text-[#2e7d32]" />
          {data.isBanned && (
            <R icon={<Shield className="h-3.5 w-3.5 text-[#c62828]" />} label="Banned" value="Yes" cls="text-[#c62828]" />
          )}
        </div>
      </div>
    </div>
  )
}

function R({ icon, label, value, cls = '' }) {
  return (
    <p className="flex items-center gap-2 text-[13px]">
      {icon}
      <span className="text-gray-400">{label}</span>
      <span className={`ml-auto font-semibold ${cls}`}>{value}</span>
    </p>
  )
}
