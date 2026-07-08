import { cn } from '../../../../utils/cn'
import { STATUS_STEPPER_STEPS, STATUS_META } from './statusMeta'

export default function StatusStepper({ status }) {
  const steps = STATUS_STEPPER_STEPS(status)
  const meta = STATUS_META[status] || STATUS_META.Pending
  const activeIndex = status === 'Pending' ? 0 : 1

  return (
    <div className="flex items-center justify-center sm:justify-start">
      {steps.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-all duration-300 sm:h-7 sm:w-7 sm:text-[11px]',
                i < activeIndex
                  ? meta.stepperActive + ' text-white shadow-sm'
                  : i === activeIndex
                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                    : 'border-gray-250 bg-white text-gray-400',
              )}
            >
              {i < activeIndex ? '\u2713' : 1 + i}
            </div>
            <span
              className={cn(
                'mt-1 text-[10px] font-semibold whitespace-nowrap transition-colors duration-300 sm:text-[11px]',
                i < activeIndex
                  ? meta.stepperLabel
                  : i === activeIndex
                    ? 'text-amber-600'
                    : 'text-gray-400',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'mx-1.5 mb-4 h-0.5 w-10 rounded-full transition-all duration-300 sm:mx-3 sm:w-16',
                i < activeIndex ? meta.stepperLine : 'bg-gray-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
