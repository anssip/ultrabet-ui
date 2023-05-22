import './globals.css'
import {Inter} from 'next/font/google'
import GlobalNav from "@/ui/global-nav";

const inter = Inter({subsets: ['latin']})

export const metadata = {
  title: 'Ultrabet',
  description: 'Betting app demo',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <GlobalNav/>
    {children}
    </body>
    </html>
  )
}
