import { getClient } from '@/lib/client'
import { ListSportsWithEventsDocument, SportWithEventsFragment } from '@/gql/documents.generated'
import styles from '../../page.module.css'
import React from 'react'
import { MarketNav, PageNav } from '@/ui/page-nav'
import classnames from 'classnames'
import { SportList } from '@/ui/sport-list/sport-list'

export const revalidate = 0
export const dynamic = 'force-dynamic'

async function fetchSports(params: { group: string; market: string }) {
  const start = new Date().getTime()
  console.log('fetchSports', params.group)
  try {
    const result = await getClient().query({
      query: ListSportsWithEventsDocument,
      variables: { group: (params.group ? decodeURIComponent(params.group) : 'all') ?? 'all' },
    })
    console.log('fetchSports completed in ', new Date().getTime() - start)
    return result
  } catch (e) {
    console.error('fetchSports', e)
    return { data: { listSports: [] } }
  }
}

export default async function Page({ params }: { params: { group: string; market: string } }) {
  const data = await fetchSports(params)
  const sports = data.data.listSports as SportWithEventsFragment[]

  return (
    <main className={classnames(styles.eventsContainer)}>
      <MarketNav prefix={`/${params.group ?? 'all'}`} />
      <SportList group={params.group} sports={sports} market={params.market} />
    </main>
  )
}
