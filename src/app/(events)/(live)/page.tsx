import { getClient } from '@/lib/client'
import { EventFragment, ListLiveEventsDocument } from '@/gql/documents.generated'
import styles from '../page.module.css'
import { LiveEventList } from '@/ui/live-event-list'

// export const revalidate = 60;
export const dynamic = 'force-dynamic'

export default async function Page() {
  const data = await getClient().query({
    query: ListLiveEventsDocument,
  })
  if (!data.data.listLiveEvents) return null
  return (
    <main>
      <h1 className={styles.header}>In-play Events</h1>
      <LiveEventList events={data.data.listLiveEvents as EventFragment[]} />
    </main>
  )
}
