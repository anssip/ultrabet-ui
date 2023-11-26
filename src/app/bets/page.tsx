import { getClient } from '@/lib/client'
import { ListBetsDocument } from '@/gql/documents.generated'
import styles from './page.module.css'
import React, { Suspense } from 'react'
import { getAccessToken } from '@auth0/nextjs-auth0'
import { Bet, BetOption, Maybe } from '@/gql/types.generated'
import { getLongBetName } from '@/lib/util'

export const revalidate = 60
// export const dynamic = 'force-dynamic'

const BetListItem: React.FC<{ bet: Bet }> = ({ bet }) => {
  const betType = getLongBetName(bet.betOptions?.length ?? 1)

  const betOptions = bet.betOptions?.map((option: Maybe<BetOption>) => (
    <div key={option?.id} className={styles.betDetails}>
      <div className={styles.marketOption}>
        <div>{option?.marketOption?.name}</div>
        <div>{option?.marketOption.odds}</div>
      </div>
      <div className={`${styles.eventName} ${styles.smallText}`}>
        {option?.marketOption.market?.event?.homeTeamName} vs{' '}
        {option?.marketOption.market?.event?.awayTeamName}
      </div>
    </div>
  ))

  return (
    <div className={styles.betItem}>
      <div className={styles.betHeader}>
        €{bet.stake} {betType}
      </div>
      {betOptions}
      <div className={styles.numbers}>
        <div className={styles.number}>
          <div className={styles.smallText}>Stake</div>
          <div>€{bet.stake}</div>
        </div>
        <div className={styles.number}>
          <div className={styles.smallText}>To Return</div>
          <div>€{bet.potentialWinnings}</div>
        </div>
      </div>
    </div>
  )
}

async function BetList() {
  const { accessToken } = await getAccessToken()
  const data = await getClient(true).query({
    query: ListBetsDocument,
    context: {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    },
  })

  const bets: Bet[] = data.data.listBets as Bet[]

  return bets?.map((bet) => (
    <div key={bet.id} className={styles.betCard}>
      <BetListItem bet={bet} />
    </div>
  ))
}

export default async function Page() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>My Bets</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BetList />
      </Suspense>
    </main>
  )
}
