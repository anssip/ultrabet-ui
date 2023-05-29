'use client';

import styled from '@emotion/styled';
import {EventFragment, MarketOptionUpdatesDocument, ScoreUpdatesDocument} from "@/gql/documents.generated";
import {useSubscription} from '@apollo/client';
import {useEffect, useState} from "react";
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
  display: flex;
  flex-direction: column;
  text-align: center;
  max-width: 200px;
`
const HeaderSubItem = styled.div`
  padding: .3em;
`
const HeaderSubItem2 = styled.div`
  padding: .3em;
  background-color: lightseagreen;
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

function renderScore(event: EventFragment): string {
  const getTeamScore = (teamName: string) => event?.scoreUpdates?.filter(s => s && s.name === teamName).reduce((acc, s) => acc + parseInt(s?.score ?? '0'), 0) ?? 0;
  const homeScore = getTeamScore(event?.homeTeamName);
  const awayScore = getTeamScore(event?.awayTeamName);
  return `${homeScore} - ${awayScore}`;
}

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
        const headToHeadMarket = event?.markets?.find(market => ['h2h', 'h2h_lay'].includes(market?.name ?? '') && market?.source === 'betfair');

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
                <HeaderSubItem>{live ?
                  <ElapsedTime startTime={event.startTime}/> : formatStartTime(event.startTime)}
                </HeaderSubItem>
                {live && (
                  <HeaderSubItem2>
                    {renderScore(event)}
                  </HeaderSubItem2>
                )}
              </HeaderItem>
            </EventHeader>
            <OddsWrapper>
              {options.map((option: MarketOptionWithHistory) =>
                (
                  <OddsBox key={option?.id}>
                    <OptionName>{option?.name} ({option?.id})</OptionName>
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

  const {data: optionsUpdateData, error: optionsError} = useSubscription(MarketOptionUpdatesDocument,);
  const {data: scoreUpdatesData, error: scoreError} = useSubscription(ScoreUpdatesDocument,);

  const error = optionsError || scoreError;
  useEffect(() => {
    if (error) {
      alert(`Subscription error: ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    let updated = false;
    const getUpdatedEvents = (currentEvents: EventFragment[], updatedMarketOptions: MarketOption[]) => {
      return currentEvents.map((event) => {
        const updatedMarkets = event?.markets?.map((market) => {
          if (market?.options) {
            const updatedOptions = market.options.map((option) => {
              const updatedOption = updatedMarketOptions.find((updatedOption) => updatedOption.id === option?.id);
              if (updatedOption) {
                console.log("updating option", updatedOption);
                updated = true
                const history = option?.odds !== updatedOption.odds ? `${option?.odds} -> ${updatedOption.odds}` : '';
                return {...option, ...updatedOption, history};
              }
              return option;
            });
            return {...market, options: updatedOptions};
          }
          return market;
        });
        return {...event, markets: updatedMarkets};
      })
    };

    if (optionsUpdateData) {
      if (optionsUpdateData?.liveMarketOptionsUpdated) {
        setLiveEvents(current => getUpdatedEvents(current, optionsUpdateData.liveMarketOptionsUpdated as MarketOption[]));
      }
    }
  }, [optionsUpdateData]);

  useEffect(() => {
      const getUpdatedEvents = (currentEvents: EventFragment[], updatedEvent: EventFragment) => {
        return currentEvents.map((currentEvent) => {
          if (currentEvent.id === updatedEvent.id) {
            return {
              ...currentEvent,
              scoreUpdates: [...(currentEvent.scoreUpdates ?? []), ...(updatedEvent.scoreUpdates ?? [])]
            };
          }
          return currentEvent;
        })
      }
      console.info("scoreUpdatesData", scoreUpdatesData)
      if (scoreUpdatesData?.eventScoresUpdated) {
        setLiveEvents(current => getUpdatedEvents(current, scoreUpdatesData?.eventScoresUpdated as EventFragment));
      }
    }
    , [scoreUpdatesData]);

  return <EventList events={liveEvents} live={true}/>
}
