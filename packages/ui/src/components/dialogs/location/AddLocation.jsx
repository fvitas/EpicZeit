import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ui/components/ui/command.jsx'
import { useTimezoneSettings } from '@ui/state/settings.js'
import { actions } from '@ui/state/state.js'
import { suggestionsActions, useSuggestedLocations } from '@ui/state/suggested-locations.js'
import { cn } from '@ui/utils.js'
import { useState } from 'react'
import { When } from 'react-if'

function AddLocationItem({ location, onSelect }) {
  return (
    <CommandItem className="cursor-pointer" value={String(location.id)} onSelect={onSelect}>
      <span
        className={cn(
          `fi fi-xx fi-${location?.country_code?.toLowerCase()}`,
          'h-5 !w-auto aspect-[4/3] mr-2 rounded-sm shadow',
        )}></span>
      <span className="truncate">{location.name}</span>
      &nbsp;
      <span className="truncate text-sm text-muted-foreground">
        <When condition={location.admin1 && location.name !== location.country}>
          (<span>{location.admin1 ? location.admin1 : ''}</span>
          <When condition={location.country}>
            , <span>{location.name !== location.country ? location.country : ''}</span>
          </When>
          )
        </When>
      </span>
    </CommandItem>
  )
}

export function AddLocation(props) {
  const [locationInputValue, setLocationInputValue] = useState('')
  const [debouncedLocationValue] = useDebouncedValue(locationInputValue, 300)

  const { showSuggestions } = useTimezoneSettings()
  const suggestedLocations = showSuggestions ? useSuggestedLocations() : []

  const { data, isPending } = useQuery({
    queryKey: ['fetchLocation', debouncedLocationValue],
    queryFn: async ({ queryKey, signal }) => {
      let [key, location] = queryKey
      let response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=rs&format=json`,
        { signal },
      )
      return await response.json()
    },
    enabled: !!debouncedLocationValue,
  })

  function selectLocation(locationId) {
    const newLocation = data?.results?.find(item => String(item.id) === String(locationId))
    actions.addLocation(newLocation)
    setLocationInputValue('')

    if (showSuggestions) {
      suggestionsActions.addSuggestion(newLocation)
    }
    props?.onSelect?.()
  }

  function selectSuggestedLocation(locationId) {
    const newLocation = suggestedLocations?.find(item => String(item.id) === String(locationId))
    actions.addLocation(newLocation)
    suggestionsActions.addSuggestion(newLocation)
    props?.onSelect?.()
  }

  return (
    <Command
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-list]]:min-h-[250px] [&_[cmdk-list]]:max-h-[250px]"
      shouldFilter={false}>
      <CommandInput placeholder="Search location..." value={locationInputValue} onValueChange={setLocationInputValue} />

      <CommandList>
        <When condition={!locationInputValue && suggestedLocations?.length}>
          <CommandGroup heading="Suggestions">
            {suggestedLocations.map(location => (
              <AddLocationItem key={location.id} location={location} onSelect={selectSuggestedLocation} />
            ))}
          </CommandGroup>
        </When>

        <When condition={locationInputValue && data?.results?.length > 0}>
          <CommandGroup heading="Search results">
            {data?.results?.map(location => (
              <AddLocationItem key={location.id} location={location} onSelect={selectLocation} />
            ))}
          </CommandGroup>
        </When>

        <When condition={!isPending && debouncedLocationValue && !data?.results}>
          <CommandEmpty className="pt-20 text-center text-sm">No results found.</CommandEmpty>
        </When>
      </CommandList>
    </Command>
  )
}
