'use client';

import styled from '@emotion/styled';
import {EventFragment} from "@/gql/documents.generated";
import {LiveEventList} from "@/ui/event-list";

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2em;
`

export default function LiveEventsPage({events}: { events: EventFragment[] }) {

  return (
    <main>
      <Header>In-play Events</Header>
      <LiveEventList events={events}/>
    </main>
  )
}