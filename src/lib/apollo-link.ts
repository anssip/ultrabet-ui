import {HttpLink, split} from "@apollo/client";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";
import {getMainDefinition} from "@apollo/client/utilities";

export const BASE_URL = "https://ultrabet.herokuapp.com";


export const wsLink = new GraphQLWsLink(createClient({
  url: `${BASE_URL}/subscriptions`.replace(/^https/, 'ws')
}));
export const splitLink = (httpLink: HttpLink) => split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
