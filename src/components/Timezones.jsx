import { AddLocation } from '@/components/AddLocation.jsx'
import { Timezone } from '@/components/Timezone.jsx'
import { defaultPalettes } from '@/components/palette/colors.js'
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
          <div className="fixed top-0 left-0 w-full h-full flex -z-10">
            {defaultPalettes[1]?.colors.map((color, index) => {
              return (
                <div
                  key={index}
                  className="flex-1"
                  style={{
                    background: `linear-gradient(to bottom, ${color}, ${
                      defaultPalettes[0]?.colors[(24 + index - 2) % 24]
                    })`,
                  }}></div>
              )
            })}
          </div>

          <IconWorldSearch size={60} stroke={1} />

          <p className="mt-5 text-2xl drop-shadow-[-1px_1px_1px_white]">No location added yet</p>

          <Dialog>
            <DialogTrigger>
              <Button size="sm" className="mt-5">
                Add home location
              </Button>
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
