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
  font-weight: bold;
  margin-bottom: 1em;
  background-color: #ccc;
  padding: .3em;
  text-align: center;
`;

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

export function EventList({events}: { events: EventFragment[] }) {
  return (
    <Events>
      {events.map((event) => {
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
            <EventHeader>{event.name}</EventHeader>
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
  // useEffect(() => {
  //   console.log("liveEvents now", liveEvents)
  // }, [liveEvents]);

  return <EventList events={liveEvents}/>
}