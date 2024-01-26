import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'
import '/node_modules/flag-icons/css/flag-icons.min.css'

import { ActionDropdown } from '@/components/ActionDropdown.jsx'
import { Timezones } from '@/components/Timezones.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
})

function App() {
  return (
    <div className="w-screen h-screen flex flex-nowrap overflow-scroll">
      <QueryClientProvider client={queryClient}>
        <ActionDropdown />
        <Timezones />
      </QueryClientProvider>
    </div>
  )
}

export default App
