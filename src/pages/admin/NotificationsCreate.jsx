import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import SelectInput from '../../components/SelectInput'
import SearchableSelect from '../../components/SearchableSelect'
import EntityFormPage from '../../components/EntityFormPage'
import { createNotification, getUsers, getTeams } from '../../api/admin'
import { TARGET_TYPE_OPTIONS } from '../../constants/adminOptions'

const TARGET_TYPE_SELECT = [
  { value: '', label: 'Select target...' },
  ...TARGET_TYPE_OPTIONS,
]

export default function NotificationsCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    targetType: '',
    userId: '',
    teamId: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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

  const fetchUsers = useCallback(async (keyword) => {
    const result = await getUsers({ Keyword: keyword, PageSize: 20 })
    return (result.users || []).map((u) => {
      const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim()
      return {
        value: u.id,
        label: fullName || u.email,
        sub: u.email || '',
        avatar: u.avatarUrl || null,
        avatarLetter: fullName ? fullName.charAt(0).toUpperCase() : (u.email || '?').charAt(0).toUpperCase(),
      }
    })
  }, [])

  const fetchTeams = useCallback(async (keyword) => {
    const result = await getTeams({ Keyword: keyword, PageSize: 20 })
    return (result.teams || []).map((t) => ({
      value: t.id,
      label: t.name,
      avatarLetter: (t.name || 'T').charAt(0).toUpperCase(),
    }))
  }, [])

  const canSave = form.title.trim()
    && form.description.trim()
    && form.targetType
    && (form.targetType !== 'Personal' || form.userId)
    && (form.targetType !== 'Team' || form.teamId)

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    setError('')
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
      navigate('/admin/notifications')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create notification.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <EntityFormPage
      backUrl="/admin/notifications"
      backLabel="Back to Notifications"
      title="Create Notification"
      description="Tạo thông báo mới. Tuỳ theo đối tượng nhận mà hệ thống sẽ gửi khác nhau."
      saveLabel="Send Notification"
      savingLabel="Sending..."
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
        <FormField label="Title" required>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g. New hackathon registration is open"
            className="field-input"
          />
        </FormField>

        <FormField label="Message Body" required>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Write the notification message..."
            rows={6}
            className="field-input resize-y min-h-[140px]"
          />
        </FormField>

        <FormField label="Target Type" required>
          <SelectInput
            options={TARGET_TYPE_SELECT}
            value={form.targetType}
            onChange={(v) => updateField('targetType', v)}
          />
        </FormField>

        {form.targetType === 'Personal' && (
          <FormField label="User" required>
            <SearchableSelect
              fetchFn={fetchUsers}
              value={form.userId}
              onChange={(v) => updateField('userId', v)}
              placeholder="Search user by name or email..."
              emptyText="No users found."
            />
          </FormField>
        )}

        {form.targetType === 'Team' && (
          <FormField label="Team" required>
            <SearchableSelect
              fetchFn={fetchTeams}
              value={form.teamId}
              onChange={(v) => updateField('teamId', v)}
              placeholder="Search team by name..."
              emptyText="No teams found."
            />
          </FormField>
        )}

        {form.targetType === 'System' && (
          <div className="rounded-lg border border-[#e3f2fd] bg-[#e8f4fd] px-4 py-3 text-[13px] text-[#1565c0]">
            This notification will be sent to <strong>all users</strong> in the system.
          </div>
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

