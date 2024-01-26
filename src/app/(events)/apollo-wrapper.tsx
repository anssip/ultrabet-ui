'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
  // @ts-ignore
  NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr'
import { BASE_URL, splitLink } from '@/lib/apollo-link'
import { useUser } from '@auth0/nextjs-auth0/client'

const makeClient = (isAuthenticated: boolean) => () => {
  const httpLink = new HttpLink({
    uri:
      (isAuthenticated
        ? process.env.NEXT_PUBLIC_BETTING_API_URL
        : process.env.NEXT_PUBLIC_API_URL) + '/graphql',
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            // in a SSR environment, if you use multipart features like
            // @defer, you need to decide how to handle these.
            // This strips all interfaces with a `@defer` directive from your queries.
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : splitLink(httpLink),
  })
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const { user } = useUser()
  console.log('ApolloWrapper user', user)
  return <ApolloNextAppProvider makeClient={makeClient(!!user)}>{children}</ApolloNextAppProvider>
}
