import { Inter } from 'next/font/google'
import TopBar from '@/ui/top-bar/top-bar'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { kv } from '@vercel/kv'
import BetSlip, { Slip } from '@/ui/bet-slip/bet-slip'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import { getClient } from '@/lib/client'
import { ListBetsDocument, ListSportsDocument, MeDocument } from '@/gql/documents.generated'
import { fetchAccessToken } from '@/app/bets/page'
import { Sport, User } from '@/gql/types.generated'
import { redirect } from 'next/navigation'
import { SideMenu } from '@/ui/side-menu/side-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Parabolic Bet',
  description: 'Where your bet gains go parabolic',
}

async function loadSlip(session: Session | null): Promise<Slip> {
  if (!session) return Promise.resolve({})
  return (await kv.hgetall(`betslip:${session.user.sub}`)) ?? {}
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
  const session = (await getSession()) ?? null
  const slip = await loadSlip(session)

  const accessToken = await fetchAccessToken()
  const me = accessToken ? await getBettingUser(accessToken) : null

  if (accessToken && !me) {
    console.info('redirecting to login')
    redirect('/api/auth/login')
  }

  const data = await getClient(false).query({
    query: ListSportsDocument,
  })
  const sports = data.data.listSports as Sport[]
  console.log(`Fetched ${sports.length} sports`)

  return (
    <html lang="en">
      <head>
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
        <link rel="stylesheet" href="global.css" />
        <script src="ui.js" async></script>
      </head>

      <body className={inter.className}>
        <UserProvider>
          <TopBar bettingUser={me} />
          <div id="layout">
            <SideMenu sports={sports} />

            <div id="layout">
              {children}
              <BetSlip slip={slip ?? {}} />
            </div>

            <Analytics />
          </div>
        </UserProvider>
      </body>
    </html>
  )
}
