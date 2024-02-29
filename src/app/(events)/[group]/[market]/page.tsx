import { getClient } from '@/lib/client'
import {
  EventFragment,
  ListSportsWithEventsDocument,
  SportWithEventsFragment,
} from '@/gql/documents.generated'
import styles from '../../page.module.css'
import { LiveEventList } from '@/ui/event-list/live-event-list'
import React from 'react'
import { PageNav } from '@/ui/page-nav'
import { EventList } from '@/ui/event-list/event-list'
import classnames from 'classnames'
import SportList from '@/ui/sport-list/sport-list'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

async function fetchSports(params: { group: string; market: string }) {
  console.log('fetchSports', params.group)
  try {
    return await getClient().query({
      query: ListSportsWithEventsDocument,
      variables: { group: (params.group ? decodeURIComponent(params.group) : 'all') ?? 'all' },
    })
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
      <PageNav prefix={`/${params.group}`} />
      <SportList sports={sports} market={params.market} />
    </main>
  )
}
