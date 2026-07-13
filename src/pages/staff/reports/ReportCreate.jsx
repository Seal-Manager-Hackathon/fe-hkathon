import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, FileText, Target, User, Users } from 'lucide-react'
import FormField from '../../../components/FormField'
import SelectInput from '../../../components/SelectInput'
import SearchableSelect from '../../../components/SearchableSelect'
import EntityFormPage from '../../../components/EntityFormPage'
import { createNotification, getUsers, getTeams } from '../../../api/staff'
import { TARGET_TYPE_OPTIONS } from '../../../constants/commonOptions'
import { toast } from '../../../utils/toast'

// Staff can only send notifications to specific users or teams — not System-wide.
const STAFF_TARGET_OPTIONS = TARGET_TYPE_OPTIONS.filter((opt) => opt.value !== 'System')

const TARGET_TYPE_SELECT = [
  { value: '', label: 'Select target...' },
  ...STAFF_TARGET_OPTIONS,
]

export default function ReportCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetType: '',
    userId: '',
    teamId: '',
  })
  const [saving, setSaving] = useState(false)

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'targetType') {
        if (value !== 'Personal') next.userId = ''
        if (value !== 'Team') next.teamId = ''
      }
      return next
    })
  }

  const fetchUsers = useCallback(async (keyword, pageIndex = 1, pageSize) => {
    const result = await getUsers({ Keyword: keyword, PageIndex: pageIndex, PageSize: pageSize || 20 })
    const data = (result.users || []).map((u) => {
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim()
      return {
        value: u.id,
        label: fullName || u.email,
        sub: u.email || '',
        avatar: u.avatarUrl || null,
        avatarLetter: fullName ? fullName.charAt(0).toUpperCase() : (u.email || '?').charAt(0).toUpperCase(),
      }
    })
    return { data, totalCount: result.totalCount || 0 }
  }, [])

  const fetchTeams = useCallback(async (keyword, pageIndex = 1, pageSize) => {
    const result = await getTeams({ Keyword: keyword, PageIndex: pageIndex, PageSize: pageSize || 20 })
    const data = (result.teams || []).map((t) => ({
      value: t.id,
      label: t.name,
      avatarLetter: (t.name || 'T').charAt(0).toUpperCase(),
    }))
    return { data, totalCount: result.totalCount || 0 }
  }, [])

  const canSave = form.title.trim()
    && form.description.trim()
    && form.targetType
    && (form.targetType !== 'Personal' || form.userId)
    && (form.targetType !== 'Team' || form.teamId)

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        targetType: form.targetType,
      }
      if (form.targetType === 'Personal') {
        payload.userId = form.userId
      }
      if (form.targetType === 'Team') {
        payload.teamId = form.teamId
      }
      await createNotification(payload)
      toast.success('Notification sent')
      navigate('/staff/reports')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to send notification.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl="/staff/reports"
      backLabel="Back to Reports"
      title="Send Notification"
      description="Send a notification to a specific user or team."
      saveLabel="Send Notification"
      savingLabel="Sending..."
      canSave={canSave}
      onSave={handleSave}
      saving={saving}
    >
      <div className="w-full max-w-[640px] space-y-5">
        <FormField label="Title" icon={Bell}>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. Your team has been flagged"
            className="field-input"
          />
        </FormField>

        <FormField label="Message Body" icon={FileText}>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Write the notification message..."
            rows={6}
            className="field-input resize-y min-h-[140px]"
          />
        </FormField>

        <FormField label="Target Type" icon={Target}>
          <SelectInput
            options={TARGET_TYPE_SELECT}
            value={form.targetType}
            onChange={(v) => updateField('targetType', v)}
          />
        </FormField>

        {form.targetType === 'Personal' && (
          <FormField label="User" icon={User}>
            <SearchableSelect
              fetchFn={fetchUsers}
              value={form.userId}
              onChange={(v) => updateField('userId', v)}
              placeholder="Search user by name or email..."
              emptyText="No users found."
              pageSize={5}
            />
          </FormField>
        )}

        {form.targetType === 'Team' && (
          <FormField label="Team" icon={Users}>
            <SearchableSelect
              fetchFn={fetchTeams}
              value={form.teamId}
              onChange={(v) => updateField('teamId', v)}
              placeholder="Search team by name..."
              emptyText="No teams found."
              pageSize={5}
            />
          </FormField>
        )}

        {form.targetType === 'Team' && form.teamId && (
          <div className="rounded-lg border border-[#e8f5e9] bg-[#f0faf0] px-4 py-3 text-[13px] text-[#2e7d32]">
            This notification will be sent to <strong>all members</strong> of the selected team.
          </div>
        )}

        {form.targetType === 'Personal' && form.userId && (
          <div className="rounded-lg border border-[#f3e5f5] bg-[#faf0fc] px-4 py-3 text-[13px] text-[#7b1fa2]">
            This notification will be sent to the <strong>selected user</strong>.
          </div>
        )}
      </div>
    </EntityFormPage>
  )
}
