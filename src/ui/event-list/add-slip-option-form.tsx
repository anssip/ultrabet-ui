'use client'

import { Market, MarketOption } from '@/gql/types.generated'
// @ts-ignore
import { useFormState } from 'react-dom'
import { addSlipOption } from '@/app/actions'
import styles from './event-list.module.css'
import { useUser } from '@auth0/nextjs-auth0/client'
import { EventFragment } from '@/gql/documents.generated'
import { BetSlipOption } from '@/ui/bet-slip/bet-slip'
import { getOptionPointLabel } from '@/ui/event-util'
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
  if (!slipSate) return null
  const { addOption } = slipSate

  const betSlipOption: BetSlipOption = { ...option, event, marketName: market.name }
  const [slipFormState, slipFormAction] = useFormState(
    addSlipOption.bind(null, user ?? null, betSlipOption),
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
    <form
      action={() => {
        addOption(option)
      }}
    >
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
