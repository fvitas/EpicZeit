import { CLOCK_VIEW } from '@ui/components/clock/types.js'
import { CLOCK_WIDTH } from './clock-utils.js'
import classes from './timezone.module.css'

export function ClockPickerPointer({ type, show24h = false, value }) {
  const getAngleStyle = () => {
    const max = type === CLOCK_VIEW.HOURS ? 12 : 60
    let angle = (360 / max) * value

    const isInner = show24h && type === CLOCK_VIEW.HOURS && (value < 1 || value > 12)

    return {
      height: Math.round((isInner ? 0.26 : 0.4) * CLOCK_WIDTH),
      transform: `rotateZ(${angle}deg)`,
    }
  }

  return (
    <div className={classes.MuiClockPointerRoot} style={getAngleStyle()}>
      <div className={classes.MuiClockPointerThumb}></div>
    </div>
  )
}
