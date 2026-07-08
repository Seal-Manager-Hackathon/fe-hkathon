import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

const MARKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const SCORE_COLORS = {
  low:  { fill: 'from-rose-400 to-rose-500', thumb: 'bg-rose-500', shadow: 'shadow-rose-500/25', bubble: 'bg-rose-500' },
  mid:  { fill: 'from-amber-400 to-amber-500', thumb: 'bg-amber-500', shadow: 'shadow-amber-500/25', bubble: 'bg-amber-500' },
  high: { fill: 'from-emerald-400 to-emerald-500', thumb: 'bg-emerald-500', shadow: 'shadow-emerald-500/25', bubble: 'bg-emerald-500' },
}

function getColors(pct) {
  if (pct <= 30) return SCORE_COLORS.low
  if (pct <= 60) return SCORE_COLORS.mid
  return SCORE_COLORS.high
}

export default function ScoreSlider({ value, onChange }) {
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef(null)

  const pct = Math.min(100, Math.max(0, value))
  const colors = useMemo(() => getColors(pct), [pct])

  const updateFromClientX = useCallback((clientX) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const w = rect.width
    const raw = Math.round((x / w) * 100)
    const clamped = Math.min(100, Math.max(0, raw))
    onChange(clamped)
  }, [onChange])

  const handlePointerDown = useCallback((e) => {
    setDragging(true)
    updateFromClientX(e.clientX)
  }, [updateFromClientX])

  useEffect(() => {
    if (!dragging) return
    const move = (e) => updateFromClientX(e.clientX)
    const up = () => setDragging(false)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [dragging, updateFromClientX])

  return (
    <div className="space-y-1.5 select-none">
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative h-3 w-full cursor-pointer rounded-full bg-slate-100"
      >
        {/* fill */}
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${colors.fill} transition-[width] duration-75`}
          style={{ width: `${pct}%` }}
        />
        {/* marks */}
        {MARKS.map((m) => (
          <span
            key={m}
            className="absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full bg-white/60"
            style={{ left: `${m}%` }}
          />
        ))}
        {/* thumb */}
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-75"
          style={{ left: `${pct}%` }}
        >
          <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ${colors.thumb} shadow-lg ${colors.shadow}`}>
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
          {/* bubble */}
          <div className={`absolute -top-9 left-1/2 -translate-x-1/2 rounded-lg ${colors.bubble} px-2.5 py-1 text-[12px] font-bold text-white shadow-lg`}>
            {pct}
            <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 ${colors.bubble}`} />
          </div>
        </div>
      </div>
      {/* scale */}
      <div className="flex justify-between px-0.5">
        {MARKS.filter((_, i) => i % 2 === 0).map((m) => (
          <span key={m} className="text-[10px] font-medium text-slate-400">{m}</span>
        ))}
      </div>
    </div>
  )
}
