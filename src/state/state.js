import { proxy, subscribe, useSnapshot } from 'valtio'

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)
dayjs.extend(timezone)

const storedState = localStorage.getItem('state')
const defaultState = {
  currentTime: dayjs.utc(),
  showResetTime: false,
  timezones: [],
}
let initialState = defaultState
if (storedState) {
  initialState = JSON.parse(storedState)
  initialState.currentTime = dayjs(initialState.currentTime).utc()
}

const state = proxy(initialState)

function setState(newState) {}

function getOffsetInMinutes(timezone, date = new Date()) {
  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
    year: 'numeric',
  })
  let [year, sign = '+', hour = 0, minutes = 0] = formatter.format(date).match(/\d+|\+|-/g)

  return Number(sign + 1) * (hour * 60 + Number(minutes ?? 0))
}

function addLocation(selectedLocation) {
  let newLocationOffset = getOffsetInMinutes(selectedLocation.timezone)
  let existingTimezone = state.timezones.find(tz => tz.offset === newLocationOffset)

  let newLocation = {
    id: crypto.randomUUID(),
    timezone: selectedLocation.timezone,
    label: selectedLocation.name,
    countryCode: selectedLocation.country_code,
  }

  if (existingTimezone) {
    existingTimezone.locations.push(newLocation)
  } else {
    state.timezones.push({
      offset: getOffsetInMinutes(selectedLocation.timezone),
      isHome: state.timezones.length === 0,
      locations: [newLocation],
    })

    state.timezones = state.timezones.toSorted((a, b) => a.offset - b.offset)
  }
}

function deleteLocation(location) {
  let changedTimezone = state.timezones.find(timezone => timezone.locations.find(l => l.id === location.id))
  changedTimezone.locations = changedTimezone.locations.filter(l => l.id !== location.id)
}

function editLocation(location, newLabel) {
  let changedLocation = state.timezones.flatMap(timezone => timezone.locations).find(l => l.id === location.id)
  changedLocation.label = newLabel
}

function editTimezoneTime(timezone, hours, minutes = '00', amPm = '') {
  // dayjs.tz('2023-11-18 15:55', 'Asia/Taipei').utc().format()
  // dayjs.utc('2023-11-18 11:55').tz('Asia/Taipei').format()
  // dayjs.tz('2023-11-18 15:55', 'Asia/Taipei').tz('Europe/Belgrade').format()

  let timezoneName = timezone.locations[0].timezone
  let newHours = amPm && amPm === 'pm' ? Number(hours) + 12 : Number(hours)
  let newMinutes = Number(minutes)

  let currentTimezoneDate = state.currentTime.tz(timezoneName).format('YYYY-MM-DD')
  let newTime = dayjs.tz(`${currentTimezoneDate} ${newHours}:${newMinutes}`, timezoneName).utc()

  state.showResetTime = state.showResetTime || state.currentTime.format('HH:mm') !== newTime.format('HH:mm')
  state.currentTime = newTime
}

function deleteTimezone(timezone) {
  state.timezones = state.timezones.filter(tz => tz.offset !== timezone.offset)
}

function resetTime() {
  state.showResetTime = false
  state.currentTime = dayjs().utc()
}

function changeHome(timezone) {
  state.timezones.forEach(tz => {
    tz.isHome = tz.offset === timezone.offset
  })
}

export const actions = {
  setState,
  addLocation: addLocation,
  deleteLocation: deleteLocation,
  editLocation: editLocation,
  editTimezoneTime: editTimezoneTime,
  deleteTimezone: deleteTimezone,
  resetTime: resetTime,
  changeHome: changeHome,
}

export function useTimezoneState() {
  return useSnapshot(state)
}

export function useHomeTimezone() {
  const { timezones } = useSnapshot(state)

  return timezones.find(timezone => timezone.isHome)
}

setInterval(() => {
  // TODO (filipv): check if time changed, driftless npm
  if (!state.showResetTime) {
    state.currentTime = dayjs().utc()
  }
}, 5_000)

subscribe(state, () => {
  localStorage.setItem('state', JSON.stringify(state))
})
