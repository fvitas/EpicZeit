import { useViewportSize } from '@mantine/hooks'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ClockPicker } from '@ui/components/clock/ClockPicker.jsx'
import { Button } from '@ui/components/ui/button.jsx'
import { Dialog, DialogClose, DialogOverlay, DialogPortal, DialogTrigger } from '@ui/components/ui/dialog.jsx'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@ui/components/ui/popover.jsx'
import { actions } from '@ui/state/state.js'
import { useRef } from 'react'

export function ClockPickerResponsiveWrapper({ children, show24h, timezone, hours, minutes, amPm }) {
  const { width: viewportWidth } = useViewportSize()
  const initialValues = useRef([])

  function onClockChange([hours, minutes, amPm = '']) {
    actions.editTimezoneTime(timezone, hours, minutes, amPm.toLowerCase())
  }

  function resetTime() {
    onClockChange(initialValues.current)
  }

  function saveInitialTime(isOpen) {
    if (isOpen) {
      initialValues.current = [hours, minutes, amPm]
    }
  }

  if (viewportWidth <= 768) {
    return (
      <Dialog onOpenChange={saveInitialTime}>
        <DialogTrigger>{children}</DialogTrigger>

        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <ClockPicker show24h={show24h} hours={hours} minutes={minutes} amPm={amPm} onClockChange={onClockChange} />

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={resetTime}>
                  Cancel
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button>Save</Button>
              </DialogClose>
            </div>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    )
  }

  return (
    <Popover onOpenChange={saveInitialTime}>
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent className="w-auto">
        <ClockPicker show24h={show24h} hours={hours} minutes={minutes} amPm={amPm} onClockChange={onClockChange} />

        <div className="flex justify-end gap-2 mt-4">
          <PopoverClose asChild>
            <Button variant="outline" onClick={resetTime}>
              Cancel
            </Button>
          </PopoverClose>

          <PopoverClose asChild>
            <Button>Save</Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
