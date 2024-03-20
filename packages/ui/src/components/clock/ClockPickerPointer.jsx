import { CLOCK_VIEW } from '@ui/components/clock/types.js'
import { CLOCK_SIZE } from './clock-utils.js'

export function ClockPickerPointer({ type, show24h = false, value }) {
  const getAngleStyle = () => {
    const max = type === CLOCK_VIEW.HOURS ? 12 : 60
    let angle = (360 / max) * value

    const isInner = show24h && type === CLOCK_VIEW.HOURS && (value < 1 || value > 12)

    return {
      height: Math.round((isInner ? 0.26 : 0.4) * CLOCK_SIZE),
      transform: `rotateZ(${angle}deg)`,
    }
  }

  return (
    <div
      className="absolute bottom-1/2 left-[calc(50%-1px)] w-0.5 origin-[center_bottom] bg-primary"
      style={getAngleStyle()}>
      <div className="absolute top-[-21px] left-[calc(50%-18px)] w-1 h-1 box-content border-[16px] border-primary rounded-full bg-primary"></div>
    </div>
  )
}
