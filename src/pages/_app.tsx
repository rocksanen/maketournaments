import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NextUIProvider } from '@nextui-org/react'
import { Layout } from '../components/layout/layout'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/utils/apolloClient'

function MyApp({ Component, pageProps }: AppProps) {
  const client = createApolloClient()
  return (
    <ApolloProvider client={client}>
      <NextThemesProvider defaultTheme="system" attribute="class">
        <NextUIProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NextUIProvider>
      </NextThemesProvider>
    </ApolloProvider>
  )
}

export default MyApp
