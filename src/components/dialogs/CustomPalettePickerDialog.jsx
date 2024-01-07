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
import { actions } from '@/state/state.js'

export function CustomPalettePickerDialog({ isOpen, onOpenChange }) {
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
  )
}
