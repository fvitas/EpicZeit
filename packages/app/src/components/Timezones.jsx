import { Timezone } from '@/components/Timezone.jsx'
import { AddLocationDialog } from '@/components/dialogs/location/AddLocationDialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { actions, useEpicZeitState } from '@/state/state.js'
import { useState } from 'react'
import { When } from 'react-if'

export function Timezones() {
  const [showAddLocation, setShowAddLocation] = useState(false)
  const { currentTime, showResetTime, timezones } = useEpicZeitState()

  return (
    <div className="w-full h-full flex">
      <When condition={timezones.length === 0}>
        <div className="flex flex-auto flex-col justify-center items-center -mt-24">
          <img src="/earth.svg" className="h-80" alt="empty state earth" />

          <p className="mt-2 text-2xl">No location added yet</p>
          <p className="mt-2 text-lg">Beautiful timezones are waiting for you</p>

          <Button className="mt-5 text-base font-normal" onClick={() => setShowAddLocation(true)}>
            Add first location
          </Button>
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

      <AddLocationDialog isOpen={showAddLocation} onOpenChange={setShowAddLocation} />
    </div>
  )
}
