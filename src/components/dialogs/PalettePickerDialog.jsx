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
import { Label } from '@/components/ui/label.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { actions } from '@/state/state.js'

export function PalettePickerDialog({ isOpen, onOpenChange }) {
  function discardSelectedPalette() {
    actions.discardPalette()
    onOpenChange(false)
  }
  function saveSelectedPalette() {
    actions.savePalette()
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={discardSelectedPalette}>
      <DialogContent className="max-w-[570px] max-h-[500px] overflow-hidden" showOverlay={false}>
        <DialogHeader>
          <DialogTitle>Choose a palette</DialogTitle>
          <DialogDescription>Explore and select the perfect palette that reflects your mood</DialogDescription>
        </DialogHeader>

        <PalettePicker />

        <DialogFooter>
          <div className="flex justify-between items-center mr-auto gap-2">
            <Label className="cursor-pointer" htmlFor="reverse-colors">
              Reverse colors
            </Label>
            {/*// TODO (filipv): implement this better, on palette change reset this*/}
            <Switch
              id="reverse-colors"
              name="reverse-colors"
              defaultChecked={false}
              onCheckedChange={actions.reversePreviewPalette}
            />
          </div>

          <Button size="sm" variant="outline" onClick={discardSelectedPalette}>
            Cancel
          </Button>

          <Button size="sm" type="submit" onClick={saveSelectedPalette}>
            Save selected palette
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
