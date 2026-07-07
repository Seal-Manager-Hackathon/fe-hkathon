import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { allHackathons, statusBadge, visibilityBadge } from '../../data/mockAdminData'
import DataManagementPage from '../../components/DataManagementPage'
import Badge from '../../components/Badge'
import TableActions from '../../components/TableActions'

const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
]

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'Published', label: 'Published' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Upcoming', label: 'Upcoming' },
]

const VISIBILITY_OPTIONS = [
  { value: '', label: 'All Visibilities' },
  { value: 'Public', label: 'Public' },
  { value: 'Private', label: 'Private' },
  { value: 'Unlisted', label: 'Unlisted' },
]

const columns = [
  {
    key: 'name',
    header: 'Name',
    render: (row) => (
      <Link
        to={`/admin/hackathons/${row.id}`}
        className="text-[14px] font-semibold text-[#064f5d] hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  { key: 'year', header: 'Year' },
  {
    key: 'season',
    header: 'Season',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.season}</p>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge label={row.status} className={statusBadge[row.status]} />
    ),
  },
  {
    key: 'visibility',
    header: 'Visibility',
    render: (row) => (
      <Badge label={row.visibility} className={visibilityBadge[row.visibility]} />
    ),
  },
  {
    key: 'prize',
    header: 'Prize Pool',
    render: (row) => (
      <p className="text-[14px] font-bold text-[#064f5d]">{row.prize}</p>
    ),
  },
  { key: 'teams', header: 'Teams' },
  {
    key: 'date',
    header: 'Date',
    render: (row) => (
      <p className="text-[13px] text-gray-500">{row.date}</p>
    ),
  },
  {
    key: 'actions',
    header: 'Actions',
    headerClassName: 'text-right',
    className: 'text-right',
    render: (row) => (
      <TableActions viewTo={`/admin/hackathons/${row.id}`} editTo={`/admin/hackathons/${row.id}/edit`} />
    ),
  },
]

export default function HackathonManagement() {
  return (
    <DataManagementPage
      entityName="Hackathons"
      entityRouteBase="hackathons"
      createLabel="Create Hackathon"
      createIcon={Plus}
      countLabel="hackathon programs."
      searchPlaceholder="Search hackathons..."
      searchKeys={['name']}
      filters={[
        { key: 'year', label: 'Year', options: YEAR_OPTIONS, className: 'w-full sm:w-[160px]' },
        { key: 'status', label: 'Status', options: STATUS_OPTIONS, className: 'w-full sm:w-[180px]' },
        { key: 'visibility', label: 'Visibility', options: VISIBILITY_OPTIONS, className: 'w-full sm:w-[160px]' },
      ]}
      data={allHackathons}
      columns={columns}
      pageSize={10}
      emptyText="No hackathons match the current filters."
      emptyFallbackText="No hackathons yet. Create your first one!"
      keyExtractor={(row) => row.id}
      minWidth="1000px"
    />
  )
}
