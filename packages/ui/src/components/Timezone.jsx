import { useResizeObserver } from '@mantine/hooks'
import { IconHome, IconTrash } from '@tabler/icons-react'
import { LocationLabelWithDialog } from '@ui/components/LocationLabelWithDialog.jsx'
import { Button } from '@ui/components/ui/button.jsx'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover.jsx'
import { ToggleGroup, ToggleGroupItem } from '@ui/components/ui/toggle-group.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/components/ui/tooltip.jsx'
import { useTimezoneSettings } from '@ui/state/settings.js'
import { actions, useEpicZeitState, useHomeTimezone } from '@ui/state/state.js'
import { cn } from '@ui/utils.js'
import chroma from 'chroma-js'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce.js'
import { useEffect, useState } from 'react'
import { When } from 'react-if'
import classes from './timezone.module.css'

export function generateTextColor(backgroundColor) {
  let contrastWithWhite = chroma.contrast(backgroundColor, 'white')
  let contrastWithBlack = chroma.contrast(backgroundColor, 'black')

  return contrastWithWhite > contrastWithBlack ? 'white' : 'black'
}

function generateColors(palette, timezone, currentTime) {
  let offset = getOffset(timezone)
  let hourOffset = parseInt(offset)

  if (palette.isDynamic) {
    let hour = currentTime.tz(timezone).format('HH')
    let backgroundColor = palette.colors[Number(hour)]

    return {
      backgroundColor: backgroundColor,
      background: `linear-gradient(to bottom, ${backgroundColor}, ${palette.colors[(24 + Number(hour) - 2) % 24]})`,
      color: generateTextColor(backgroundColor),
    }
  }

  let backgroundColor = 'white'

  if (offset.includes(':')) {
    if (hourOffset > 0) {
      backgroundColor = chroma.scale([palette.colors[hourOffset + 12], palette.colors[hourOffset + 12 + 1]])(0.5)
    } else {
      backgroundColor = chroma.scale([palette.colors[hourOffset + 12 - 1], palette.colors[hourOffset + 12]])(0.5)
    }
  } else {
    backgroundColor = palette.colors[hourOffset + 12]
  }

  return {
    backgroundColor: backgroundColor,
    color: generateTextColor(backgroundColor),
  }
}

function getOffset(timezone, date = new Date()) {
  // dayjs().utcOffset()

  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
  })
  let [, sign = '+', hour = 0, minutes = 0] = formatter.format(date).match(/\d+|\+|-/g)

  return sign + hour + (minutes ? ':' + minutes : '')
}

function getOffsetFromHome(timezone, homeTimezone = 'UTC') {
  let homeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: homeTimezone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
  })
  let [, homeSign = '+', homeHour = '0', homeMinutes = '0'] = homeFormatter.format(new Date()).match(/\d+|\+|-/g)

  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
  })
  let [, sign = '+', hour = '0', minutes = '0'] = formatter.format(new Date()).match(/\d+|\+|-/g)

  let difference = Number(sign + hour) * 60 + Number(minutes) - (Number(homeSign + homeHour) * 60 + Number(homeMinutes))

  let resultSign = difference > 0 ? '+' : '-'
  let resultHour = Math.abs(difference) < 60 ? Math.abs(difference) : Math.floor(Math.abs(difference) / 60)
  let resultMinutes = Math.abs(difference % 60)

  if (!resultHour && !resultMinutes) {
    return 0
  }

  return resultSign + resultHour + (resultMinutes > 0 ? ':' + String(resultMinutes).padStart(2, '0') : '')

  // let homeTimezone = dayjs.tz('2023-11-18 15:55', homeTimezoneName)
  // let destinationTimezone = dayjs.tz('2023-11-18 15:55', timezoneName)
  // let difference = destinationTimezone.diff(homeTimezone, 'minutes')
  //
  // let resultSign = difference > 0 ? '+' : '-'
  // let resultHour = Math.abs(difference) < 60 ? Math.abs(difference) : Math.floor(Math.abs(difference) / 60)
  // let resultMinutes = Math.abs(difference % 60)
  //
  // return resultSign + resultHour + (resultMinutes > 0 ? ':' + String(resultMinutes).padStart(2, '0') : '')
}

function addSuffix(number) {
  if (number > 3 && number < 21) return number + 'th'

  switch (number % 10) {
    case 1:
      return number + 'st'
    case 2:
      return number + 'nd'
    case 3:
      return number + 'rd'
    default:
      return number + 'th'
  }
}

