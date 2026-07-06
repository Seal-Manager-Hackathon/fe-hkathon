import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import Badge from '../Badge'
import DetailField from '../DetailField'
import Avatar from '../Avatar'

export default function DashboardModal({ modal, onClose }) {
  const { type, data } = modal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6" onClick={onClose}>
      <div className="w-full max-w-[540px] rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-[#1f2f3a]">
              {data?.name || data?.title || modal.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-gray-400">
              {type === 'hackathon' && <Badge label={data.status} className={modal.badges.status[data.status]} />}
              {type === 'user' && <Badge label={data.role} className={modal.badges.role[data.role]} />}
              <span>
                {type === 'hackathon' && `${data.season} · ${data.date}`}
                {type === 'user' && data.email}
                {!type && `Sent by ${modal.sentBy} · ${modal.date}`}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body — Hackathon */}
        {type === 'hackathon' && (
          <div className="rounded-xl bg-[#f4f6f8] p-5">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <DetailField label="Season"><p className="text-[14px] font-semibold text-[#1f2f3a]">{data.season}</p></DetailField>
              <DetailField label="Date"><p className="text-[14px] font-semibold text-[#1f2f3a]">{data.date}</p></DetailField>
              <DetailField label="Prize Pool"><p className="text-[15px] font-bold text-[#064f5d]">{data.prize}</p></DetailField>
              <DetailField label="Register Team"><p className="text-[14px] font-semibold text-[#1f2f3a]">{data.teams || 0}</p></DetailField>
            </div>
          </div>
        )}

        {/* Body — User */}
        {type === 'user' && (
          <div>
            <div className="mb-4 flex items-center gap-4 rounded-xl bg-[#f4f6f8] p-4">
              <Avatar src={data.avatar} name={data.name} size="h-14 w-14" textSize="text-[20px]" />
              <div>
                <p className="text-[15px] font-bold text-[#1f2f3a]">{data.name}</p>
                <p className="text-[13px] text-gray-500">{data.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailField className="bg-[#f4f6f8]" label="Role"><p className="text-[14px] font-semibold text-[#1f2f3a]">{data.role}</p></DetailField>
              <DetailField className="bg-[#f4f6f8]" label="Status">
                <Badge label={data.status} className={modal.badges.userStatus[data.status]} />
              </DetailField>
              <DetailField className="bg-[#f4f6f8]" label="Submissions"><p className="text-[14px] font-semibold text-[#1f2f3a]">{data.submissions || 0}</p></DetailField>
              <DetailField className="bg-[#f4f6f8]" label="Joined"><p className="text-[14px] font-semibold text-[#1f2f3a]">{data.joined || 'Jan 2026'}</p></DetailField>
            </div>
          </div>
        )}

        {/* Body — Notification */}
        {!type && (
          <div className="max-h-[300px] overflow-y-auto rounded-xl bg-[#f4f6f8] p-5">
            <p className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">{modal.body}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex items-center justify-between">
          {type === 'hackathon' ? (
            <Link
              to={`/admin/hackathons/${data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="cursor-pointer rounded-lg border border-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-[#064f5d] transition-colors hover:bg-[#064f5d] hover:text-white"
            >
              View Detail
            </Link>
          ) : (
            <div />
          )}
          <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
        </div>
      </div>
    </div>
  )
}
