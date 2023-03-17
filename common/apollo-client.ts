import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://13.214.191.184:4000",
    cache: new InMemoryCache(),
});

export default client;