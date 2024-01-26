import { Dialog, DialogContent } from '@/components/ui/dialog.jsx'
import { AddLocation } from './AddLocation.jsx'

export function AddLocationDialog({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <AddLocation />
      </DialogContent>
    </Dialog>
  )
}
