/* eslint-disable */
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { Observable } from '@apollo/client/core';

const wsClient = createClient({
  url: 'wss://qzdu2mazrzfr3pvzuv6z5txkji.appsync-realtime-api.us-east-1.amazonaws.com/graphql',
  connectionParams: {
    headers: {
      'x-api-key': 'da2-2dtee4aqijh2bp6vrp3zkziise',
    },
  },
});

const httpLink = new ApolloLink((operation, forward) => {
  const { query, variables } = operation;

  return new Observable((observer) => {
    fetch('https://qzdu2mazrzfr3pvzuv6z5txkji.appsync-api.us-east-1.amazonaws.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'da2-2dtee4aqijh2bp6vrp3zkziise',
      },
      body: JSON.stringify({
        query: query.loc?.source.body || query,
        variables,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        observer.next(result);
        observer.complete();
      })
      .catch((error) => {
        observer.error(error);
      });
  });
});

const wsLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const queryString = operation.query.loc?.source.body || operation.query;

    const unsubscribe = wsClient.subscribe(
      {
        query: queryString.toString(),
        variables: operation.variables,
      },
      {
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      }
    );

    return () => unsubscribe();
  });
});

const client = new ApolloClient({
  link: ApolloLink.split(
    ({ query }) => query && query.definitions.some((definition) => definition.kind === 'OperationDefinition' && definition.operation === 'subscription'),
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache(),
});

export default client;
