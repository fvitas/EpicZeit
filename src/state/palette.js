import chroma from 'chroma-js'
import { proxy, useSnapshot } from 'valtio'

const storedState = localStorage.getItem('epiczeit-palette')
const defaultState = {
  currentPalette: {
    id: 'YlGnBu',
    colors: chroma.scale('YlGnBu').mode('hsl').colors(25),
    isDynamic: false,
  },
  previewPalette: null,
}

let initialState = storedState ? JSON.parse(storedState) : defaultState

const state = proxy(initialState)

function setPreviewPalette(newPalette) {
  state.previewPalette = newPalette
}

function savePalette() {
  if (state.previewPalette) {
    state.currentPalette = state.previewPalette
  }
  state.previewPalette = null
}

function discardPalette() {
  state.previewPalette = null
}

function reversePreviewPalette() {
  if (state.previewPalette) {
    state.previewPalette.colors.reverse()
  }
}

export const paletteActions = {
  setPreviewPalette: setPreviewPalette,
  savePalette: savePalette,
  discardPalette: discardPalette,
  reversePreviewPalette: reversePreviewPalette,
}

export function usePaletteSettings() {
  return useSnapshot(state)
}

// subscribe(state, () => {
//   localStorage.setItem('epiczeit-palette', JSON.stringify(state))
// })
