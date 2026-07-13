import { Link } from 'react-router-dom'
import { ArrowLeft, Send } from 'lucide-react'

export default function ErrorState({ message, nf }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="mb-4 rounded-full bg-rose-50 p-4"><Send className="h-8 w-8 text-rose-400" /></div>
      <p className="text-[18px] font-semibold text-[#1f2f3a]">{nf ? 'Submission not found' : message}</p>
      <Link to="/admin/hackathons" className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#064f5d] hover:underline"><ArrowLeft className="h-4 w-4" /> Back to Hackathons</Link>
    </div>
  )
}
