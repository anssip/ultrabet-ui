import MarketPage from './[group]/page'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { group: string; market?: string } }) {
  return MarketPage({ params: { ...params, group: params.market ?? 'Soccer' } })
}
