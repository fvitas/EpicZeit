import { Timezone } from '@/components/Timezone.jsx'
import { Button } from '@/components/ui/button.jsx'
import { actions, useHomeTimezone, useTimezoneState } from '@/state/state.js'
import { IconWorldSearch } from '@tabler/icons-react'
import { When } from 'react-if'

export function Timezones() {
  const { currentTime, showResetTime, timezones } = useTimezoneState()
  const homeTimezone = useHomeTimezone()

  return (
    <div className="w-full h-full flex">
      <When condition={timezones.length === 0}>
        <div className="flex flex-auto flex-col justify-center items-center p-4">
          <IconWorldSearch size={48} stroke={1} className="text-gray-500" />
          <p className="mt-5 text-lg text-gray-800 dark:text-gray-300">No location added yet</p>
          <Button className="mt-5">Add home location</Button>
        </div>
      </When>

      <When condition={showResetTime}>
        <div className="fixed top-2 left-1/2 translate-x-[-50%] z-50">
          <Button size="sm" variant="outline" className="text-sm" onClick={() => actions.resetTime()}>
            Reset time
          </Button>
        </div>
      </When>

      {timezones.map(timezone => (
        <Timezone key={timezone.offset} currentTime={currentTime} timezone={timezone} homeTimezone={homeTimezone} />
      ))}
    </div>
  )
}
