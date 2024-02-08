import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './globals.css'

import 'flag-icons/css/flag-icons.min.css'

import { ActionDropdown } from '@ui/components/ActionDropdown.jsx'
import { Timezones } from '@ui/components/Timezones.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
})

export function App() {
  return (
    <div className="w-screen h-screen flex flex-nowrap overflow-scroll">
      <QueryClientProvider client={queryClient}>
        <ActionDropdown />
        <Timezones />
      </QueryClientProvider>
    </div>
  )
}
