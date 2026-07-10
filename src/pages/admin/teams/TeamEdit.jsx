import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, UserRound } from 'lucide-react'
import { getTeamDetail, updateTeam } from '../../../api/admin'
import FormField from '../../../components/FormField'
import FormActions from '../../../components/FormActions'
import { getErrorMessage } from '../../../utils/error'
import { toast } from '../../../utils/toast'

export default function TeamEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')

  useEffect(() => {
    let cancelled = false
    async function fetch() {
      setLoading(true)
      setError('')
      try {
        const data = await getTeamDetail(id)
        if (!cancelled) {
          setTeam(data)
          setName(data.name || '')
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

  async function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    try {
      if (name !== team?.name) {
        await updateTeam(id, { name: name.trim() })
      }
      toast.success('Team updated')
      navigate(`/admin/teams/${id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-10 w-full max-w-[480px] animate-pulse rounded bg-gray-200" />
      </div>
    )
  }

  if (error && !team) {
    const isNotFound = error === 'Team Not Found' || error.includes('Not Found')
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <p className="text-[18px] font-semibold text-gray-500">
          {isNotFound ? 'Team not found' : error}
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

      <div className="w-full max-w-[480px]">
        <FormField label="Team Name" icon={UserRound}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. FTeam"
            className="field-input"
          />
        </FormField>
      </div>

      <FormActions
        onSave={handleSave}
        saving={saving}
        canSave={!!name.trim()}
        saveLabel="Save Changes"
        saveIcon={Save}
      />
    </div>
  )
}
