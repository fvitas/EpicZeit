import { Button } from '@ui/components/ui/button.jsx'
import { PopoverClose } from '@ui/components/ui/popover.jsx'
import { ToggleGroup, ToggleGroupItem } from '@ui/components/ui/toggle-group.jsx'
import useMousePosition from '@ui/hooks/useMousePosition.js'
import { cn } from '@ui/utils.js'
import { useCallback, useRef, useState } from 'react'
import { When } from 'react-if'
import { ClockPickerInput } from './ClockPickerInput.jsx'
import { ClockPickerPointer } from './ClockPickerPointer.jsx'
import { getHours, getMinutes } from './clock-utils.js'
import classes from './timezone.module.css'
import { CLOCK_VIEW } from './types.js'

export function ClockPicker(props) {
  const { show24h = true, hours = '', minutes = '', amPm = '', onClockChange } = props

  const [currentView, setCurrentView] = useState(CLOCK_VIEW.HOURS)

  const selectedHour = useRef(0)
  const selectedMinute = useRef(0)

  const resetTime = useCallback(() => {
    onClockChange([hours, minutes, amPm])
  }, [])

  const [ref] = useMousePosition(({ offsetX, offsetY }) => {
    const newValue =
      currentView === CLOCK_VIEW.HOURS ? getHours(offsetX, offsetY, Boolean(amPm)) : getMinutes(offsetX, offsetY)

    if (currentView === CLOCK_VIEW.HOURS && selectedHour.current !== newValue) {
      selectedHour.current = newValue
      onClockChange([String(newValue).padStart(2, '0'), minutes, amPm])
    }

    if (currentView === CLOCK_VIEW.MINUTES && selectedMinute.current !== newValue) {
      selectedMinute.current = newValue
      onClockChange([hours, String(newValue).padStart(2, '0'), amPm])
    }
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="timepicker-ui-select-time timepicker-ui-normalize">Select Time</div>
      <div className="flex">
        <ClockPickerInput
          type="hours"
          show24h={show24h}
          value={hours}
          onChange={newHoursValue => onClockChange([newHoursValue, minutes, amPm])}
          onFocus={() => setCurrentView(CLOCK_VIEW.HOURS)}
        />

        <span className="text-[50px] font-[none] mx-1.5">:</span>

        <ClockPickerInput
          type="minutes"
          show24h={show24h}
          value={minutes}
          onChange={newMinutesValue => onClockChange([hours, newMinutesValue, amPm])}
          onFocus={() => setCurrentView(CLOCK_VIEW.MINUTES)}
        />

        <When condition={!show24h}>
          {() => (
            <div className="flex flex-col ml-3">
              <ToggleGroup
                type="single"
                orientation="vertical"
                className="flex flex-col gap-0"
                value={amPm}
                aria-label="am or pm"
                onValueChange={newAmPmValue => onClockChange([hours, minutes, newAmPmValue])}>
                <ToggleGroupItem
                  value="am"
                  className="text-base font-normal border border-border border-b-0 rounded-b-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  AM
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="pm"
                  className="text-base font-normal border border-border border-t-0 rounded-t-none data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
                  PM
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
        </When>
      </div>

      <div className="flex justify-center items-center">
        <div className={classes.MuiClockClock}>
          <div className={classes.MuiClockSquareMask} ref={ref}></div>
          <div className={classes.MuiClockPin}></div>

          <ClockPickerPointer
            type={currentView}
            show24h={show24h}
            value={currentView === CLOCK_VIEW.HOURS ? hours : minutes}
          />

          <When condition={currentView === CLOCK_VIEW.HOURS}>
            {() => (
              <div>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 1 ? ' text-white' : ' ')}
                  style={{ transform: 'translate(45px, 13px)' }}
                  aria-label="1 hours">
                  1
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 2 ? ' text-white' : '')}
                  style={{ transform: 'translate(79px, 47px)' }}
                  aria-label="2 hours">
                  2
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 3 ? ' text-white' : '')}
                  style={{ transform: 'translate(91px, 92px)' }}
                  aria-label="3 hours">
                  3
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 4 ? ' text-white' : '')}
                  style={{ transform: 'translate(79px, 137px)' }}
                  aria-label="4 hours">
                  4
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 5 ? ' text-white' : '')}
                  style={{ transform: 'translate(45px, 171px)' }}
                  aria-label="5 hours">
                  5
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 6 ? ' text-white' : '')}
                  style={{ transform: 'translate(0px, 183px)' }}
                  aria-label="6 hours">
                  6
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 7 ? ' text-white' : '')}
                  style={{ transform: 'translate(-46px, 171px)' }}
                  aria-label="7 hours">
                  7
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 8 ? ' text-white' : '')}
                  style={{ transform: 'translate(-79px, 138px)' }}
                  aria-label="8 hours">
                  8
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 9 ? ' text-white' : '')}
                  style={{ transform: 'translate(-91px, 92px)' }}
                  aria-label="9 hours">
                  9
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 10 ? ' text-white' : '')}
                  style={{ transform: 'translate(-79px, 46px)' }}
                  aria-label="10 hours">
                  10
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 11 ? ' text-white' : '')}
                  style={{ transform: 'translate(-46px, 13px)' }}
                  aria-label="11 hours">
                  11
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(hours) === 12 ? ' text-white' : '')}
                  style={{ transform: 'translate(0px, 1px)' }}
                  aria-label="12 hours">
                  12
                </span>

                <When condition={show24h}>
                  {() => (
                    <>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 13 ? ' text-white' : '')}
                        style={{ transform: 'translate(30px, 41px)' }}
                        aria-label="13 hours">
                        13
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 14 ? ' text-white' : '')}
                        style={{ transform: 'translate(51px, 62px)' }}
                        aria-label="14 hours">
                        14
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 15 ? ' text-white' : '')}
                        aria-selected="true"
                        style={{ transform: 'translate(59px, 92px)' }}
                        id=":R5elb59l6kud6:"
                        aria-label="15 hours">
                        15
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 16 ? ' text-white' : '')}
                        style={{ transform: 'translate(51px, 122px)' }}
                        aria-label="16 hours">
                        16
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 17 ? ' text-white' : '')}
                        style={{ transform: 'translate(30px, 143px)' }}
                        aria-label="17 hours">
                        17
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 18 ? ' text-white' : '')}
                        style={{ transform: 'translate(0px, 151px)' }}
                        aria-label="18 hours">
                        18
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 19 ? ' text-white' : '')}
                        style={{ transform: 'translate(-30px, 143px)' }}
                        aria-label="19 hours">
                        19
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 20 ? ' text-white' : '')}
                        style={{ transform: 'translate(-51px, 122px)' }}
                        aria-label="20 hours">
                        20
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 21 ? ' text-white' : '')}
                        style={{ transform: 'translate(-59px, 92px)' }}
                        aria-label="21 hours">
                        21
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 22 ? ' text-white' : '')}
                        style={{ transform: 'translate(-51px, 62px)' }}
                        aria-label="22 hours">
                        22
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 23 ? ' text-white' : '')}
                        style={{ transform: 'translate(-30px, 41px)' }}
                        aria-label="23 hours">
                        23
                      </span>
                      <span
                        className={cn(classes.MuiClockNumber, Number(hours) === 0 ? ' text-white' : '')}
                        style={{ transform: 'translate(0px, 33px)' }}
                        aria-label="00 hours">
                        00
                      </span>
                    </>
                  )}
                </When>
              </div>
            )}
          </When>

          <When condition={currentView === CLOCK_VIEW.MINUTES}>
            {() => (
              <div>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 0 ? ' text-white' : '')}
                  style={{ transform: 'translate(0px, 1px)' }}
                  aria-label="0 minutes">
                  00
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 5 ? ' text-white' : ' ')}
                  style={{ transform: 'translate(45px, 13px)' }}
                  aria-label="5 minutes">
                  05
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 10 ? ' text-white' : '')}
                  style={{ transform: 'translate(79px, 47px)' }}
                  aria-label="10 minutes">
                  10
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 15 ? ' text-white' : '')}
                  style={{ transform: 'translate(91px, 92px)' }}
                  aria-label="15 minutes">
                  15
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 20 ? ' text-white' : '')}
                  style={{ transform: 'translate(79px, 137px)' }}
                  aria-label="20 minutes">
                  20
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 25 ? ' text-white' : '')}
                  style={{ transform: 'translate(45px, 171px)' }}
                  aria-label="25 minutes">
                  25
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 30 ? ' text-white' : '')}
                  style={{ transform: 'translate(0px, 183px)' }}
                  aria-label="30 minutes">
                  30
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 35 ? ' text-white' : '')}
                  style={{ transform: 'translate(-46px, 171px)' }}
                  aria-label="35 minutes">
                  35
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 40 ? ' text-white' : '')}
                  style={{ transform: 'translate(-79px, 138px)' }}
                  aria-label="40 minutes">
                  40
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 45 ? ' text-white' : '')}
                  style={{ transform: 'translate(-91px, 92px)' }}
                  aria-label="45 minutes">
                  45
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 50 ? ' text-white' : '')}
                  style={{ transform: 'translate(-79px, 46px)' }}
                  aria-label="50 minutes">
                  50
                </span>
                <span
                  className={cn(classes.MuiClockNumber, Number(minutes) === 55 ? ' text-white' : '')}
                  style={{ transform: 'translate(-46px, 13px)' }}
                  aria-label="55 minutes">
                  55
                </span>
              </div>
            )}
          </When>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <PopoverClose asChild>
          <Button variant="outline" onClick={resetTime}>
            Cancel
          </Button>
        </PopoverClose>

        <PopoverClose asChild>
          <Button>Save</Button>
        </PopoverClose>
      </div>
    </div>
  )
}
