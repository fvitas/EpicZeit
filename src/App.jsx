import { ActionDropdown } from '@/components/ActionDropdown.jsx'
import { Timezones } from '@/components/Timezones.jsx'

let timezones = [
  {
    timezone: 'Asia/Tokyo',
    label: 'Tokyo Japan',
    country: 'Japan',
    countryCode: 'JP',
    image: '',
  },
  {
    timezone: 'America/New_York',
    label: 'New York',
    country: 'United States',
    countryCode: 'US',
    image: '',
  },
  {
    timezone: 'Europe/London',
    label: 'London',
    country: 'England',
    countryCode: 'GB',
    image: '',
  },
  {
    timezone: 'Europe/Belgrade',
    label: 'Belgrade',
    country: 'Serbia',
    countryCode: 'RS',
    image: '',
  },
]

function App() {
  return (
    <div className="w-screen h-screen flex flex-nowrap overflow-hidden">
      <ActionDropdown />
      <Timezones />
    </div>
  )
}

export default App
