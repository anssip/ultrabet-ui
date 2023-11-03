'use client'

import { MarketOption } from '@/gql/types.generated'
// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom'
import { removeSlipOption } from '@/app/actions'
import styles from '@/ui/bet-slip/bet-slip.module.css'
import { useUser } from '@auth0/nextjs-auth0/client'

const initialSlipFormState = {
  message: null,
}

type Props = {
  option: MarketOption
}

function DeleteButton() {
  const { pending } = useFormStatus()
  return (
    <button type={'submit'} aria-disabled={pending} className={`${styles.iconButton}`}>
      X
    </button>
  )
}

export function RemoveSlipOptionForm({ option }: Props) {
  const { user } = useUser()
  const [slipFormState, slipFormAction] = useFormState(
    removeSlipOption.bind(null, user ?? null, option),
    initialSlipFormState
  )
  return (
    <form action={slipFormAction}>
      <DeleteButton />
      <p aria-live="polite" className="sr-only">
        {slipFormState?.message}
      </p>
    </form>
  )
}
