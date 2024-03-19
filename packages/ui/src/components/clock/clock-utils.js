export const CLOCK_WIDTH = 220
export const CLOCK_HOUR_WIDTH = 36

const clockCenter = {
  x: CLOCK_WIDTH / 2,
  y: CLOCK_WIDTH / 2,
}

const baseClockPoint = {
  x: clockCenter.x,
  y: 0,
}

const cx = baseClockPoint.x - clockCenter.x
const cy = baseClockPoint.y - clockCenter.y

function rad2deg(rad) {
  return rad * (180 / Math.PI)
}

function getAngleValue(step, offsetX, offsetY) {
  const x = offsetX - clockCenter.x
  const y = offsetY - clockCenter.y

  const atan = Math.atan2(cx, cy) - Math.atan2(x, y)

  let deg = rad2deg(atan)
  deg = Math.round(deg / step) * step
  deg %= 360

  const value = Math.floor(deg / step) || 0
  const delta = x ** 2 + y ** 2
  const distance = Math.sqrt(delta)

  return { value, distance }
}

export function getMinutes(offsetX, offsetY, step = 1) {
  const angleStep = step * 6
  let { value } = getAngleValue(angleStep, offsetX, offsetY)
  value = (value * step) % 60

  return value
}

export function getHours(offsetX, offsetY, showAmPm) {
  const { value, distance } = getAngleValue(30, offsetX, offsetY)
  let hour = value || 12

  if (showAmPm) {
    hour %= 12
    if (hour === 0) hour = 12

    return hour
  }

  if (distance < CLOCK_WIDTH / 2 - CLOCK_HOUR_WIDTH) {
    hour += 12
    hour %= 24
  }

  return hour
}
