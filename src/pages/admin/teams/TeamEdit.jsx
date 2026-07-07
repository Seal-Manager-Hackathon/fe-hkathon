import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import { getTeamDetail, updateTeam } from '../../../api/admin'
import SelectInput from '../../../components/SelectInput'
import FormField from '../../../components/FormField'
import FormActions from '../../../components/FormActions'
import { getErrorMessage } from '../../../utils/error'

const CAN_EDIT_OPTIONS = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Disabled', label: 'Disabled' },
]

export default function TeamEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    canEdit: 'true',
    status: 'Active',
  })

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getTeamDetail(id)
        if (!cancelled) {
          setTeam(data)
          setForm({
            name: data.name || '',
            canEdit: data.canEdit ? 'true' : 'false',
            status: data.isDisable ? 'Disabled' : 'Active',
          })
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err))
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

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const payload = {}

      if (team && form.name !== team.name) payload.name = form.name
      if (team && (form.canEdit === 'true') !== !!team.canEdit) payload.canEdit = form.canEdit === 'true'
      if (team && (form.status === 'Disabled') !== !!team.isDisable) payload.isDisable = form.status === 'Disabled'

      // Only send if there are changes
      if (Object.keys(payload).length > 0) {
        await updateTeam(id, payload)
      }

      navigate(`/admin/teams/${id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <div className="h-10 w-full max-w-[480px] animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full max-w-[480px] animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-full max-w-[480px] animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error && !team) {
    const isNotFound = error === 'Team Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'Team không tồn tại' : error}
        </p>
        <button
          onClick={() => navigate('/admin/teams')}
          className="mt-4 cursor-pointer text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Teams
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/admin/teams/${id}`)}
          className="inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"
        >
          &larr; Back to Team
        </button>
      </div>

      <h1 className="mb-6 text-[22px] font-bold text-[#1f2f3a] sm:text-[28px]">Edit Team</h1>

      {error && (
        <div className="mb-6 rounded-lg border border-[#fce4ec] bg-[#fff5f5] px-4 py-3 text-[14px] text-[#c62828]">
          {error}
        </div>
      )}

      <div className="w-full max-w-[480px] space-y-5">
        <FormField label="Team Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g. FTeam"
            className="field-input"
          />
        </FormField>

        <FormField label="Can Edit">
          <SelectInput
            options={CAN_EDIT_OPTIONS}
            value={form.canEdit}
            onChange={(v) => updateField('canEdit', v)}
          />
        </FormField>

        <FormField label="Status">
          <SelectInput
            options={STATUS_OPTIONS}
            value={form.status}
            onChange={(v) => updateField('status', v)}
          />
        </FormField>

        {form.status === 'Disabled' && (
          <div className="rounded-lg border border-[#fff3e0] bg-[#fff8e1] px-4 py-3 text-[13px] text-[#e65100]">
            Disabling this team will prevent members from making changes to the team.
          </div>
        )}
      </div>

      <FormActions
        onSave={handleSave}
        saving={saving}
        canSave={!!form.name}
        saveLabel="Save Changes"
        saveIcon={Save}
      />
    </div>
  )
}
