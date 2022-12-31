import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { config } from '@fortawesome/fontawesome-svg-core'
import { ApolloProvider } from "@apollo/client";
import client from "../common/apollo-client";
import '@fortawesome/fontawesome-svg-core/styles.css'
import React from 'react';
import { disableTemplate } from '../common/helper';
config.autoAddCss = false
function MyApp({ Component, pageProps, router }: AppProps) {

  const disableStatus = disableTemplate(router.pathname);

  return <ApolloProvider client={client}>
    <Layout disableHeader={disableStatus.disableHeader} disableSideBar={disableStatus.disableSidebar} title={pageProps.title} >
      <Component {...pageProps} />
    </Layout>
  </ApolloProvider>
}

export default MyApp
