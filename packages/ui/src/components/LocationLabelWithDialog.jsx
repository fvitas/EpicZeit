import { Button } from '@ui/components/ui/button.jsx'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@ui/components/ui/dialog.jsx'
import { Input } from '@ui/components/ui/input.jsx'
import { actions } from '@ui/state/state.js'
import { useState } from 'react'

export function LocationLabelWithDialog({ location }) {
  const [isOpen, setIsOpen] = useState(false)

  function deleteLocation(event) {
    event.preventDefault()

    actions.deleteLocation(location)
    setIsOpen(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    let newLabel = new FormData(event.target).get('location-label')

    if (newLabel.length === 0 || newLabel.length > 100) {
      return
    }

    actions.editLocation(location, newLabel)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => setIsOpen(open)}>
      <DialogTrigger asChild>
        <div className="overflow-hidden truncate cursor-pointer">{location.label}</div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Location Label</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              id="location-label"
              name="location-label"
              defaultValue={location.label}
              className="w-full"
              autoComplete="off"
            />
          </div>

          <DialogFooter className="flex flex-col gap-2 sm:justify-between sm:flex-row-reverse sm:space-x-0 mt-4">
            <Button type="submit" className="w-24">
              Save
            </Button>

            <Button className="bg-red-500 hover:bg-red-500/90 focus-visible:ring-red-500" onClick={deleteLocation}>
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
