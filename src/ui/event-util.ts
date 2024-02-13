import { EventFragment } from '@/gql/documents.generated'
import { BetOption, MarketOption } from '@/gql/types.generated'
import * as R from 'ramda'
import { BetSlipOption } from '@/ui/bet-slip/bet-slip'

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
  if (!event?.scoreUpdates?.length) {
    return '0 - 0'
  }
  const getTeamScore = (
    teamName: string // get maximum from the array
  ) =>
    Math.max(
      ...(event?.scoreUpdates
        ?.filter((s) => s && s.name === teamName)
        .map((s) => parseInt(s?.score ?? '0')) ?? [0])
    )

  const homeScore = getTeamScore(event?.homeTeamName)
  const awayScore = getTeamScore(event?.awayTeamName)
  return `${homeScore} - ${awayScore}`
}

export function getOptionPointLabel(
  option: {
    point?: number | null
    description?: string | null
  } | null,
  marketName: string
): string {
  if (!option) return ''
  if (!option.point) return ''
  if (marketName === 'totals') return `${option.point}`
  return option.point > 0 ? `+${option.point}` : `${option.point}`
}

export function getSpreadOptionLabel(event: EventFragment | null, homeTeam: boolean) {
  if (!event) return ''
  const spreadMarket = event.markets?.find((m) => m?.name === 'spreads')
  if (!spreadMarket) return ''
  const teamOption = spreadMarket.options?.find(
    (o) => o?.name === (homeTeam ? event.homeTeamName : event.awayTeamName)
  )
  if (!teamOption) return ''
  return getOptionPointLabel(teamOption, spreadMarket.name)
}
