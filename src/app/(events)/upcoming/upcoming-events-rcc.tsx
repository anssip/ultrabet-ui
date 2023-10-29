'use client';

import styled from '@emotion/styled';
import {EventFragment} from "@/gql/documents.generated";
import {EventList} from "@/ui/event-list";

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2em;
`

export default function UpcomingEventsPage({events}: { events: EventFragment[] }) {

  return (
    <main>
      <Header>Upcoming Events</Header>
      <EventList events={events}/>
    </main>
  )
}