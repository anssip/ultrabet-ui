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

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Parabolic Bet',
  description: 'Where your bet gains go parabolic',
}

async function loadSlip(session: Session | null): Promise<Slip> {
  if (!session) return Promise.resolve({})
  return (await kv.hgetall(`betslip:${session.user.sub}`)) ?? {}
}

// @ts-ignore
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getSession()) ?? null
  const slip = await loadSlip(session)

  const accessToken = await fetchAccessToken()
  const meResponse = accessToken
    ? await getClient(true).query({
        query: MeDocument,
        context: {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      })
    : null

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <GlobalNav bettingUser={meResponse?.data?.me ?? null} />
          {children}
          <BetSlip slip={slip ?? {}} />
          <Analytics />
        </UserProvider>
      </body>
    </html>
  )
}
