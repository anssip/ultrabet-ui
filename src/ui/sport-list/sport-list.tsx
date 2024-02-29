import { EventFragment, SportWithEventsFragment } from '@/gql/documents.generated'
import { LiveEventList } from '@/ui/event-list/live-event-list'
import { EventList } from '@/ui/event-list/event-list'
import React from 'react'
import { Card } from '@/ui/card/card'
import CardHeader from '@/ui/card/card-header'
import { CardContent } from '@/ui/card/card-content'
import styles from './sport-list.module.css'

const eventHasOptionsInMarket =
  (market: string) =>
  (event: EventFragment): boolean => {
    const selectedMarket = event?.markets?.find(
      (m) =>
        m?.name === market && (m.name === 'spreads' ? m.options?.find((o) => o?.point !== 0) : true)
    )
    return Number(selectedMarket?.options?.length) > 0
  }

export type SportListProps = {
  sports: SportWithEventsFragment[]
  market: string
}
export default function SportList({ sports, market }: SportListProps) {
  const sportsWithEvents = sports.filter((sport) => sport?.events?.length)
  const sportsWithoutEvents = sports.filter((sport) => !sport?.events?.length)

  return (
    <div className={styles.container}>
      {[...sportsWithEvents, ...sportsWithoutEvents].map((sport) => {
        const liveEvents = (
          sport.events?.filter((event) => event?.isLive) as EventFragment[]
        ).filter(eventHasOptionsInMarket(market))
        const upcomingEvents = (
          sport.events?.filter((event) => !event?.isLive) as EventFragment[]
        ).filter(eventHasOptionsInMarket(market))

        if (!liveEvents.length && !upcomingEvents.length)
          return (
            <Card key={sport.id}>
              <CardHeader title={sport.title} />
              <CardContent className={styles.closedMarketContent}>
                <p>Market closed. {sport.activeEventCount} events will open soon.</p>
              </CardContent>
            </Card>
          )

        return (
          <Card key={sport.id}>
            <CardHeader title={sport.title} />
            <CardContent>
              <LiveEventList events={liveEvents} marketName={market} />
              <EventList events={upcomingEvents} marketName={market} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
