import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import EntityFormPage from '../../components/EntityFormPage'
import FormField from '../../components/FormField'
import SelectInput from '../../components/SelectInput'
import NotFoundState from '../../components/NotFoundState'

export default function TeamEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      navigate(`/admin/teams/${id}`)
    }, 600)
  }

  return (
    <EntityFormPage
      backUrl={`/admin/teams/${id}`}
      backLabel="Back to Team"
      title="Edit Team"
      description="Update team details."
      saveLabel="Save Changes"
      canSave
      onSave={handleSave}
      saving={saving}
    >
      <p className="text-[14px] text-gray-400">Team ID: {id}</p>
    </EntityFormPage>
  )
}
