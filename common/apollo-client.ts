import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SITE_URL + ":4000",
    cache: new InMemoryCache(),
});

export default client;