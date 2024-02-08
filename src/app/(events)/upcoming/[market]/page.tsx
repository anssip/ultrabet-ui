import { getClient } from '@/lib/client'
import { EventFragment, ListEventsDocument } from '@/gql/documents.generated'
import { EventList } from '@/ui/event-list/event-list'
import styles from '../../page.module.css'
import { PageNav } from '@/ui/page-nav'

export const revalidate = 60

export default async function Page({ params }: { params: { market: string } }) {
  const data = await getClient().query({
    query: ListEventsDocument,
  })
  if (!data.data.listEvents) return null
  return (
    <main>
      <h1 className={styles.header}>Upcoming Events</h1>
      <PageNav prefix="/upcoming" />
      <EventList events={data.data.listEvents as EventFragment[]} marketName={params.market} />
    </main>
  )
}
