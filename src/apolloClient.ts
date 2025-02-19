/* eslint-disable */
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { createClient } from 'graphql-ws';
import { Observable } from '@apollo/client/core';

// Create the WebSocket client using graphql-ws
const wsClient = createClient({
  url: 'wss://qzdu2mazrzfr3pvzuv6z5txkji.appsync-realtime-api.us-east-1.amazonaws.com/graphql',
  connectionParams: {
    headers: {
      'x-api-key': 'da2-2dtee4aqijh2bp6vrp3zkziise', // Replace with your actual API key
    },
  },
});

// Create an HTTP link for regular GraphQL queries and mutations
const httpLink = new ApolloLink((operation, forward) => {
  const { query, variables } = operation;

  // Return an observable wrapping the Promise
  return new Observable((observer) => {
    fetch('https://qzdu2mazrzfr3pvzuv6z5txkji.appsync-api.us-east-1.amazonaws.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'da2-2dtee4aqijh2bp6vrp3zkziise', // Replace with your actual API key
      },
      body: JSON.stringify({
        query: query.loc?.source.body || query, // Ensure query is a string
        variables,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        observer.next(result); // Emit the result to the observer
        observer.complete(); // Complete the observable
      })
      .catch((error) => {
        observer.error(error); // Emit an error if the fetch fails
      });
  });
});

// WebSocket Link for subscriptions
const wsLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const queryString = operation.query.loc?.source.body || operation.query; // Convert DocumentNode to string

    const unsubscribe = wsClient.subscribe(
      {
        query: queryString.toString(), // Ensure the query is a string
        variables: operation.variables,
      },
      {
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      }
    );

    // Unsubscribe when the operation completes
    return () => unsubscribe();
  });
});

// Set up Apollo Client with split links: HTTP for queries/mutations and WebSocket for subscriptions
const client = new ApolloClient({
  link: ApolloLink.split(
    // Use WebSocket for subscriptions
    ({ query }) => query && query.definitions.some((definition) => definition.kind === 'OperationDefinition' && definition.operation === 'subscription'),
    wsLink,
    httpLink
  ),
  cache: new InMemoryCache(),
});

export default client;
