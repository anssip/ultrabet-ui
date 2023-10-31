import './globals.css'
import { Inter } from 'next/font/google'
import GlobalNav from '@/ui/global-nav'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { MarketOption } from '@/gql/types.generated'
import { kv } from '@vercel/kv'
import BetSlip from '@/ui/bet-slip'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Parabolic Bet',
  description: 'Where your bet gains go parabolic',
}

async function loadSlip(session: Session | null): Promise<MarketOption[]> {
  if (!session) return Promise.resolve([])
  return (await kv.smembers(`betslip:${session.user.sub}`)) ?? ([] as MarketOption[])
}

// @ts-ignore
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = (await getSession()) ?? null
  const slipOptions = await loadSlip(session)
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <GlobalNav />
          {children}
          <BetSlip slipOptions={slipOptions ?? []} />
        </UserProvider>
      </body>
    </html>
  )
}
