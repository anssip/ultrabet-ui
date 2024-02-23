import { getClient } from '@/lib/client'
import { EventFragment, ListEventsBySportDocument } from '@/gql/documents.generated'
import styles from '../../page.module.css'
import { LiveEventList } from '@/ui/event-list/live-event-list'
import React from 'react'
import { PageNav } from '@/ui/page-nav'
import { EventList } from '@/ui/event-list/event-list'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { group: string; market: string } }) {
  const data = await getClient().query({
    query: ListEventsBySportDocument,
    variables: { group: decodeURIComponent(params.group) },
  })
  const events = data.data.eventsBySportGroup as EventFragment[]
  const liveEvents = events.filter((event) => event.isLive)
  const upcomingEvents = events.filter((event) => !event.isLive)

  return (
    <main>
      <h1 className={styles.header}>Live now</h1>
      <LiveEventList events={liveEvents} marketName={params.market} />
      <h1 className={styles.header}>Upcoming</h1>
      <EventList events={upcomingEvents} marketName={params.market} />
    </main>
  )
}
