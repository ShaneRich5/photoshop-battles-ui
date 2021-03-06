import 'tailwindcss/tailwind.css'
import { useEffect, useState } from 'react'
import splitbee from '@splitbee/web'
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query'


export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    splitbee.init({
      scriptUrl: "/bee.js",
      apiUrl: "/_hive",
    })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </Hydrate>
    </QueryClientProvider>
  )
}
