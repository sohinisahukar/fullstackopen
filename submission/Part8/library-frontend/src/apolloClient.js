import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const httpLink = new HttpLink({
  uri: 'http://localhost:4001/graphql',
  headers: {
    authorization: localStorage.getItem('library-user-token') ? `Bearer ${localStorage.getItem('library-user-token')}` : "",
  }
});

const wsLink = new WebSocketLink(
  new SubscriptionClient(`ws://localhost:4001/graphql`, {
    reconnect: true,
    connectionParams: {
      authorization: localStorage.getItem('library-user-token') ? `Bearer ${localStorage.getItem('library-user-token')}` : "",
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
