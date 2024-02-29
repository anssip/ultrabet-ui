import MarketPage from './[market]/page'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { group: string; market?: string } }) {
  return MarketPage({ params: { ...params, market: params.market ?? 'h2h' } })
}
