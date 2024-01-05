import { AddLocation } from '@/components/AddLocation.jsx'
import { PalettePickerDialog } from '@/components/dialogs/PalettePickerDialog.jsx'
import { SettingsDialog } from '@/components/dialogs/SettingsDialog.jsx'
import { CustomPalettePicker } from '@/components/palette/CustomPalettePicker.jsx'
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
import { paletteActions } from '@/state/palette.js'
import { useState } from 'react'

export function ActionDropdown() {
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [showPalettePicker, setShowPalettePicker] = useState(false)
  const [showCustomPalettePicker, setShowCustomPalettePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

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

      <SettingsDialog isOpen={showSettings} onOpenChange={isOpen => setShowSettings(isOpen)} />

      <PalettePickerDialog isOpen={showPalettePicker} onOpenChange={isOpen => setShowPalettePicker(isOpen)} />

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
            <Button size="sm" variant="outline" onClick={discardSelectedPalette}>
              Cancel
            </Button>

            <Button size="sm" type="submit" onClick={saveSelectedPalette}>
              Save custom palette
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
