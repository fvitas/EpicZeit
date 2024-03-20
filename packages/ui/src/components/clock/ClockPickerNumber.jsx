import { cn } from '@ui/utils.js'
import { CLOCK_NUMBER_SIZE, CLOCK_SIZE } from './clock-utils.js'

export function ClockNumber(props) {
  const { index, isInner, isSelected, label } = props

  const angle = ((index % 12) / 12) * Math.PI * 2 - Math.PI / 2
  const length = ((CLOCK_SIZE - CLOCK_NUMBER_SIZE - 2) / 2) * (isInner ? 0.65 : 1)
  const x = Math.cos(angle) * length
  const y = Math.sin(angle) * length

  return (
    <span
      className={cn('absolute inline-flex justify-center items-center rounded-full', isSelected && 'text-white')}
      style={{
        height: CLOCK_NUMBER_SIZE,
        width: CLOCK_NUMBER_SIZE,
        left: `calc((100% - ${CLOCK_NUMBER_SIZE}px) / 2)`,
        transform: `translate(${x}px, ${y + (CLOCK_SIZE - CLOCK_NUMBER_SIZE) / 2}px`,
      }}>
      {label}
    </span>
  )
}
