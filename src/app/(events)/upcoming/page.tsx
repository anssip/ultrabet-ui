import {getClient} from "@/lib/client";
import UpcomingEventsPage from "@/app/(events)/upcoming/upcoming-events-rcs";
import {EventFragment, ListEventsDocument} from '@/gql/documents.generated'

export default async function Page() {
  const data = await getClient().query({
    query: ListEventsDocument
  });
  if (!data.data.listEvents) return null;
  return (
    <UpcomingEventsPage events={data.data.listEvents as EventFragment[]}/>
  )
}