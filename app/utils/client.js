import {
    ApolloClient,
    InMemoryCache
} from "@apollo/client";

const client = new ApolloClient({
    uri: 'http://localhost:3002/api/graphql',
    cache: new InMemoryCache(),
    headers: {
        authorization: localStorage.getItem('token') || '',
    }
});

export default client;