function getFormattedTime(timezone, show24h, currentTime) {
  const formatTime = show24h ? 'ddd D HH mm' : 'ddd D hh mm a'

  return dayjs.utc(currentTime).tz(timezone).format(formatTime).split(' ')
}

function ClockPicker({ show24h = true, hours = '', minutes = '', amPm, onClockChange, onSave, onCancel }) {
  // TODO (filipv): check am pm settings
  const [clockPickerHours, setClockPickerHours] = useState(hours)
  const [clockPickerMinutes, setClockPickerMinutes] = useState(minutes)

  useEffect(() => {
    setClockPickerHours(hours)
    setClockPickerMinutes(minutes)
  }, [hours, minutes])

  function onHourKeyDown(event) {
    if (event.code === 'ArrowUp') {
      event.preventDefault()
      let newClockHour = Number(clockPickerHours) + 1
      if (newClockHour >= 24) {
        newClockHour = 0
      }
      onClockChange([String(newClockHour).padStart(2, '0'), clockPickerMinutes, amPm])
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault()
      let newClockHour = Number(clockPickerHours) - 1
      if (newClockHour < 0) {
        newClockHour = 23
      }
      onClockChange([String(newClockHour).padStart(2, '0'), clockPickerMinutes, amPm])
    }
  }

  function onHourKeyUp(event) {
    if (Number.isNaN(Number(event.target.value)) || Number(event.target.value) < 0) {
      return
    }

    if (event.target.value.length > 2) {
      let valueArray = [...event.target.value]
      valueArray.shift()
      let newHourString = valueArray.join('')
      // TODO (filipv): check am/pm
      if (Number(newHourString) >= 24) {
        onClockChange(['0' + valueArray.pop(), clockPickerMinutes, amPm])
        return
      }
      onClockChange([newHourString, clockPickerMinutes, amPm])
      return
    }

    if (event.target.value === '') {
      onClockChange(['00', clockPickerMinutes, amPm])
      return
    }

    onClockChange([event.target.value, clockPickerMinutes, amPm])
  }

  function onMinutesKeyDown(event) {
    if (event.code === 'ArrowUp') {
      event.preventDefault()
      let newClockMinutes = Number(clockPickerMinutes) + 1
      if (newClockMinutes >= 60) {
        newClockMinutes = 0
      }
      onClockChange([clockPickerHours, String(newClockMinutes).padStart(2, '0'), amPm])
    }
    if (event.code === 'ArrowDown') {
      event.preventDefault()
      let newClockMinutes = Number(clockPickerMinutes) - 1
      if (newClockMinutes < 0) {
        newClockMinutes = 59
      }
      onClockChange([clockPickerHours, String(newClockMinutes).padStart(2, '0'), amPm])
    }
  }

  function onMinutesKeyUp(event) {
    if (Number.isNaN(Number(event.target.value)) || Number(event.target.value) < 0) {
      return
    }

    if (event.target.value.length > 2) {
      let valueArray = [...event.target.value]
      valueArray.shift()
      let newMinutesString = valueArray.join('')
      if (Number(newMinutesString) >= 60) {
        onClockChange([clockPickerHours, '0' + valueArray.pop(), amPm])
        return
      }
      onClockChange([clockPickerHours, newMinutesString, amPm])
      return
    }

    if (event.target.value === '') {
      onClockChange([clockPickerHours, '00', amPm])
      return
    }

    onClockChange([clockPickerHours, event.target.value, amPm])
  }

  return (
    <div>
      <div className="timepicker-ui-select-time timepicker-ui-normalize">Select Time</div>
      <div className="flex gap-2 ">
        <input
          className={classes.input}
          autoComplete="false"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          value={clockPickerHours}
          onKeyDown={onHourKeyDown}
          onChange={onHourKeyUp}
        />

        <span className="text-[50px] font-[none]">:</span>

        <input
          className={classes.input}
          autoComplete="false"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          value={clockPickerMinutes}
          onKeyDown={onMinutesKeyDown}
          onKeyUp={onMinutesKeyUp}
        />

        <div className="flex flex-col">
          <ToggleGroup
            type="single"
            orientation="vertical"
            className="flex flex-col gap-0"
            value={amPm}
            aria-label="am or pm"
            onValueChange={amPmValue => onClockChange([clockPickerHours, clockPickerMinutes, amPmValue])}>
            <ToggleGroupItem
              value="am"
              className="text-base font-normal border border-border border-b-0 rounded-b-none ">
              AM
            </ToggleGroupItem>
            <ToggleGroupItem
              value="pm"
              className="text-base font-normal border border-border border-t-0 rounded-t-none ">
              PM
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className={classes.clockpickerGroup + ' clockpicker-dial clockpicker-hours flex relative visible'}>
        <div className="clockpicker-tick" style={{ left: '87px', top: '7px' }}>
          00
        </div>
        <div className="clockpicker-tick" style={{ left: '114px', top: '40.2346px', fontSize: '120%' }}>
          1
        </div>
        <div className="clockpicker-tick" style={{ left: '133.765px', top: '60px', fontSize: '120%' }}>
          2
        </div>
        <div className="clockpicker-tick" style={{ left: '141px', top: '87px', fontSize: '120%' }}>
          3
        </div>
        <div className="clockpicker-tick" style={{ left: '133.765px', top: '114px', fontSize: '120%' }}>
          4
        </div>
        <div className="clockpicker-tick" style={{ left: '114px', top: '133.765px', fontSize: '120%' }}>
          5
        </div>
        <div className="clockpicker-tick" style={{ left: '87px', top: '141px', fontSize: '120%' }}>
          6
        </div>
        <div className="clockpicker-tick" style={{ left: '60px', top: '133.765px', fontSize: '120%' }}>
          7
        </div>
        <div className="clockpicker-tick" style={{ left: '40.2346px', top: '114px', fontSize: '120%' }}>
          8
        </div>
        <div className="clockpicker-tick" style={{ left: '33px', top: '87px', fontSize: '120%' }}>
          9
        </div>
        <div className="clockpicker-tick" style={{ left: '40.2346px', top: '60px', fontSize: '120%' }}>
          10
        </div>
        <div className="clockpicker-tick" style={{ left: '60px', top: '40.2346px', fontSize: '120%' }}>
          11
        </div>
        <div className="clockpicker-tick" style={{ left: '87px', top: '33px', fontSize: '120%' }}>
          12
        </div>
        <div className="clockpicker-tick" style={{ left: '127px', top: '17.718px' }}>
          13
        </div>
        <div className="clockpicker-tick" style={{ left: '156.282px', top: '47px' }}>
          14
        </div>
        <div className="clockpicker-tick" style={{ left: '167px', top: '87px' }}>
          15
        </div>
        <div className="clockpicker-tick" style={{ left: '156.282px', top: '127px' }}>
          16
        </div>
        <div className="clockpicker-tick" style={{ left: '127px', top: '156.282px' }}>
          17
        </div>
        <div className="clockpicker-tick" style={{ left: '87px', top: '167px' }}>
          18
        </div>
        <div className="clockpicker-tick" style={{ left: '47px', top: '156.282px' }}>
          19
        </div>
        <div className="clockpicker-tick" style={{ left: '17.718px', top: '127px' }}>
          20
        </div>
        <div className="clockpicker-tick" style={{ left: '7px', top: '87px' }}>
          21
        </div>
        <div className="clockpicker-tick" style={{ left: '17.718px', top: '47px' }}>
          22
        </div>
        <div className="clockpicker-tick" style={{ left: '47px', top: '17.718px' }}>
          23
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <PopoverClose asChild>
          <Button variant="outline">Cancel</Button>
        </PopoverClose>

        <Button>Save</Button>
      </div>
    </div>
  )
}

