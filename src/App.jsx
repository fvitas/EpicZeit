import { ActionDropdown } from '@/components/ActionDropdown.jsx'
import { Timezones } from '@/components/Timezones.jsx'

function App() {
  return (
    <div className="w-screen h-screen flex flex-nowrap overflow-hidden">
      <ActionDropdown />
      <Timezones />
    </div>
  )
}

export default App
