'use client'

import { MarketOption } from '@/gql/types.generated'
// @ts-ignore
import { useFormState } from 'react-dom'
import { addSlipOption } from '@/app/actions'
import styles from '@/ui/event-list.module.css'
import { useUser } from '@auth0/nextjs-auth0/client'

const initialSlipFormState = {
  message: null,
}

export function SlipOptionForm({ option }: { option: MarketOption }) {
  const { user } = useUser()
  const [slipFormState, slipFormAction] = useFormState(
    addSlipOption.bind(null, null, option),
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
