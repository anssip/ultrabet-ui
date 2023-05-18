'use client';

import styled from '@emotion/styled';

const EventWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  max-width: 450px;
  border: 1px solid #ccc;
  margin-left: auto;
  margin-right: auto;
  padding: 1em;
`;

const EventHeader = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const OddsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OddsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100px;
`;

const OddsValue = styled.div`
  margin-top: 8px;
  font-weight: bold;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 2em;
`

export default function UpcomingEventsPage({events}: { events: Array<any> }) {

  return (
    <main>
      <Header>Upcoming Events</Header>

      <div>
        {events.map((event: any) => {
          const headToHeadMarket = event.markets.find(market => market.name === 'h2h');

          if (!headToHeadMarket) return null;

          const [homeTeam, awayTeam, draw] = headToHeadMarket.options;

          return (
            <EventWrapper key={event.id}>
              <EventHeader>{event.name}</EventHeader>
              <OddsWrapper>
                <OddsBox>
                  <div>1</div>
                  <OddsValue>{homeTeam.odds.toFixed(2)}</OddsValue>
                </OddsBox>
                {draw && (
                  <OddsBox>
                    <div>X</div>
                    <OddsValue>{draw.odds.toFixed(2)}</OddsValue>
                  </OddsBox>)}
                <OddsBox>
                  <div>2</div>
                  <OddsValue>{awayTeam.odds.toFixed(2)}</OddsValue>
                </OddsBox>
              </OddsWrapper>
            </EventWrapper>
          );
        })}
      </div>
      )
    </main>
  )
}