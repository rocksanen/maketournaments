import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/providers/auth-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import Navbar from '@/components/shared/navbar'
import Footer from '@/components/shared/footer'
import { ApolloWrapper } from './apollo-wrapper'
import NextUI from './NextUI'

export const metadata: Metadata = {
  title: 'maketournaments',
  description: 'maketournaments',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <NextUI>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <ApolloWrapper>
                <Navbar />
                <main className="min-h-screen flex flex-col justify-center items-center">
                  {children}
                </main>
                <Footer />
              </ApolloWrapper>
            </ThemeProvider>
          </NextUI>
        </AuthProvider>
      </body>
    </html>
  )
}
