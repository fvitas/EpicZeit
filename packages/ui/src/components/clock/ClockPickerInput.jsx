import { CLOCK_VIEW } from '@ui/components/clock/types.js'
import classes from './timezone.module.css'

export function ClockPickerInput({ value, show24h, type, onChange, onFocus }) {
  function onKeyDown(event) {
    if (event.code === 'ArrowUp') {
      event.preventDefault()
      let newValue = Number(value) + 1

      if (type === CLOCK_VIEW.HOURS) {
        if (show24h) {
          newValue %= 24
        } else {
          newValue %= 12
        }
        onChange(String(newValue).padStart(2, '0'))
      }

      if (type === CLOCK_VIEW.MINUTES) {
        newValue %= 60
        onChange(String(newValue).padStart(2, '0'))
      }
    }

    if (event.code === 'ArrowDown') {
      event.preventDefault()
      let newValue = Number(value) - 1

      if (type === CLOCK_VIEW.HOURS) {
        if (show24h) {
          newValue = (newValue + 24) % 24
        } else {
          newValue = (newValue + 12) % 12
        }
        onChange(String(newValue).padStart(2, '0'))
      }

      if (type === CLOCK_VIEW.MINUTES) {
        if (newValue < 0) {
          newValue = 59
        }
        onChange(String(newValue).padStart(2, '0'))
      }
    }
  }

  function onInputChange(event) {
    if (
      Number.isNaN(Number(event.target.value)) ||
      Number(event.target.value) < 0 ||
      event.target.value.includes('.')
    ) {
      return
    }

    if (event.target.value === '') {
      onChange('00')
      return
    }

    if (event.target.value.length > 2) {
      let valueArray = [...event.target.value]
      valueArray.shift()
      let newValueString = valueArray.join('')
      let newValue = Number(newValueString)

      if (type === CLOCK_VIEW.HOURS && ((show24h && newValue >= 24) || (!show24h && newValue >= 12))) {
        onChange('0' + valueArray.pop())
        return
      }

      if (type === CLOCK_VIEW.MINUTES && newValue >= 60) {
        onChange('0' + valueArray.pop())
        return
      }

      onChange(newValueString)
      return
    }

    onChange(event.target.value)
  }

  return (
    <input
      className={classes.input + ' focus-visible:bg-primary/10'}
      autoComplete="false"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      type="number"
      value={value}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onChange={onInputChange}
    />
  )
}
