import 'tailwindcss/tailwind.css'
import { useState } from 'react'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'


export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}
