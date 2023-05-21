import {ApolloClient, HttpLink, InMemoryCache} from "@apollo/client";
import {registerApolloClient} from "@apollo/experimental-nextjs-app-support/rsc";
import {BASE_URL, splitLink} from "@/lib/apollo-link";

export const {getClient} = registerApolloClient(() => {
  const httpLink = new HttpLink({
    uri: `${BASE_URL}/graphql`,
    fetchOptions: {revalidate: 10},
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink(httpLink),
  });
});
