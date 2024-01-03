import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { paletteActions } from '@/state/palette.js'
import chroma from 'chroma-js'
import { defaultPalettes } from './colors.js'
import staticPalettes from './static-palettes.json'

export function PalettePicker() {
  const loadedPalettes =
    [...new Set(staticPalettes)].map(palette => ({
      id: palette,
      colors: palette.match(/.{6}/g).map(color => '#' + color),
    })) ?? []

  function setDynamicPalette(newPalette) {
    paletteActions.setPreviewPalette(newPalette)
  }

  function setStaticPalette(newPalette) {
    paletteActions.setPreviewPalette({
      id: newPalette.id,
      colors: chroma.scale(newPalette.colors).mode('hsl').colors(25),
    })
  }

  return (
    <div className="w-[calc(100%_+3rem)] h-full max-h-[300px] -mx-6">
      <ScrollArea className="h-[300px]">
        <h3 className="pl-6 sticky top-0 bg-white">Dynamic (Daylight) palettes</h3>

        <div className="flex flex-wrap gap-4 px-6 py-2">
          {defaultPalettes.map(palette => (
            <div
              key={palette.id}
              className="inline-flex w-40 h-10 rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary shadow-sm"
              onClick={() => setDynamicPalette(palette)}>
              {palette.colors.map((color, index) => (
                <div className="flex-1" key={palette.id + color + index} style={{ backgroundColor: color }}></div>
              ))}
            </div>
          ))}
        </div>

        <hr className="m-6" />

        <h3 className="pl-6 sticky top-0 bg-white">Static palettes</h3>
        <div className="flex flex-wrap gap-4 px-6 py-2">
          {loadedPalettes.map(palette => (
            <div
              key={palette.id}
              className="inline-flex rounded overflow-hidden cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-primary shadow-sm"
              onClick={() => setStaticPalette(palette)}>
              {palette.colors.map(color => (
                <div className="w-10 h-10" key={palette.id + color} style={{ backgroundColor: color }}></div>
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
