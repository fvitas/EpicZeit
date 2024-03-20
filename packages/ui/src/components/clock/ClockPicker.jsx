import { Button } from '@ui/components/ui/button.jsx'
import { PopoverClose } from '@ui/components/ui/popover.jsx'
import { ToggleGroup, ToggleGroupItem } from '@ui/components/ui/toggle-group.jsx'
import useMousePosition from '@ui/hooks/useMousePosition.js'
import { useCallback, useRef, useState } from 'react'
import { ClockPickerInput } from './ClockPickerInput.jsx'
import { ClockNumber } from './ClockPickerNumber.jsx'
import { ClockPickerPointer } from './ClockPickerPointer.jsx'
import { CLOCK_SIZE, getHours, getMinutes } from './clock-utils.js'
import { CLOCK_VIEW } from './types.js'

const clockNumbers12hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const clockNumbers24hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const clockNumbersMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

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

        {!show24h ? (
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
        ) : null}
      </div>

      <div className="flex justify-center items-center">
        <div
          className="relative rounded-full bg-primary/10 pointer-events-none"
          style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}>
          <div
            className="absolute w-full h-full rounded-full outline-0 pointer-events-auto select-none touch-none"
            ref={ref}></div>
          <div className="absolute w-[6px] h-[6px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"></div>

          <ClockPickerPointer
            type={currentView}
            show24h={show24h}
            value={currentView === CLOCK_VIEW.HOURS ? hours : minutes}
          />

          {currentView === CLOCK_VIEW.HOURS ? (
            show24h ? (
              <div>
                {clockNumbers24hours.map((hourNumber, index) => (
                  <ClockNumber
                    key={hourNumber}
                    index={index}
                    isSelected={Number(hours) === hourNumber}
                    isInner={hourNumber < 1 || hourNumber > 12}
                    label={hourNumber === 0 ? '00' : String(hourNumber)}
                  />
                ))}
              </div>
            ) : (
              <div>
                {clockNumbers12hours.map((hourNumber, index) => (
                  <ClockNumber
                    key={hourNumber}
                    index={index + 1}
                    isSelected={Number(hours) === hourNumber}
                    isInner={false}
                    label={String(hourNumber)}
                  />
                ))}
              </div>
            )
          ) : null}

          {currentView === CLOCK_VIEW.MINUTES ? (
            <div>
              {clockNumbersMinutes.map((minuteNumber, index) => (
                <ClockNumber
                  key={minuteNumber}
                  index={index}
                  isSelected={Number(minutes) === minuteNumber}
                  isInner={false}
                  label={String(minuteNumber).padStart(2, '0')}
                />
              ))}
            </div>
          ) : null}
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
