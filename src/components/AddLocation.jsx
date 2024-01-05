import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command.jsx'
import { actions } from '@/state/state.js'
import { cn } from '@/utils.js'
import { useDebouncedValue } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { When } from 'react-if'

export function AddLocation(props) {
  const [locationInputValue, setLocationInputValue] = useState('')
  const [debouncedLocationValue] = useDebouncedValue(locationInputValue, 250)

  const { data, isPending } = useQuery({
    queryKey: ['fetchLocation', debouncedLocationValue],
    queryFn: async ({ meta, queryKey, signal }) => {
      let [key, location] = queryKey
      let response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=10&language=rs&format=json`,
      )
      return await response.json()
    },
    enabled: !!debouncedLocationValue,
  })

  function selectLocation(locationId) {
    const newLocation = data?.results?.find(item => String(item.id) === String(locationId))
    actions.addLocation(newLocation)
    props?.onSelect?.()
  }

  return (
    <Command
      className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 [&_[cmdk-list]]:min-h-[220px] [&_[cmdk-list]]:max-h-[220px]"
      shouldFilter={false}>
      <CommandInput placeholder="Search location..." value={locationInputValue} onValueChange={setLocationInputValue} />

      <CommandList>
        <When condition={data?.results?.length > 0}>
          {data?.results?.map(item => (
            <CommandItem key={item.id} value={String(item.id)} onSelect={selectLocation}>
              <span
                className={cn(
                  `fi fi-${item?.country_code?.toLowerCase()}`,
                  'h-5 !w-auto aspect-[4/3] mr-2 rounded-sm shadow',
                )}></span>

              <span>{item.name}</span>

              <span className="text-sm whitespace-break-spaces text-muted-foreground">
                <When condition={item.admin1 && item.name !== item.country}>
                  {' '}
                  (<span>{item.admin1 ? item.admin1 : ''}</span>
                  <When condition={item.country}>
                    , <span>{item.name !== item.country ? item.country : ''}</span>
                  </When>
                  )
                </When>
              </span>
            </CommandItem>
          ))}
        </When>

        <When condition={!isPending && locationInputValue && !data?.results}>
          <CommandEmpty>No results found.</CommandEmpty>
        </When>
      </CommandList>
    </Command>
  )
}
