import { defaultPalettes } from '@/components/palette/colors.js'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { actions, useEpicZeitState } from '@/state/state.js'
import { cn } from '@/utils.js'
import { Tabs } from '@radix-ui/react-tabs'
import chroma from 'chroma-js'
import staticPalettes from './static-palettes.json'

export function PalettePicker() {
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
    actions.setPreviewPalette({
      id: newPalette.id,
      colors: chroma.scale(newPalette.colors).mode('hsl').colors(25),
    })
  }

  return (
    <Tabs defaultValue="dynamic">
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
                    <div className="flex-1" key={palette.id + color + index} style={{ backgroundColor: color }}></div>
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
  )
}
