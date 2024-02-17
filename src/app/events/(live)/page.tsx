import MarketPage from './[market]/page'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

export default async function Page() {
  return MarketPage({ params: { market: 'h2h' } })
}
