import { AddLocation } from '@/components/AddLocation.jsx'
import { Timezone } from '@/components/Timezone.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.jsx'
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
          <IconWorldSearch size={60} stroke={1} />

          <p className="mt-5 text-2xl">No location added yet</p>
          <p className="mt-1 text-lg">Beautiful timezones are waiting for you</p>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-5">Add first location</Button>
            </DialogTrigger>

            <DialogContent className="overflow-hidden p-0 shadow-lg">
              <AddLocation />
            </DialogContent>
          </Dialog>
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
