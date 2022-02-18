import {
    ApolloClient,
    InMemoryCache
} from "@apollo/client";

import { createUploadLink } from "apollo-upload-client";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
        credentials: 'include',
        uri: 'http://localhost:3002/api/graphql'
    })
});

export default client;