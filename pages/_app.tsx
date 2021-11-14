import 'tailwindcss/tailwind.css'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'
import { useState } from 'react'


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
