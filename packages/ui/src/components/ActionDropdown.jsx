import { AboutDialog } from '@ui/components/dialogs/AboutDialog.jsx'
import { CustomPalettePickerDialog } from '@ui/components/dialogs/CustomPalettePickerDialog.jsx'
import { PalettePickerDialog } from '@ui/components/dialogs/PalettePickerDialog.jsx'
import { SettingsDialog } from '@ui/components/dialogs/SettingsDialog.jsx'
import { AddLocationDialog } from '@ui/components/dialogs/location/AddLocationDialog.jsx'
import { ShareDialog } from '@ui/components/share/ShareDialog.jsx'
import { Button } from '@ui/components/ui/button.jsx'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/components/ui/dropdown-menu'
import { useState } from 'react'

export function ActionDropdown() {
  const [showAddLocation, setShowAddLocation] = useState(false)
  const [showPalettePicker, setShowPalettePicker] = useState(false)
  const [showCustomPalettePicker, setShowCustomPalettePicker] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

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

            <DropdownMenuItem onClick={() => setShowShare(true)}>
              <span>Share</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setShowAbout(true)}>
              <span>About</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          {import.meta.env.VITE_APP_ENV === 'extension' ? (
            <>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => window?.chrome?.tabs?.create({ url: 'chrome://new-tab-page' })}>
                <span>Open default new page</span>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AddLocationDialog isOpen={showAddLocation} onOpenChange={setShowAddLocation} />

      <SettingsDialog isOpen={showSettings} onOpenChange={setShowSettings} />

      <PalettePickerDialog isOpen={showPalettePicker} onOpenChange={setShowPalettePicker} />

      <CustomPalettePickerDialog isOpen={showCustomPalettePicker} onOpenChange={setShowCustomPalettePicker} />

      <ShareDialog isOpen={showShare} onOpenChange={setShowShare} />

      <AboutDialog isOpen={showAbout} onOpenChange={setShowAbout} />
    </>
  )
}
