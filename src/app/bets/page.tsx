import { getClient } from '@/lib/client'
import { ListBetsDocument } from '@/gql/documents.generated'
import styles from './page.module.css'
import React from 'react'
import { getAccessToken } from '@auth0/nextjs-auth0'
import { Bet, BetOption, BetStatus, Maybe } from '@/gql/types.generated'
import { fetchAccessToken, getLongBetName } from '@/lib/util'
import { redirect } from 'next/navigation'
import { formatTime } from '@/ui/date-util'
import { getOptionPointLabel, getSpreadOptionLabel, renderScore } from '@/ui/event-util'
import { Card } from '@/ui/card/card'
import CardHeader from '@/ui/card/card-header'
import { CardContent } from '@/ui/card/card-content'

export const revalidate = 60

const BetListItem: React.FC<{ bet: Bet }> = ({ bet }) => {
  const betType = getLongBetName(bet.betOptions?.length ?? 1)

  const betWinLabel = (status: BetStatus): string => {
    return status === BetStatus.Won ? 'Won' : 'To Return'
  }
  const options = bet.betOptions?.filter((option) => !!option) as BetOption[]
  const betOptions = options.map((option: BetOption) => {
    const event = option?.marketOption.market?.event
    return (
      <li key={option?.id} className={styles.betDetails}>
        <div className={styles.marketOption}>
          <div>
            <span
              className={styles.status + ' ' + styles[`status-${option?.status?.toLowerCase()}`]}
            />
            {option?.marketOption?.name}{' '}
            {option &&
              getOptionPointLabel(
                option.marketOption ?? null,
                option.marketOption?.market?.name ?? 'totals'
              )}{' '}
            <span className={styles.smallestText}>{option?.marketOption.id}</span>
          </div>
          <div>{option?.marketOption.odds}</div>
        </div>
        <div className={`${styles.eventName} ${styles.smallText}`}>
          {option?.marketOption.market?.event?.homeTeamName}{' '}
          {getSpreadOptionLabel(option.marketOption.market?.event ?? null, true)} vs{' '}
          {option?.marketOption.market?.event?.awayTeamName}{' '}
          {getSpreadOptionLabel(option.marketOption.market?.event ?? null, false)}
          {event && !event.sport?.key.startsWith('tennis') && (
            <span className={styles.score}>
              {renderScore(event)}{' '}
              <span className={styles.live}>
                {!event?.result && event.isLive && !event.completed ? ' live' : ''}
              </span>
            </span>
          )}
        </div>
      </li>
    )
  })

  return (
    <Card className={styles.betItem}>
      <CardHeader className={styles.betHeader} title={`$${bet.stake} ${betType}`}>
        <div className={styles.betHeader}>
          <div className={styles.betMeta}>Placed {formatTime(new Date(bet.createdAt))}</div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className={styles.options}>{betOptions}</ul>
        <div className={styles.numbers}>
          <div className={styles.number}>
            <div className={styles.smallText}>Stake</div>
            <div>€{bet.stake}</div>
          </div>
          <div className={styles.number}>
            <div className={styles.smallText}>{betWinLabel(bet.status)}</div>
            <div>€{Number(bet.potentialWinnings).toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function Page() {
  const accessToken = await fetchAccessToken()
  if (!accessToken) {
    console.info('No access token, redirecting to login')
    redirect('/api/auth/login')
  }
  const data = await getClient(true).query({
    query: ListBetsDocument,
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  })
  const bets: Bet[] = data.data.listBets as Bet[]

  return (
    <main className={styles.main}>
      <h1 className={styles.header}>My Bets</h1>
      {bets?.map((bet) => (
        <BetListItem key={bet.id} bet={bet} />
      ))}
    </main>
  )
}
