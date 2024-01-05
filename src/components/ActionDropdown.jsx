import { AddLocationDialog } from '@/components/dialogs/AddLocationDialog.jsx'
import { CustomPalettePickerDialog } from '@/components/dialogs/CustomPalettePickerDialog.jsx'
import { PalettePickerDialog } from '@/components/dialogs/PalettePickerDialog.jsx'
import { SettingsDialog } from '@/components/dialogs/SettingsDialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'

export function ActionDropdown() {
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [showPalettePicker, setShowPalettePicker] = useState(false)
  const [showCustomPalettePicker, setShowCustomPalettePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

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

      <AddLocationDialog isOpen={showAddLocation} onOpenChange={setShowAddLocation} />
      <SettingsDialog isOpen={showSettings} onOpenChange={setShowSettings} />
      <PalettePickerDialog isOpen={showPalettePicker} onOpenChange={setShowPalettePicker} />
      <CustomPalettePickerDialog isOpen={showCustomPalettePicker} onOpenChange={setShowCustomPalettePicker} />
    </>
  )
}
