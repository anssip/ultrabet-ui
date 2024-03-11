import { Inter } from 'next/font/google'
import TopBar from '@/ui/top-bar/top-bar'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import { getClient } from '@/lib/client'
import { MeDocument } from '@/gql/documents.generated'
import { Sport, User } from '@/gql/types.generated'
import { redirect } from 'next/navigation'
import './global-layout.css'
import './design-tokens.css'
import './utilities.css'
import { fetchAccessToken } from '@/lib/util'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Parabolic Bet',
  description: 'Where your bet gains go parabolic',
}

async function getBettingUser(accessToken: string | undefined | null): Promise<User | null> {
  try {
    const response = accessToken
      ? await getClient(true).query({
          query: MeDocument,
          context: {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          },
        })
      : null
    return response?.data?.me ?? null
  } catch (e) {
    console.error(e)
    return null
  }
}

// @ts-ignore
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const accessToken = await fetchAccessToken()
  const me = accessToken ? await getBettingUser(accessToken) : null

  if (accessToken && !me) {
    console.info('redirecting to login')
    redirect('/api/auth/login')
  }

  return (
    <html lang="en">
      <head>
        <title>Parabolic Bet</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/base-min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/pure-min.css"
          integrity="sha384-X38yfunGUhNzHpBaEBsWLO+A0HDYOQi8ufWDkZ0k9e0eXz/tH3II7uKZ9msv++Ls"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/grids-min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/purecss@3.0.0/build/grids-responsive-min.css"
        />
      </head>

      <body className={inter.className}>
        <UserProvider>
          <TopBar bettingUser={me} />
          <div id="layout">
            <div id="layout">{children}</div>
            <Analytics />
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
