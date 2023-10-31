import './globals.css'
import { Inter } from 'next/font/google'
import GlobalNav from '@/ui/global-nav'
import { UserProvider } from '@auth0/nextjs-auth0/client'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Ultrabet',
  description: 'Betting app demo',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <GlobalNav />
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
