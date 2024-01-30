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
import { settingsActions, useTimezoneSettings } from '@/state/settings.js'

export function SettingsDialog({ isOpen, onOpenChange }) {
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
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form className="flex-1 flex flex-col gap-2" onSubmit={saveSettings}>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Customize your EpicZeit. Click save when you're done.</DialogDescription>
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
            <Button size="sm" variant="outline" type="reset" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button size="sm" type="submit">
              Save settings
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
