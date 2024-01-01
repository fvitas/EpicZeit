import { proxy, subscribe, useSnapshot } from 'valtio'

async function fetchHome() {
  let response = await fetch('http://ip-api.com/json/?fields=61439')
  let body = await response.json()

  return {
    timezone: body.timezone,
    label: body.city,
    country: body.country,
    countryCode: body.countryCode,
  }
}

const storedState = localStorage.getItem('state')
const defaultState = {
  currentTime: new Date(),
  isEdited: false,
  // timezones: [fetchHome()],
  timezones: [],
}
let initialState = defaultState
if (storedState) {
  initialState = JSON.parse(storedState)
  initialState.currentTime = new Date(initialState.currentTime)
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
  // todo check this shit
  let formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone.locations[0].timeZoneName,
    hour12: false,
    timeStyle: 'short',
  })

  let newHours = amPm && amPm === 'pm' ? Number(hours) + 12 : Number(hours)
  let newMinutes = Number(minutes)

  let currentDate = new Date()
  let newDate = new Date()
  newDate.setHours(newHours, Number(newMinutes))

  state.currentTime = newDate
  state.isEdited = currentDate.getTime() !== newDate.getTime()
}

function deleteTimezone(timezone) {
  state.timezones = state.timezones.filter(tz => tz.offset !== timezone.offset)
}

function resetTime() {
  state.isEdited = false
  state.currentTime = new Date()
}

function changeHome(timezone) {
  state.timezones.forEach(tz => {
    tz.isHome = tz.offset === timezone.offset
  })
}

// subscribeKey(state, 'folders', fetchImage)
// subscribeKey(state, 'selectedFolder', fetchImage)

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
  if (!state.isEdited) {
    state.currentTime = new Date()
  }
}, 5_000)

subscribe(state, () => {
  localStorage.setItem('state', JSON.stringify(state))
})
