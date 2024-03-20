import { useResizeObserver } from '@mantine/hooks'
import { IconHome, IconTrash } from '@tabler/icons-react'
import { LocationLabelWithDialog } from '@ui/components/LocationLabelWithDialog.jsx'
import { ClockPicker } from '@ui/components/clock/ClockPicker.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/components/ui/tooltip.jsx'
import { useTimezoneSettings } from '@ui/state/settings.js'
import { actions, useEpicZeitState, useHomeTimezone } from '@ui/state/state.js'
import { cn } from '@ui/utils.js'
import chroma from 'chroma-js'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce.js'
import { memo } from 'react'

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

function getTimezoneOffset(timezone, homeTimezone = 'UTC') {
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

const OffsetFromHomeWithTooltip = memo(function ({ timezone, timezoneName, homeTimezoneName }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger onClick={() => actions.changeHome(timezone)}>
          {getTimezoneOffset(timezoneName, homeTimezoneName)}
        </TooltipTrigger>

        <TooltipContent>
          <p>Select as home</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

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

  let debounceChange = debounce(([hours, minutes, amPm = '']) => {
    actions.editTimezoneTime(timezone, hours, minutes, amPm.toLowerCase())
  }, 10)

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
        <Popover>
          <PopoverTrigger>
            <label className="flex flex-wrap justify-center">
              <span className={showBoldHour ? 'font-semibold' : ''}>{hours}</span>
              <span>:</span>
              <span>
                {minutes}
                {!show24h ? <span className="text-3xl">{amPm}</span> : null}
              </span>
            </label>
          </PopoverTrigger>

          <PopoverContent className="w-auto">
            <ClockPicker show24h={show24h} hours={hours} minutes={minutes} amPm={amPm} onClockChange={debounceChange} />
          </PopoverContent>
        </Popover>
      </div>

      {showDate ? (
        <div className="text-center" style={{ fontSize: 'clamp(1.3rem, 1vw + 0.75rem, 1.8rem)' }}>
          {weekDay}, {addSuffix(dayOfTheMonth)}
        </div>
      ) : null}

      <br className="my-5" />

      <div className="text-center">
        <ul className="inline-block text-left space-y-2">
          {timezone.locations.map(location => (
            <li key={location.id} className="flex items-center" style={{ maxWidth: rect.width }}>
              {showFlags ? (
                <span
                  className={cn(
                    `fi fi-xx fi-${location?.countryCode?.toLowerCase()}`,
                    'h-5 !w-auto aspect-[4/3] mr-2 rounded-[3px] shadow-sm max-width-[200px] flex-shrink-0',
                  )}></span>
              ) : null}

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
        {!offsetFromHome ? (
          getTimezoneOffset(timezone.locations[0].timezone)
        ) : timezone.isHome ? (
          <IconHome size={24} stroke={1.5} className="-translate-y-0.5" />
        ) : (
          <OffsetFromHomeWithTooltip
            timezone={timezone}
            timezoneName={timezone.locations[0].timezone}
            homeTimezoneName={homeTimezone?.locations[0]?.timezone}
          />
        )}
      </div>
    </div>
  )
}
