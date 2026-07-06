import { useState } from 'react'
import { cn } from '../../utils/cn'

export default function Avatar({ src, name = '?', size = 'h-8 w-8', textSize = 'text-xs', className }) {
  const [imgError, setImgError] = useState(false)
  const initial = name.charAt(0).toUpperCase()

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('shrink-0 rounded-full object-cover', size, className)}
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      className={cn(
        'shrink-0 flex items-center justify-center rounded-full font-bold text-white bg-[#1565c0]',
        size,
        textSize,
        className
      )}
    >
      {initial}
    </div>
  )
}
