import { CheckCircle, ShieldAlert, XCircle } from 'lucide-react'

export const STATUS_META = {
  Pending: {
    heroBg: 'bg-gradient-to-br from-amber-100/70 via-amber-50/40 to-white',
    heroBorder: 'border-amber-300',
    heroAccent: 'bg-amber-500',
    dot: 'bg-amber-500',
    icon: ShieldAlert,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800 border-amber-300',
    stepperActive: 'border-amber-500 bg-amber-500',
    stepperLine: 'bg-amber-300',
    stepperLabel: 'text-amber-700',
  },
  Resolved: {
    heroBg: 'bg-gradient-to-br from-emerald-100/70 via-emerald-50/40 to-white',
    heroBorder: 'border-emerald-300',
    heroAccent: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    icon: CheckCircle,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    stepperActive: 'border-emerald-500 bg-emerald-500',
    stepperLine: 'bg-emerald-300',
    stepperLabel: 'text-emerald-700',
  },
  Rejected: {
    heroBg: 'bg-gradient-to-br from-rose-100/70 via-rose-50/40 to-white',
    heroBorder: 'border-rose-300',
    heroAccent: 'bg-rose-500',
    dot: 'bg-rose-500',
    icon: XCircle,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-800 border-rose-300',
    stepperActive: 'border-rose-500 bg-rose-500',
    stepperLine: 'bg-rose-300',
    stepperLabel: 'text-rose-700',
  },
}

export const STATUS_STEPPER_STEPS = (status) => {
  const isDone = status !== 'Pending'
  const isResolved = status === 'Resolved'
  const isRejected = status === 'Rejected'
  return [
    { key: 'submitted', label: 'Submitted', done: true },
    { key: 'review', label: 'Under Review', done: isDone },
    {
      key: 'outcome',
      label: isResolved ? 'Resolved' : isRejected ? 'Rejected' : 'Outcome',
      done: isDone,
      rejected: isRejected,
    },
  ]
}
