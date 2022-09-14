import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { config } from '@fortawesome/fontawesome-svg-core'
import { ApolloProvider } from "@apollo/client";
import client from "../common/apollo-client";

import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
function MyApp({ Component, pageProps, router }: AppProps) {
  return <ApolloProvider client={client}>
    <Layout title={pageProps.title}><Component {...pageProps} /></Layout>
  </ApolloProvider>
}

export default MyApp
