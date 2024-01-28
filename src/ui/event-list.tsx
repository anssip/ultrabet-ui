'use client'

import { EventFragment } from '@/gql/documents.generated'
import { MarketOption } from '@/gql/types.generated'
import { CSSTransition } from 'react-transition-group'
import Link from 'next/link'
import styles from './event-list.module.css'
// @ts-ignore
import { ElapsedTime } from '@/ui/elapsed-time'
import { AddSlipOptionForm } from '@/ui/bet-slip/add-slip-option-form'
import { renderScore } from '@/ui/event-util'

type MarketOptionWithHistory = MarketOption & { history: string }

export function EventList({
  events,
  live = false,
  updatedEvents = [],
}: {
  events: EventFragment[]
  live?: boolean
  updatedEvents?: string[]
}) {
  if (events.length === 0)
    return (
      <div className={styles.noEventsNote}>
        No {live && 'live'} events at the moment. See{' '}
        <Link href={`/${live ? 'upcoming' : ''}`}>{live ? 'upcoming' : 'live'} events</Link>
      </div>
    )
  const sorted = events.sort((a, b) => {
    const startA = new Date(a.startTime)
    const startB = new Date(b.startTime)
    if (startA < startB) return live ? 1 : -1
    if (startA > startB) return live ? -1 : 1
    return 0
  })
  // console.log(`Total ${live ? 'live' : 'upcoming'} events: ${events.length}`, events)
  return (
    <div className={styles.events}>
      {sorted.map((event) => {
        if (!event) return null
        // TODO: show all markets
        const headToHeadMarket = event?.markets?.find((market) =>
          ['h2h', 'h2h_lay'].includes(market?.name ?? '')
        )

        if (!headToHeadMarket?.options) {
          console.log('no h2h market')
          return null
        }
        let options = headToHeadMarket.options as MarketOptionWithHistory[]
        if (options.length !== 2) {
          options = [options[0], options[2], options[1]]
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
                  <div className={styles.headerSubItem}>{event.name}</div>
                  <div className={styles.headerSubItem}>{event.sport.title}</div>
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
                {options.map((option: MarketOptionWithHistory) => (
                  <div key={option?.id} className={styles.oddsBox}>
                    <div className={styles.optionName}>{option?.name}</div>
                    <AddSlipOptionForm option={option} event={event} market={headToHeadMarket} />
                    <div className={styles.oddsHistory}>{option?.history ?? ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </CSSTransition>
        )
      })}
    </div>
  )
}
