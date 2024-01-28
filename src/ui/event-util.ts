import { EventFragment } from '@/gql/documents.generated'
import { MarketOption } from '@/gql/types.generated'
import * as R from 'ramda'

export const getUpdatedEventsForNewMarketOptions = (
  currentEvents: EventFragment[],
  updatedMarketOptions: MarketOption[]
): {
  newLiveEvents: EventFragment[]
  updatedEvents: string[]
} => {
  let updatedEvents: string[] = []
  const newLiveEvents = currentEvents.map((event) => {
    const updatedMarkets = event?.markets?.map((market) => {
      if (market?.options) {
        const updatedOptions = market.options.map((option) => {
          const updatedOption = updatedMarketOptions.find(
            (updatedOption) => updatedOption.id === option?.id
          )
          if (updatedOption && updatedOption.odds !== option?.odds) {
            updatedEvents.push(event.id)
            const history =
              option?.odds !== updatedOption.odds ? `${option?.odds} -> ${updatedOption.odds}` : ''
            return { ...option, ...updatedOption, history }
          }
          return option
        })
        return { ...market, options: updatedOptions }
      }
      return market
    })
    return { ...event, markets: updatedMarkets }
  })
  return { newLiveEvents, updatedEvents }
}

export const getUpdatedEventsForNewScores = (
  currentEvents: EventFragment[],
  updatedEvents: EventFragment[]
) => {
  return currentEvents.map((currentEvent) => {
    const updatedEvent = updatedEvents.find((updatedEvent) => updatedEvent.id === currentEvent.id)
    if (currentEvent.id === updatedEvent?.id) {
      console.log('new score', updatedEvent)
      return {
        ...currentEvent,
        scoreUpdates: R.uniqBy(R.prop('id'), [
          ...(currentEvent.scoreUpdates ?? []),
          ...(updatedEvent.scoreUpdates ?? []),
        ]),
      }
    }
    return currentEvent
  })
}

export const getUpdatedEventsForNewEventStatuses = (
  currentEvents: EventFragment[],
  updatedEvents: EventFragment[]
) => {
  const newLiveEvents = updatedEvents.filter(
    (updatedEvent) =>
      updatedEvent.isLive &&
      !updatedEvent.completed &&
      !currentEvents.find((event) => event.id === updatedEvent.id)
  )
  const completedLiveEvents = updatedEvents.filter((updatedEvent) => updatedEvent.completed)

  console.log('number of new live events', newLiveEvents.length)
  console.log('number of completed events', completedLiveEvents.length)

  return [...currentEvents, ...newLiveEvents].filter(
    (event) => !completedLiveEvents.find((completedEvent) => completedEvent.id === event.id)
  )
}

export function renderScore(event: EventFragment): string {
  const getTeamScore = (teamName: string) =>
    event?.scoreUpdates
      ?.filter((s) => s && s.name === teamName)
      .reduce((acc, s) => acc + parseInt(s?.score ?? '0'), 0) ?? 0
  const homeScore = getTeamScore(event?.homeTeamName)
  const awayScore = getTeamScore(event?.awayTeamName)
  return `${homeScore} - ${awayScore}`
}
