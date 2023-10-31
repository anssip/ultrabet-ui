'use client'

import { EventFragment } from '@/gql/documents.generated'
import { MarketOption } from '@/gql/types.generated'
import { CSSTransition } from 'react-transition-group'
import Link from 'next/link'
import styles from './event-list.module.css'
// @ts-ignore
import { useFormState } from 'react-dom'
import { addSlipOption } from '@/app/actions'
import { useUser } from '@auth0/nextjs-auth0/client'
import { ElapsedTime } from '@/ui/elapsed-time'

type MarketOptionWithHistory = MarketOption & { history: string }

function renderScore(event: EventFragment): string {
  const getTeamScore = (teamName: string) =>
    event?.scoreUpdates
      ?.filter((s) => s && s.name === teamName)
      .reduce((acc, s) => acc + parseInt(s?.score ?? '0'), 0) ?? 0
  const homeScore = getTeamScore(event?.homeTeamName)
  const awayScore = getTeamScore(event?.awayTeamName)
  return `${homeScore} - ${awayScore}`
}

const initialSlipFormState = {
  message: null,
}

function SlipOptionForm({ option }: { option: MarketOption }) {
  const { user } = useUser()
  const [slipFormState, slipFormAction] = useFormState(
    addSlipOption.bind(null, user ?? null, option),
    initialSlipFormState
  )
  function handleClick(e: { preventDefault: () => void; stopPropagation: () => void }) {
    if (!user) {
      e.preventDefault()
      e.stopPropagation()
      console.log('redirecting to login')
      return (window.location.href = '/api/auth/login')
    }
  }
  return (
    <form action={slipFormAction}>
      <button
        onClick={handleClick}
        type={'submit'}
        className={`${styles.addSlipOptionButton} ${styles.oddsValue}`}
      >
        {option?.odds}
      </button>
      <p aria-live="polite" className="sr-only">
        {slipFormState?.message}
      </p>
    </form>
  )
}

export function EventList({
  events,
  live = false,
  updatedEvents = [],
}: {
  events: EventFragment[]
  live?: boolean
  updatedEvents?: string[]
}) {
  const sorted = events
    // .filter((e) => e.isLive || new Date(e.startTime) > new Date())
    .sort((a, b) => {
      const startA = new Date(a.startTime)
      const startB = new Date(b.startTime)
      if (startA < startB) return live ? 1 : -1
      if (startA > startB) return live ? -1 : 1
      return 0
    })
  console.log(`Total ${live ? 'live' : 'upcoming'} events: ${events.length}`, events)
  if (events.length === 0)
    return (
      <div className={styles.noEventsNote}>
        No {live && 'live'} events at the moment. See{' '}
        <Link href={`/${live ? 'upcoming' : ''}`}>{live ? 'upcoming' : 'live'} events</Link>
      </div>
    )
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
                    <SlipOptionForm option={option} />
                    <p className={styles.oddsHistory}>{option?.history ?? ''}</p>
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
