'use client'

import { Market, MarketOption } from '@/gql/types.generated'
// @ts-ignore
import styles from './event-list.module.css'
import { useUser } from '@auth0/nextjs-auth0/client'
import { EventFragment } from '@/gql/documents.generated'
import { BetSlipOption } from '@/ui/bet-slip/bet-slip'
import { useContext } from 'react'
import { SlipContext } from '@/lib/slip-context'

const initialSlipFormState = {
  message: null,
}

type Props = {
  option: MarketOption
  event: EventFragment
  market: Market
}

export function AddSlipOptionForm({ option, event, market }: Props) {
  const { user } = useUser()
  const slipSate = useContext(SlipContext)

  function handleClick(e: { preventDefault: () => void; stopPropagation: () => void }) {
    if (!user) {
      e.preventDefault()
      e.stopPropagation()
      console.log('redirecting to login')
      return (window.location.href = '/api/auth/login')
    }
  }
  if (!slipSate) return null
  return (
    <form
      action={() => {
        const betSlipOption: BetSlipOption = { ...option, event, marketName: market.name }
        slipSate?.addOption(betSlipOption)
      }}
    >
      <button
        onClick={handleClick}
        type={'submit'}
        className={`${styles.addSlipOptionButton} ${styles.oddsValue}`}
      >
        {option?.odds}
      </button>
    </form>
  )
}
