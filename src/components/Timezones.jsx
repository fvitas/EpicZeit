import { AddLocation } from '@/components/AddLocation.jsx'
import { Timezone } from '@/components/Timezone.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog.jsx'
import { actions, useEpicZeitState } from '@/state/state.js'
import { When } from 'react-if'
import earth from '../assets/earth.svg'

export function Timezones() {
  const { currentTime, showResetTime, timezones } = useEpicZeitState()

  return (
    <div className="w-full h-full flex">
      <When condition={timezones.length === 0}>
        <div className="flex flex-auto flex-col justify-center items-center -mt-24">
          <img src={earth} className="h-80" alt="empty state earth" />

          <p className="mt-2 text-2xl">No location added yet</p>
          <p className="mt-2 text-lg">Beautiful timezones are waiting for you</p>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-5 text-base font-normal">Add first location</Button>
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
        <Timezone key={timezone.offset} currentTime={currentTime} timezone={timezone} />
      ))}
    </div>
  )
}
