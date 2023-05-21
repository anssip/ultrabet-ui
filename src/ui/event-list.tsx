'use client';

import styled from '@emotion/styled';
import {EventFragment} from "@/gql/documents.generated";
import {useSubscription} from '@apollo/client';
import {useEffect, useState} from "react";
import {MarketOptionUpdatesDocument} from "@/gql/documents.generated";
import {MarketOption} from "@/gql/types.generated";

const Events = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;
`

const EventWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  width: 400px;
  border: 1px solid #ccc;
  margin-left: auto;
  margin-right: auto;
  padding: .5em 1em;
`;

const EventHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 300;
  margin-bottom: 1em;
  background-color: #ccc;
  padding: .3em;
`;
const HeaderItem = styled.div`
  text-align: center;
`

const OddsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OddsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;

const OddsValue = styled.div`
  margin-top: 8px;
  font-weight: bold;
`;

function elapsedTime(startTime: string) {
  const start = new Date(`${startTime}Z`);
  const now = new Date()
  return now.getTime() - start.getTime()
}

function formatStartTime(startTime: string) {
  const start = new Date(`${startTime}Z`);
  return start.toLocaleTimeString()
}

export function ElapsedTime({startTime}: { startTime: string }) {
  const [elapsed, setElapsed] = useState(elapsedTime(startTime));

  function formatDuration(ms: number): string {
    const padWithZero = (n: number): string => (n < 10 ? '0' + n : n.toString());

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds - (minutes * 60);
    const remainingMinutes = minutes - (hours * 60);

    return (hours > 0 ? padWithZero(hours) + ':' : '') +
      ((minutes > 0 || hours > 0) ? padWithZero(remainingMinutes) + ':' : '') +
      padWithZero(remainingSeconds);
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(elapsedTime(startTime))
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime])

  return <div>{formatDuration(elapsed)}</div>
}

export function EventList({events, live = false}: { events: EventFragment[], live?: boolean }) {
  const sorted = events.sort((a, b) => {
    const startA = new Date(a.startTime);
    const startB = new Date(b.startTime);
    if (startA < startB) return 1;
    if (startA > startB) return -1;
    return 0;
  });
  return (
    <Events>
      {sorted.map((event) => {
        if (!event) return null;
        // TODO: show all markets
        const headToHeadMarket = event?.markets?.find(market => ['h2h', 'h2h_lay'].includes(market?.name ?? ''));

        if (!headToHeadMarket?.options) {
          console.log("no h2h market")
          return null;
        }

        const [homeTeam, awayTeam, draw] = headToHeadMarket.options;

        return (
          <EventWrapper key={event.id}>
            <EventHeader>
              <HeaderItem>
                {event.name}
              </HeaderItem>
              <HeaderItem>
                {live ? <ElapsedTime startTime={event.startTime}/> : formatStartTime(event.startTime)}
              </HeaderItem>
            </EventHeader>
            <OddsWrapper>
              <OddsBox>
                <div>1</div>
                <OddsValue>{homeTeam?.odds}</OddsValue>
              </OddsBox>
              {draw && (
                <OddsBox>
                  <div>X</div>
                  <OddsValue>{draw.odds}</OddsValue>
                </OddsBox>)}
              <OddsBox>
                <div>2</div>
                <OddsValue>{awayTeam?.odds}</OddsValue>
              </OddsBox>
            </OddsWrapper>
          </EventWrapper>
        );
      })}
    </Events>
  )
}

export function LiveEventList({events}: { events: EventFragment[] }) {
  const [liveEvents, setLiveEvents] = useState(events);

  const handleMarketOptionUpdate = (updatedMarketOption: MarketOption) => {
    const allOptions = liveEvents.flatMap((event) => event.markets?.flatMap((market) => market?.options ?? []));
    const currentOption = allOptions.find((option) => option?.id === updatedMarketOption.id)
    if (currentOption) {
      console.log("updating option", currentOption, updatedMarketOption)

      setLiveEvents((prevEvents) =>
        prevEvents.map((event: EventFragment) => {
          const updatedEvent: EventFragment = {
            ...event,
            markets: event.markets?.map((market) => ({
              id: market?.id ?? '',
              isLive: market?.isLive ?? false,
              name: market?.name ?? '',
              source: market?.source ?? '',
              options: market?.options?.map((option) =>
                option?.id === updatedMarketOption.id ? updatedMarketOption : option
              ),
            })),
          }
          return updatedEvent
        }))
    }
  };

  const {data: subscriptionData, loading, error} = useSubscription(MarketOptionUpdatesDocument, {
    onError: (error) => {
      console.error("subscription error", error)
    },
    onData: ({data}) => {
      if (data?.data?.liveMarketOptionUpdated) {
        handleMarketOptionUpdate(data.data.liveMarketOptionUpdated);
      }
    },
  });
  if (loading) {
    console.log("loading...")
  }
  useEffect(() => {
    if (error) {
      console.error(`Subscription error: ${error.message}`);
    }
  }, [error]);
  useEffect(() => {
    if (subscriptionData) {
      console.error(`Subscription data: ${subscriptionData}`);
    }
  }, [subscriptionData]);

  return <EventList events={liveEvents} live={true}/>
}
