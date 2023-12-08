import './globals.css'
import { Inter } from 'next/font/google'
import GlobalNav from '@/ui/global-nav'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { kv } from '@vercel/kv'
import BetSlip, { Slip } from '@/ui/bet-slip/bet-slip'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'
import { getClient } from '@/lib/client'
import { ListBetsDocument, MeDocument } from '@/gql/documents.generated'
import { fetchAccessToken } from '@/app/bets/page'
import { User } from '@/gql/types.generated'
import { redirect } from 'next/navigation'

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

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <GlobalNav bettingUser={me} />
          {children}
          <BetSlip slip={slip ?? {}} />
          <Analytics />
        </UserProvider>
      </body>
    </html>
  )
}
