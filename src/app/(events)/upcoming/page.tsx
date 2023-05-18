import {gql} from '@apollo/client';
import styled from '@emotion/styled';
import {getClient} from "@/lib/client";
import UpcomingEventsPage from "@/app/(events)/upcoming/upcoming-events-rcs";

const LIST_EVENTS = gql`
    query ListEvents {
        listEvents {
            id
            externalId
            name
            startTime
            sport {
                id
                key
                title
                description
                active
            }
            isLive
            markets(source: "betfair") {
                id
                name
                source
                lastUpdated
                options {
                    id
                    name
                    odds
                }
            }
        }
    }
`

export default async function Page() {
  const data = await getClient().query({
    query: LIST_EVENTS
  });
  return (
    <UpcomingEventsPage events={data.data.listEvents}/>
  )
}