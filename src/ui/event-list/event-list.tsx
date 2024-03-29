'use client'

import { EventFragment, MarketFragment } from '@/gql/documents.generated'
import { MarketOption } from '@/gql/types.generated'
import { CSSTransition } from 'react-transition-group'
import styles from './event-list.module.css'
import { ElapsedTime } from '@/ui/event-list/elapsed-time'
import { renderScore } from '@/ui/event-util'
import { Market } from './market'
import React from 'react'

export type MarketOptionWithHistory = MarketOption & { history: string }

const eventCompare = (live: boolean) => (a: EventFragment, b: EventFragment) => {
  const startA = new Date(a.startTime)
  const startB = new Date(b.startTime)
  if (startA < startB) return live ? 1 : -1
  if (startA > startB) return live ? -1 : 1
  return 0
}

export function EventList({
  events,
  marketName,
  live = false,
  updatedEvents = [],
}: {
  events: EventFragment[]
  marketName: string
  live?: boolean
  updatedEvents?: string[]
}) {
  if (events.length === 0)
    return (
      <p className="text-primary">
        {events.length === 0 &&
          (live ? 'No live events at the moment.' : 'No upcoming events at the moment.')}
      </p>
    )

  return (
    <div className={styles.content}>
      <h3 className="text-primary">{live ? 'Live now' : 'Upcoming'}</h3>
      <div className={styles.events}>
        {events.sort(eventCompare(live)).map((event: EventFragment) => {
          if (!event) return null
          const selectedMarket = event?.markets?.find(
            (market) =>
              market?.name === marketName &&
              (market.name === 'spreads'
                ? market.options?.find((option) => option?.point !== 0)
                : true)
          )

          if (!selectedMarket?.options) {
            console.log(`Event '${event.name}' market '${marketName}' has no options`)
            return null
          }

          return (
            <CSSTransition key={event.id} timeout={500} classNames="flash">
              <div
                className={`${styles.eventWrapper} ${
                  updatedEvents.includes(event.id) ? styles.flash : ''
                }`}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.headerItem}>
                    <div className={styles.headerSubItem}>{event.sport.title}</div>
                    {/*<div className={styles.headerSubItem}>{event.name}</div>*/}
                  </div>
                  <div className={styles.headerItem}>
                    <div className={styles.headerSubItem}>
                      <ElapsedTime live={live} startTime={event.startTime} />
                    </div>
                    {live && !event.sport.key.startsWith('tennis') && (
                      <div className={styles.headerSubItem2}>{renderScore(event)}</div>
                    )}
                  </div>
                </div>
                <div className={styles.oddsWrapper}>
                  <Market event={event} market={selectedMarket} live={live} />
                </div>
              </div>
            </CSSTransition>
          )
        })}
      </div>
    </div>
  )
}
