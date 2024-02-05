import { defaultPalettes } from '@/components/palette/colors.js'
import staticPalettes from '@/components/palette/static-palettes.json'
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
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { actions, useEpicZeitState } from '@/state/state.js'
import { cn } from '@/utils.js'
import { Tabs } from '@radix-ui/react-tabs'
import chroma from 'chroma-js'
import { useState } from 'react'
import { When } from 'react-if'

export function PalettePickerDialog({ isOpen, onOpenChange }) {
  const [selectedTab, setSelectedTab] = useState('dynamic')
  const [reverseColors, setReverseColors] = useState(false)
  const { currentPalette, previewPalette } = useEpicZeitState()

  const loadedPalettes =
    [...new Set(staticPalettes)].map(palette => ({
      id: palette,
      colors: palette.match(/.{6}/g).map(color => '#' + color),
    })) ?? []

  function setDynamicPalette(newPalette) {
    actions.setPreviewPalette(newPalette)
  }

  function setStaticPalette(newPalette) {
    const newPreviewPalette = {
      id: newPalette.id,
      colors: chroma.scale(newPalette.colors).mode('hsl').colors(25),
    }

    if (reverseColors) {
      newPreviewPalette.colors.reverse()
    }
    actions.setPreviewPalette(newPreviewPalette)
  }

  function saveSelectedPalette() {
    actions.savePalette()
    onOpenChange(false)
  }

  function discardSelectedPalette() {
    actions.discardPalette()
    onOpenChange(false)
  }

  function onReversePalette() {
    setReverseColors(!reverseColors)
    actions.reversePreviewPalette()
  }

  return (
    <Dialog open={isOpen} onOpenChange={discardSelectedPalette}>
      <DialogContent className="max-w-[570px] max-h-[500px] overflow-hidden" showOverlay={false}>
        <DialogHeader>
          <DialogTitle>Choose a palette</DialogTitle>
          <DialogDescription>Explore and select the perfect palette that reflects your mood</DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={value => setSelectedTab(value)}>
          <TabsList>
            <TabsTrigger value="dynamic" tabIndex={0}>
              Daylight palettes
            </TabsTrigger>
            <TabsTrigger value="static" tabIndex={0}>
              Static palettes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dynamic" tabIndex={-1}>
            <div className="w-[calc(100%_+3rem)] h-full -mx-6">
              <ScrollArea className="h-[280px]">
                <div className="flex flex-wrap gap-4 px-6 py-2">
                  {defaultPalettes.map(palette => (
                    <div
                      key={palette.id}
                      className={cn(
                        'inline-flex w-40 h-10 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary shadow-sm',
                        (previewPalette && previewPalette.id === palette.id) ||
                          (!previewPalette && currentPalette.id === palette.id)
                          ? 'ring-2 ring-offset-2 ring-primary'
                          : '',
                      )}
                      onClick={() => setDynamicPalette(palette)}>
                      {palette.colors.map((color, index) => (
                        <div
                          className="flex-1"
                          key={palette.id + color + index}
                          style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="static" tabIndex={-1}>
            <div className="w-[calc(100%_+3rem)] h-full -mx-6">
              <ScrollArea className="h-[280px]">
                <div className="flex flex-wrap gap-4 px-6 py-2">
                  {loadedPalettes.map(palette => (
                    <div
                      key={palette.id}
                      className={cn(
                        'inline-flex rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary shadow-sm',
                        (previewPalette && previewPalette.id === palette.id) ||
                          (!previewPalette && currentPalette.id === palette.id)
                          ? 'ring-2 ring-offset-2 ring-primary'
                          : '',
                      )}
                      onClick={() => setStaticPalette(palette)}>
                      {palette.colors.map(color => (
                        <div className="w-10 h-10" key={palette.id + color} style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <When condition={selectedTab === 'static'}>
            <div className="flex justify-between items-center mr-auto gap-2">
              <Label className="cursor-pointer" htmlFor="reverse-colors">
                Reverse colors
              </Label>
              <Switch
                id="reverse-colors"
                name="reverse-colors"
                checked={reverseColors}
                onCheckedChange={onReversePalette}
              />
            </div>
          </When>

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
