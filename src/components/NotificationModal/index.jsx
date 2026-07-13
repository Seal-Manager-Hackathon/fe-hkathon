import { X } from 'lucide-react'
import RichTextViewer from '../RichTextViewer'

export default function NotificationModal({ notification, onClose }) {
  if (!notification) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 sm:p-6" onClick={onClose} data-notification-modal>
      <div className="w-full max-w-[92%] sm:max-w-[480px] rounded-2xl bg-white p-5 sm:p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h3 className="text-[17px] font-bold text-[#1f2f3a]">{notification.title}</h3>
            <p className="mt-0.5 text-[13px] text-gray-400">{notification.date}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="rounded-xl bg-[#f4f6f8] p-5">
          <RichTextViewer content={notification.body} />
        </div>
        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="cursor-pointer rounded-lg bg-[#064f5d] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#05404a]">Close</button>
        </div>
      </div>
    </div>
  )
}