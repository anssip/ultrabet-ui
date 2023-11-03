'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom'
import { placeBet } from '@/app/actions'
import styles from '@/ui/bet-slip/bet-slip.module.css'
import globals from '@/ui/globals.module.css'
import React from 'react'
import { Slip } from '@/ui/bet-slip/bet-slip'

type Props = {
  slip: Slip
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type={'submit'}
      aria-disabled={pending}
      className={`${globals.button} ${globals.primary}`}
    >
      Place bet
    </button>
  )
}

const initialState = {
  message: null,
}

export function PlaceBetForm({ slip }: Props) {
  const { user } = useUser()
  const [betFormState, betFormAction] = useFormState(
    placeBet.bind(null, user ?? null, slip),
    initialState
  )

  return (
    <form action={betFormAction}>
      <ol className={`${styles.right} ${styles.column}`}>
        {Object.keys(slip)
          .map((optionIdStr) => slip[optionIdStr])
          .map((option) => (
            <li key={option.id} className={styles.option}>
              <div className={styles.header}>
                <div className={styles.name}>
                  <div>{option.name}</div>
                  <div>{option.odds}</div>
                </div>
              </div>
              <div className={styles.content}>
                <div>{option.marketName}</div>
                <div>{option.eventName}</div>
              </div>
              <input
                className={styles.stake}
                type="number"
                name={`${option.id}-stake`}
                id={`${option.id}-stake`}
                min={0}
                step={0.01}
                placeholder="Enter stake"
                required
              />
            </li>
          ))}
      </ol>

      <div className={styles.actions}>
        <SubmitButton />
      </div>
      <p aria-live="polite" className="sr-only">
        {betFormState?.message}
      </p>
    </form>
  )
}
