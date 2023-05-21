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
  max-width: 200px;
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

const OptionName = styled.div`
  font-size: 11px;
  color: #666;
  text-align: center;
`

const OddsHistory = styled.p`
  font-size: 10px;
  color: #666;
`

function elapsedTime(startTime: string) {
  const start = new Date(`${startTime}Z`);
  const now = new Date()
  return now.getTime() - start.getTime()
}

function formatStartTime(startTime: string) {
  const start = new Date(`${startTime}Z`);
  return start.toLocaleDateString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})
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

type MarketOptionWithHistory = MarketOption & { history: string }

export function EventList({events, live = false}: { events: EventFragment[], live?: boolean }) {
  const sorted = events.sort((a, b) => {
    const startA = new Date(a.startTime);
    const startB = new Date(b.startTime);
    if (startA < startB) return live ? 1 : -1;
    if (startA > startB) return live ? -1 : 1;
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
        let options = headToHeadMarket.options as MarketOptionWithHistory[];
        if (options.length !== 2) {
          options = [options[0], options[2], options[1]]
        }

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
              {options.map((option: MarketOptionWithHistory) =>
                (
                  <OddsBox key={option?.id}>
                    <OptionName>{option?.name}</OptionName>
                    <OddsValue>{option?.odds}</OddsValue>
                    <OddsHistory>{option?.history ?? ''}</OddsHistory>
                  </OddsBox>)
              )}

            </OddsWrapper>
          </EventWrapper>
        );
      })}
    </Events>
  )
}

export function LiveEventList({events}: { events: EventFragment[] }) {
  const [liveEvents, setLiveEvents] = useState<EventFragment[]>(events);

  const handleMarketOptionUpdate = (updatedMarketOption: MarketOption) => {
    const allOptions = liveEvents.flatMap((event) => event.markets?.flatMap((market) => market?.options ?? []));
    const currentOption = allOptions.find((option) => option?.id === updatedMarketOption.id)
    if (currentOption && currentOption.odds !== updatedMarketOption.odds) {
      console.log("updating odds to " + updatedMarketOption.odds, currentOption.name)

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
                option?.id === updatedMarketOption.id ? {
                  ...option,
                  odds: updatedMarketOption.odds,
                  history: `${(option as MarketOptionWithHistory).history ?? option.odds} > ${updatedMarketOption.odds}`
                } : option
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
        console.log("update incoming...")
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
      if (subscriptionData?.liveMarketOptionUpdated) {
        handleMarketOptionUpdate(subscriptionData.liveMarketOptionUpdated);
      }
    }
  }, [subscriptionData]);

  return <EventList events={liveEvents} live={true}/>
}