export function Timezone({ currentTime, timezone }) {
  const { showFlags, showDate, show24h, showBoldHour, offsetFromHome } = useTimezoneSettings()
  const homeTimezone = useHomeTimezone()
  const { currentPalette, previewPalette } = useEpicZeitState()
  const palette = previewPalette ?? currentPalette

  const [ref, rect] = useResizeObserver()

  let [weekDay, dayOfTheMonth, hours, minutes, amPm] = getFormattedTime(
    timezone.locations[0].timezone,
    show24h,
    currentTime,
  )

  function deleteTimezone() {
    actions.deleteTimezone(timezone)
  }

  function deleteTimezoneOnKeyDown(event) {
    if (event.code === 'Enter' || event.code === 'Space') {
      actions.deleteTimezone(timezone)
    }
  }

  // TODO (filipv): create your own time clock picker
  // useEffect(() => {
  //   $('.clockpicker-' + timezone.offset).clockpicker({
  //     twelvehour: !show24h,
  //     placement: 'bottom',
  //     align: 'left',
  //     autoclose: true,
  //     onChange: debounce(([hours, minutes, amPm = '']) => {
  //       actions.editTimezoneTime(timezone, hours, minutes, amPm.toLowerCase())
  //     }, 10),
  //     onDismiss: () => {
  //       actions.resetTime()
  //     },
  //   })
  // }, [show24h])

  let debounceChange = debounce(([hours, minutes, amPm = '']) => {
    console.log(hours, minutes, amPm)
    actions.editTimezoneTime(timezone, hours, minutes, amPm.toLowerCase())
  }, 0)

  return (
    <div
      ref={ref}
      className="group relative h-full flex-1 min-w-[190px] space-y-1 px-5 pt-[33vh] overflow-hidden hover:visible"
      style={generateColors(palette, timezone.locations[0].timezone, currentTime)}>
      <div
        style={{
          fontSize: show24h
            ? `clamp(2.4rem, calc(${rect.width}px / 3.5), 5rem)`
            : `clamp(1.7rem, calc(${rect.width}px / 5), 5rem)`,
        }}
        className="text-center px-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        {/*<div className={'inline-block ' + 'clockpicker-' + timezone.offset}>*/}
        {/*  <label htmlFor={`time-${timezone.offset}`} className="flex flex-wrap justify-center cursor-pointer">*/}
        {/*    <span className={showBoldHour ? 'font-semibold' : ''}>{hours}</span>*/}
        {/*    <span>:</span>*/}
        {/*    <span>*/}
        {/*      {minutes}*/}
        {/*      <When condition={!show24h}>*/}
        {/*        <span className="text-3xl">{amPm}</span>*/}
        {/*      </When>*/}
        {/*    </span>*/}
        {/*  </label>*/}

        {/*  <input*/}
        {/*    id={`time-${timezone.offset}`}*/}
        {/*    className="form-control sr-only"*/}
        {/*    tabIndex="-1"*/}
        {/*    value={`${hours}:${minutes}${amPm ? ':' + amPm : ''}`}*/}
        {/*    onChange={() => {}}*/}
        {/*  />*/}
        {/*</div>*/}

        <Popover>
          <PopoverTrigger>
            <label className="flex flex-wrap justify-center">
              <span className={showBoldHour ? 'font-semibold' : ''}>{hours}</span>
              <span>:</span>
              <span>
                {minutes}
                <When condition={!show24h}>
                  <span className="text-3xl">{amPm}</span>
                </When>
              </span>
            </label>
          </PopoverTrigger>

          <PopoverContent className="w-auto">
            <ClockPicker
              show24h={show24h}
              hours={hours}
              minutes={minutes}
              amPm={amPm}
              onClockChange={debounceChange}
              onSave={() => {}}
              onCancel={() => {
                actions.resetTime()
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <When condition={showDate}>
        <div className="text-center" style={{ fontSize: 'clamp(1.3rem, 1vw + 0.75rem, 1.8rem)' }}>
          {weekDay}, {addSuffix(dayOfTheMonth)}
        </div>
      </When>

      <br className="my-5" />

      <div className="text-center">
        <ul className="inline-block text-left space-y-2">
          {timezone.locations.map(location => (
            <li key={location.id} className="flex items-center" style={{ maxWidth: rect.width }}>
              <When condition={showFlags}>
                <span
                  className={cn(
                    `fi fi-xx fi-${location?.countryCode?.toLowerCase()}`,
                    'h-5 !w-auto aspect-[4/3] mr-2 rounded-[3px] shadow-sm max-width-[200px] flex-shrink-0',
                  )}></span>
              </When>

              <LocationLabelWithDialog location={location} />
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-20 left-1/2 translate-x-[-50%] translate-y-[-20%] flex flex-col gap-4 invisible group-hover:visible group-focus-within:visible">
        <IconTrash
          stroke={1.5}
          className="cursor-pointer"
          onClick={deleteTimezone}
          onKeyDown={deleteTimezoneOnKeyDown}
          tabIndex={0}
          title="Delete timezone"
        />
      </div>

      <div className="absolute bottom-10 left-1/2 translate-x-[-50%] text-lg">
        <When condition={offsetFromHome}>
          <When condition={timezone.isHome}>
            <IconHome size={24} stroke={1.5} className="-translate-y-0.5" />
          </When>

          <When condition={!timezone.isHome}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger onClick={() => actions.changeHome(timezone)}>
                  {getOffsetFromHome(timezone.locations[0].timezone, homeTimezone?.locations[0]?.timezone)}
                </TooltipTrigger>

                <TooltipContent>
                  <p>Select as home</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </When>
        </When>

        <When condition={!offsetFromHome}>{getOffsetFromHome(timezone.locations[0].timezone)}</When>
      </div>
    </div>
  )
}
