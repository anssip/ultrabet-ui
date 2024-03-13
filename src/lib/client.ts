import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { splitLink } from '@/lib/apollo-link'
// @ts-ignore

// TODO: this creates a new client (and new cache) every time, fix that
export const getClient = (isAuthenticated: boolean = false) => {
  const { getClient } = registerApolloClient(() => {
    const uri =
      (isAuthenticated
        ? process.env.NEXT_PUBLIC_BETTING_API_URL
        : process.env.NEXT_PUBLIC_API_URL) + '/graphql'
    console.log(`uri, is authenticated? ${isAuthenticated}`, uri)
    const httpLink = new HttpLink({
      uri,
    })
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: splitLink(httpLink),
    })
  })
  return getClient()
}
