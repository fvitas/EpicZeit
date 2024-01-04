import { AddLocation } from '@/components/AddLocation.jsx'
import { CustomPalettePicker } from '@/components/palette/CustomPalettePicker.jsx'
import { PalettePicker } from '@/components/palette/PalettePicker.jsx'
import { Button } from '@/components/ui/button.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { paletteActions } from '@/state/palette.js'
import { settingsActions, useTimezoneSettings } from '@/state/settings.js'
import { useState } from 'react'

export function ActionDropdown() {
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [showPalettePicker, setShowPalettePicker] = useState(false)
  const [showCustomPalettePicker, setShowCustomPalettePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const { showFlags, showDate, show24h, showBoldHour, offsetFromHome } = useTimezoneSettings()

  function saveSettings(event) {
    event.preventDefault()
    let formData = new FormData(event.target)

    settingsActions.updateSettings({
      showFlags: formData.get('show-flags') === 'on',
      showDate: formData.get('show-date') === 'on',
      show24h: formData.get('show-24h') === 'on',
      showBoldHour: formData.get('showBoldHour') === 'on',
      offsetFromHome: formData.get('offset-from-home') === 'on',
    })
    setShowSettings(false)
  }

  function discardSelectedPalette() {
    paletteActions.discardPalette()
    setShowPalettePicker(false)
    setShowCustomPalettePicker(false)
  }
  function saveSelectedPalette() {
    paletteActions.savePalette()
    setShowPalettePicker(false)
    setShowCustomPalettePicker(false)
  }

  function onPaletteClose() {
    paletteActions.discardPalette()
    setShowPalettePicker(false)
    setShowCustomPalettePicker(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="fixed top-2 right-2 text-sm z-50">
            Menu
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="bottom" sideOffset={10} align="end" alignOffset={0}>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowAddLocation(true)}>
              <span>Add a location</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setShowPalettePicker(true)}>
              <span>Choose a palette</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setShowCustomPalettePicker(true)}>
              <span>Make your own palette</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => window?.chrome?.tabs?.update({ url: 'chrome://new-tab-page' })}>
              <span>Open default new page</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => window?.chrome?.management?.setEnabled(window?.chrome?.runtime?.id, false)}>
            <span>Disable extension</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAddLocation} onOpenChange={open => setShowAddLocation(open)}>
        <DialogContent className="overflow-hidden p-0 shadow-lg">
          <AddLocation onSelect={() => setShowAddLocation(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={open => setShowSettings(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <form className="flex-1 flex flex-col gap-2" onSubmit={saveSettings}>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Customize your epic zeit. Click save when you're done.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-center">
                <Label className="cursor-pointer" htmlFor="show-flags">
                  Show flags
                </Label>
                <Switch id="show-flags" name="show-flags" defaultChecked={showFlags} />
              </div>

              <div className="flex justify-between items-center">
                <Label className="cursor-pointer" htmlFor="show-date">
                  Show date
                </Label>
                <Switch id="show-date" name="show-date" defaultChecked={showDate} />
              </div>

              <div className="flex justify-between items-center">
                <Label className="cursor-pointer" htmlFor="show-24h">
                  24-hour time
                </Label>
                <Switch id="show-24h" name="show-24h" defaultChecked={show24h} />
              </div>

              <div className="flex justify-between items-center">
                <Label className="cursor-pointer" htmlFor="showBoldHour">
                  Bold hour
                </Label>
                <Switch id="showBoldHour" name="showBoldHour" defaultChecked={showBoldHour} />
              </div>

              <div className="flex justify-between items-center">
                <Label className="cursor-pointer" htmlFor="offset-from-home">
                  Time offset from home
                </Label>
                <Switch id="offset-from-home" name="offset-from-home" defaultChecked={offsetFromHome} />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save settings</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showPalettePicker} onOpenChange={onPaletteClose}>
        <DialogContent className="max-w-[570px] max-h-[500px] overflow-hidden" showOverlay={false}>
          <DialogHeader>
            <DialogTitle>Choose a palette</DialogTitle>
            <DialogDescription>Explore and select the perfect palette that reflects your mood</DialogDescription>
          </DialogHeader>

          <PalettePicker />

          <DialogFooter>
            <div className="flex justify-between items-center mr-auto gap-2">
              <Label className="cursor-pointer" htmlFor="reverse-colors">
                Reverse color order
              </Label>
              {/*// TODO (filipv): implement this better, on palette change reset this*/}
              <Switch
                id="reverse-colors"
                name="reverse-colors"
                defaultChecked={false}
                onCheckedChange={paletteActions.reversePreviewPalette}
              />
            </div>

            <Button variant="outline" onClick={discardSelectedPalette}>
              Cancel
            </Button>

            <Button type="submit" onClick={saveSelectedPalette}>
              Save selected palette
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCustomPalettePicker} onOpenChange={onPaletteClose}>
        <DialogContent className="max-w-[570px] max-h-[500px] overflow-hidden" showOverlay={false}>
          <DialogHeader>
            <DialogTitle>Make your own palette</DialogTitle>
            <DialogDescription>
              Unleash your creativity and design a palette that reflects your unique style
            </DialogDescription>
          </DialogHeader>

          <CustomPalettePicker />

          <DialogFooter>
            <Button variant="outline" onClick={discardSelectedPalette}>
              Cancel
            </Button>

            <Button type="submit" onClick={saveSelectedPalette}>
              Save custom palette
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
