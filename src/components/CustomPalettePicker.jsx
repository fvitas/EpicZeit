import { generateTextColor } from '@/components/Timezone.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { paletteActions, usePaletteSettings } from '@/state/palette.js'
import chroma from 'chroma-js'
import { useState } from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'

function PopoverPicker({ color, setColor }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="relative after:w-[200%] after:h-[280px] after:absolute after:-top-[130px] after:-left-1/2 uppercase cursor-pointer">
          {color}
        </div>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="center" className="w-auto">
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput
          prefixed={true}
          color={color}
          onChange={setColor}
          style={{
            width: '110px',
            margin: '20px 45px 0',
            padding: '6px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            outline: 'none',
            textTransform: 'uppercase',
            textAlign: 'center',
            '&:hover': {
              border: '1px solid #aaa',
            },
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export function CustomPalettePicker() {
  const { currentPalette } = usePaletteSettings()
  const colors = chroma.scale(currentPalette.colors).mode('hsl').colors(4)

  const [customColors, setCustomColors] = useState({ 0: colors[0], 1: colors[1], 2: colors[2], 3: colors[3] })

  function onChange(color, index) {
    const newColors = { ...customColors, [index]: color }
    setCustomColors(newColors)

    paletteActions.setPreviewPalette({
      id: crypto.randomUUID(),
      colors: chroma.scale(Object.values(newColors)).mode('hsl').colors(25),
    })
  }

  return (
    <div className="flex-1 flex gap-0 w-full h-[300px] rounded-lg overflow-hidden border">
      <div
        className="flex-1 shrink-0 h-full flex justify-center items-center"
        style={{ backgroundColor: customColors[0], color: generateTextColor(customColors[0]) }}>
        <PopoverPicker color={customColors[0]} setColor={color => onChange(color, 0)} />
      </div>

      <div
        className="flex-1 shrink-0 h-full flex justify-center items-center"
        style={{ backgroundColor: customColors[1], color: generateTextColor(customColors[1]) }}>
        <PopoverPicker color={customColors[1]} setColor={color => onChange(color, 1)} />
      </div>

      <div
        className="flex-1 shrink-0 h-full flex justify-center items-center"
        style={{ backgroundColor: customColors[2], color: generateTextColor(customColors[2]) }}>
        <PopoverPicker color={customColors[2]} setColor={color => onChange(color, 2)} />
      </div>

      <div
        className="flex-1 shrink-0 h-full flex justify-center items-center"
        style={{ backgroundColor: customColors[3], color: generateTextColor(customColors[3]) }}>
        <PopoverPicker color={customColors[3]} setColor={color => onChange(color, 3)} />
      </div>
    </div>
  )
}
