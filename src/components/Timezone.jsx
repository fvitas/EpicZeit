import { LocationLabelWithDialog } from '@/components/LocationLabelWithDialog.jsx'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.jsx'
import { usePaletteSettings } from '@/state/palette.js'
import { useTimezoneSettings } from '@/state/settings.js'
import { actions } from '@/state/state.js'
import { cn } from '@/utils.js'
import { useResizeObserver } from '@mantine/hooks'
import { IconHome, IconTrash } from '@tabler/icons-react'
import chroma from 'chroma-js'
import { useEffect } from 'react'
import { When } from 'react-if'

// const colors = chroma.scale(['white', 'blue']).mode('hsl').correctLightness().colors(25)
// const colors = chroma.scale(['#392467', '#5D3587', '#A367B1', '#FFD1E3']).mode('hsl').correctLightness().colors(25)
// const colors = chroma.scale(['#222831', '#393E46', '#00ADB5', '#EEEEEE']).mode('hsl').colors(25)
// lab hsl lch oklab oklch
// const colors = chroma.scale(['#FFECD6', '#4CB9E7', '#3559E0', '#0F2167']).mode('hsl').correctLightness().colors(25)
// const colors = chroma.scale(['black', 'red', 'yellow', 'white']).mode('hsl').colors(25)

export function generateTextColor(backgroundColor) {
  let contrastWithWhite = chroma.contrast(backgroundColor, 'white')
  let contrastWithBlack = chroma.contrast(backgroundColor, 'black')

  return contrastWithWhite > contrastWithBlack ? 'white' : 'black'
}

function generateColors(palette, timezone) {
  let offset = getOffset(timezone)
  let hourOffset = parseInt(offset)

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

;['Asia/Kolkata', 'Australia/Sydney', 'America/New_York'].forEach(timezone => console.log(getOffset(timezone)))

function getOffset(timezone, date = new Date()) {
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

  return resultSign + resultHour + (resultMinutes > 0 ? ':' + String(resultMinutes).padStart(2, '0') : '')
}

function getWeekday(timezone, date = new Date()) {
  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    weekday: 'short',
  })

  return formatter.format(date)
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

function getDay(timezone, date = new Date()) {
  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    day: 'numeric',
  })

  return Number(formatter.format(date))
}

function getTime(timezone, date = new Date()) {
  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    timeStyle: 'short',
    hour12: false,
  })

  return formatter.format(date).split(':')
}

export function Timezone({ currentTime, timezone, homeTimezone }) {
  const { showFlags, showDate, showBoldHour, offsetFromHome } = useTimezoneSettings()
  const { currentPalette, previewPalette } = usePaletteSettings()
  const palette = previewPalette ?? currentPalette
  const [ref, rect] = useResizeObserver()

  let [hours, minutes] = getTime(timezone.locations[0].timezone, currentTime)

  useEffect(() => {
    $('.clockpicker-' + timezone.offset).clockpicker({
      twelvehour: false,
      placement: 'bottom',
      align: 'left',
      autoclose: true,
      onChange: ([hours, minutes, amPm]) => {
        actions.editTimezoneTime(timezone, hours, minutes, amPm)
      },
    })
  }, [])

  return (
    <div
      ref={ref}
      className="group relative h-full flex-1 space-y-1 px-5 pt-[33vh] overflow-hidden hover:visible"
      style={generateColors(palette, timezone.locations[0].timezone)}>
      <div className="text-center">{timezone.locations[0].timezone}</div>

      <div
        style={{ fontSize: 'clamp(1rem, 0.5rem + 3.5vw, 5rem)' }}
        className="text-center px-2 focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
        <div className={'inline-block ' + 'clockpicker-' + timezone.offset}>
          <label htmlFor={`time-${timezone.offset}`} className="flex flex-wrap justify-center">
            <span className={showBoldHour ? 'font-semibold' : ''}>{hours}</span>
            <span>:</span>
            <span className="">{minutes}</span>
          </label>

          <input
            id={`time-${timezone.offset}`}
            className="form-control sr-only"
            tabIndex="-1"
            value={`${hours}:${minutes}`}
            onChange={() => {}}
          />
        </div>
      </div>

      <When condition={showDate}>
        <div className="text-center" style={{ fontSize: 'clamp(1rem, 1vw + 0.75rem, 1.5rem)' }}>
          {getWeekday(timezone.locations[0].timezone)}, {addSuffix(getDay(timezone.locations[0].timezone))}
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
                    `fi fi-${location.countryCode.toLowerCase()}`,
                    'h-5 !w-auto aspect-[4/3] mr-2 rounded-[3px] shadow-sm max-width-[200px] flex-shrink-0',
                  )}></span>
              </When>

              <LocationLabelWithDialog location={location} />
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-20 left-1/2 translate-x-[-50%] translate-y-[-20%] flex flex-col gap-4 invisible group-hover:visible">
        <IconTrash
          stroke={1.5}
          className="cursor-pointer"
          onClick={() => actions.deleteTimezone(timezone)}
          title="Delete timezone"
        />
      </div>

      <div className="absolute bottom-10 left-1/2 translate-x-[-50%]">
        <When condition={offsetFromHome}>
          <When condition={timezone.isHome}>
            <IconHome size={24} stroke={1.5} />
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
