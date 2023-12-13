import { getClient } from '@/lib/client'
import { ListBetsDocument } from '@/gql/documents.generated'
import styles from './page.module.css'
import React from 'react'
import { getAccessToken } from '@auth0/nextjs-auth0'
import { Bet, BetOption, BetStatus, Maybe } from '@/gql/types.generated'
import { getLongBetName } from '@/lib/util'
import { redirect } from 'next/navigation'
import { formatTime } from '@/ui/date-util'

export const revalidate = 60

// export const dynamic = 'force-dynamic'

function betStatus(bet: Bet) {}

const BetListItem: React.FC<{ bet: Bet }> = ({ bet }) => {
  const betType = getLongBetName(bet.betOptions?.length ?? 1)

  const betWinLabel = (status: BetStatus): string => {
    return status === BetStatus.Won ? 'Won' : 'To Return'
  }

  const betOptions = bet.betOptions?.map((option: Maybe<BetOption>) => (
    <li key={option?.id} className={styles.betDetails}>
      <div className={styles.marketOption}>
        <div>
          <span
            className={styles.status + ' ' + styles[`status-${option?.status?.toLowerCase()}`]}
          />
          {option?.marketOption?.name}
        </div>
        <div>{option?.marketOption.odds}</div>
      </div>
      <div className={`${styles.eventName} ${styles.smallText}`}>
        {option?.marketOption.market?.event?.homeTeamName} vs{' '}
        {option?.marketOption.market?.event?.awayTeamName}
      </div>
    </li>
  ))

  return (
    <div className={styles.betItem}>
      <div className={styles.betHeader}>
        <div>
          €{bet.stake} {betType}
        </div>
        <div className={styles.betMeta}>Placed {formatTime(new Date(bet.createdAt))}</div>
      </div>
      <ul>{betOptions}</ul>
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
    </div>
  )
}

export async function fetchAccessToken() {
  try {
    const { accessToken } = await getAccessToken()
    return accessToken
  } catch (e) {
    return null
  }
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
