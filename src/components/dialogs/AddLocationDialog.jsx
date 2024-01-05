import { AddLocation } from '@/components/AddLocation.jsx'
import { Dialog, DialogContent } from '@/components/ui/dialog.jsx'

export function AddLocationDialog({ isOpen, onOpenChange }) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <AddLocation onSelect={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
