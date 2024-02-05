import { proxy, subscribe, useSnapshot } from 'valtio'

const storedState = localStorage.getItem('epiczeit-settings')
const defaultState = {
  showFlags: true,
  showDate: true,
  show24h: true,
  showBoldHour: true,
  offsetFromHome: true,
}

let initialState = storedState ? JSON.parse(storedState) : defaultState

const state = proxy(initialState)

function updateSettings({ showDate, showFlags, show24h, showBoldHour, offsetFromHome }) {
  state.showFlags = showFlags
  state.showDate = showDate
  state.show24h = show24h
  state.showBoldHour = showBoldHour
  state.offsetFromHome = offsetFromHome
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
