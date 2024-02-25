import { getClient } from '@/lib/client'
import { EventFragment, ListEventsBySportDocument } from '@/gql/documents.generated'
import styles from '../../page.module.css'
import { LiveEventList } from '@/ui/event-list/live-event-list'
import React from 'react'
import { PageNav } from '@/ui/page-nav'
import { EventList } from '@/ui/event-list/event-list'
import classnames from 'classnames'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: { group: string; market: string } }) {
  console.log('group', params.group)
  const data = await getClient().query({
    query: ListEventsBySportDocument,
    variables: { group: decodeURIComponent(params.group) },
  })
  const events = data.data.eventsBySportGroup as EventFragment[]
  const liveEvents = events.filter((event) => event.isLive)
  const upcomingEvents = events.filter((event) => !event.isLive)

  return (
    <main className={classnames(styles.eventsContainer)}>
      <PageNav prefix={`/events/${params.group}`} />
      <LiveEventList events={liveEvents} marketName={params.market} />
      <EventList events={upcomingEvents} marketName={params.market} />
    </main>
  )
}
