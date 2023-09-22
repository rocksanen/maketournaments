import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NextUIProvider } from '@nextui-org/react'
import { Layout } from '../components/layout/layout'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/utils/apolloClient'
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const client = createApolloClient()
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <NextThemesProvider defaultTheme="system" attribute="class">
          <NextUIProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NextUIProvider>
        </NextThemesProvider>
      </SessionProvider>
    </ApolloProvider>
  )
}

export default MyApp
