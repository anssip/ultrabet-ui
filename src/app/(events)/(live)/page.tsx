import {getClient} from "@/lib/client";
import LiveEventsPage from "@/app/(events)/(live)/live-events-rcs";
import {EventFragment, ListLiveEventsDocument} from '@/gql/documents.generated'

export default async function Page() {
  const data = await getClient().query({
    query: ListLiveEventsDocument
  });
  if (!data.data.listLiveEvents) return null;
  return (
    <LiveEventsPage events={data.data.listLiveEvents as EventFragment[]}/>
  )
}