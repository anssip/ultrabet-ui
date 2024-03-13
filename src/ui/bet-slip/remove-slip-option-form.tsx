'use client'

import { MarketOption } from '@/gql/types.generated'
// @ts-ignore
import { useFormStatus } from 'react-dom'
import styles from '@/ui/bet-slip/bet-slip.module.css'
import { useContext } from 'react'
import { SlipContext } from '@/lib/slip-context'

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
  const slipSate = useContext(SlipContext)
  if (!slipSate) return null
  const { removeOption } = slipSate

  return (
    <form
      action={(formData: FormData) => {
        removeOption(option.id)
      }}
    >
      <DeleteButton />
    </form>
  )
}
