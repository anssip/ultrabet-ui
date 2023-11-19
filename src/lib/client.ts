import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { BASE_URL, splitLink } from '@/lib/apollo-link'
// @ts-ignore

// TODO: this creates a new client (and new cache) every time, fix that
export const getClient = (isAuthenticated: boolean = false) => {
  const { getClient } = registerApolloClient(() => {
    const uri = `${BASE_URL}/${isAuthenticated ? 'private/graphql' : 'graphql'}`
    console.log(`uri, is authenticated? ${isAuthenticated}`, uri)
    const httpLink = new HttpLink({
      uri,
      fetchOptions: { revalidate: 10 },
    })
    return new ApolloClient({
      cache: new InMemoryCache(),
      link: splitLink(httpLink),
    })
  })
  return getClient()
}
