'use client'

import {
  EventFragment,
  EventStatusUpdatesDocument,
  MarketOptionUpdatesDocument,
  ScoreUpdatesDocument,
} from '@/gql/documents.generated'
import { useEffect, useState } from 'react'
import { useSubscription } from '@apollo/client'
import { MarketOption } from '@/gql/types.generated'
import { EventList } from '@/ui/event-list/event-list'
import {
  getUpdatedEventsForNewEventStatuses,
  getUpdatedEventsForNewMarketOptions,
  getUpdatedEventsForNewScores,
} from '@/ui/event-util'

export function LiveEventList({
  events,
  marketName,
}: {
  events: EventFragment[]
  marketName: string
}) {
  const [liveEvents, setLiveEvents] = useState<EventFragment[]>(events)
  const [updatedEvents, setUpdatedEvents] = useState<string[]>([])

  const { data: scoreUpdatesData, error: scoreError } = useSubscription(ScoreUpdatesDocument)
  const { data: optionsUpdateData, error: optionsError } = useSubscription(
    MarketOptionUpdatesDocument
  )
  const { data: statusUpdateData, error: statusError } = useSubscription(EventStatusUpdatesDocument)

  const error = optionsError || scoreError || statusError
  useEffect(() => {
    if (error) {
      console.error(`Subscription error: ${error.message}`)
    }
  }, [error])

  const setClearUpdatedEvents = () => {
    // Remove the updated event IDs from the state after the animation duration
    setTimeout(() => {
      setUpdatedEvents([])
    }, 2000) // adjust this value according to the duration of your animation
  }

  useEffect(() => {
    if (optionsUpdateData?.liveMarketOptionsUpdated) {
      setLiveEvents((current) => {
        const result = getUpdatedEventsForNewMarketOptions(
          current,
          optionsUpdateData.liveMarketOptionsUpdated as MarketOption[]
        )
        if (result.updatedEvents.length > 0) {
          setUpdatedEvents(result.updatedEvents)
        }
        return result.newLiveEvents
      })
      setClearUpdatedEvents()
    }
  }, [optionsUpdateData])

  useEffect(() => {
    if (scoreUpdatesData?.eventScoresUpdated) {
      console.info('scoreUpdatesData', scoreUpdatesData)
      setLiveEvents((current) =>
        getUpdatedEventsForNewScores(
          current,
          scoreUpdatesData?.eventScoresUpdated as EventFragment[]
        )
      )
      setUpdatedEvents(scoreUpdatesData?.eventScoresUpdated.map((event) => event?.id ?? ''))
      setClearUpdatedEvents()
    }
  }, [scoreUpdatesData])

  useEffect(() => {
    if (statusUpdateData?.eventStatusUpdated) {
      console.info('statusUpdateData', statusUpdateData)
      setLiveEvents((current) =>
        getUpdatedEventsForNewEventStatuses(
          current,
          statusUpdateData?.eventStatusUpdated as EventFragment[]
        )
      )
    }
  }, [statusUpdateData])
  return (
    <EventList
      events={liveEvents}
      updatedEvents={updatedEvents}
      live={true}
      marketName={marketName}
    />
  )
}
