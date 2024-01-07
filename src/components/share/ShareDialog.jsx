import { CopyButton } from '@/components/share/CopyButton.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { useEpicZeitState } from '@/state/state.js'
import { compressToEncodedURIComponent } from 'lz-string'
import { When } from 'react-if'

export function ShareDialog({ isOpen, onOpenChange }) {
  const { timezones, currentPalette } = useEpicZeitState()

  const stateToShare = JSON.stringify({ timezones, currentPalette })

  let compressedStateString = compressToEncodedURIComponent(stateToShare)
  let showErrorMessage = false

  if (compressedStateString.length >= 2_000) {
    compressedStateString = ''
    showErrorMessage = true
  }

  const shareUrl = compressedStateString ? location.origin + location.pathname + `?share=${compressedStateString}` : ''

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] max-h-[300px] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Share your timezones with others</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to recreate your timezones.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 pt-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" className="h-9" defaultValue={shareUrl} readOnly disabled={!shareUrl} />
          </div>

          <CopyButton value={shareUrl} />
        </div>

        <When condition={showErrorMessage}>
          <div className="text-red-500 text-xs">
            <div>Sharing is not possible due to too many timezones.</div>
            <div>Please reduce the number of timezones or locations to proceed with sharing.</div>
          </div>
        </When>
      </DialogContent>
    </Dialog>
  )
}
