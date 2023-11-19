import './globals.css'
import { Inter } from 'next/font/google'
import GlobalNav from '@/ui/global-nav'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { getSession, Session } from '@auth0/nextjs-auth0'
import { kv } from '@vercel/kv'
import BetSlip, { Slip } from '@/ui/bet-slip/bet-slip'
import React from 'react'
import { Analytics } from '@vercel/analytics/react'

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
  // console.log('session', session)
  const slip = await loadSlip(session)
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <GlobalNav />
          {children}
          <BetSlip slip={slip ?? {}} />
          <Analytics />
        </UserProvider>
      </body>
    </html>
  )
}
