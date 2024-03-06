import { proxy, subscribe, useSnapshot } from 'valtio'

const storedState = localStorage.getItem('epiczeit-settings') ?? '{}'
const defaultState = {
  showFlags: true,
  showDate: true,
  show24h: true,
  showBoldHour: true,
  offsetFromHome: true,
  showSuggestions: true,
  autoCloseLocationDialog: true,
}

const state = proxy({
  ...defaultState,
  ...JSON.parse(storedState),
})

function updateSettings({
  showDate,
  showFlags,
  show24h,
  showBoldHour,
  offsetFromHome,
  showSuggestions,
  autoCloseLocationDialog,
}) {
  state.showFlags = showFlags
  state.showDate = showDate
  state.show24h = show24h
  state.showBoldHour = showBoldHour
  state.offsetFromHome = offsetFromHome
  state.showSuggestions = showSuggestions
  state.autoCloseLocationDialog = autoCloseLocationDialog
}

export const settingsActions = {
  updateSettings: updateSettings,
}

export function useTimezoneSettings() {
  return useSnapshot(state)
}

subscribe(state, () => {
  localStorage.setItem('epiczeit-settings', JSON.stringify(state))
})
