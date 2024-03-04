import { proxy, subscribe, useSnapshot } from 'valtio'

const SUGGESTIONS_LIMIT = 10

const storedSuggestions = localStorage.getItem('epiczeit-suggestions') ?? '{}'

const state = proxy({
  ...JSON.parse(storedSuggestions),
})

function addSuggestion(location) {
  const suggestedLocation = state[location.id]

  if (suggestedLocation) {
    suggestedLocation.lastUsed = Date.now()
    return
  }

  const suggestedLocations = Object.values(state)

  if (suggestedLocations.length >= SUGGESTIONS_LIMIT) {
    const leastUsedLocation = suggestedLocations.sort((a, b) => a.lastUsed - b.lastUsed).at(0)

    if (leastUsedLocation) {
      delete state[leastUsedLocation.id]
    }
  }

  state[location.id] = {
    ...location,
    lastUsed: Date.now(),
  }
}

export const suggestionsActions = {
  addSuggestion: addSuggestion,
}

export function useSuggestedLocations() {
  const locations = useSnapshot(state)

  return Object.values(locations)
    .sort((a, b) => b.lastUsed - a.lastUsed)
    .slice(0, SUGGESTIONS_LIMIT)
}

subscribe(state, () => {
  localStorage.setItem('epiczeit-suggestions', JSON.stringify(state))
})
