'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom'
import { placeBet } from '@/app/actions'
import styles from '@/ui/bet-slip/bet-slip.module.css'
import globals from '@/ui/globals.module.css'
import React, { useState } from 'react'
import { Slip } from '@/ui/bet-slip/bet-slip'
import { MarketOption } from '@/gql/types.generated'

type Props = {
  slip: Slip
}

function SubmitButton({ onClick }: { onClick: () => Promise<void> }) {
  const { pending } = useFormStatus()
  return (
    <button
      type={'submit'}
      aria-disabled={pending}
      className={`${globals.button} ${globals.primary}`}
      onClick={onClick}
    >
      Place bet
    </button>
  )
}

const initialState = {
  message: null,
}

function getLongBetName(length: number) {
  const names = new Map([
    [2, 'Double'],
    [3, 'Treble'],
    [4, 'Fourfold'],
    [5, 'Fivefold'],
    [6, 'Sixfold'],
    [7, 'Sevenfold'],
    [8, 'Eightfold'],
    [9, 'Ninefold'],
    [10, 'Tenfold'],
  ])
  return names.get(length) ?? `${length}-fold`
}

export function PlaceBetForm({ slip }: Props) {
  const [slipWithStakes, setSlipWithStakes] = useState<Slip>(slip)

  const { user } = useUser()
  // const [betFormState, betFormAction] = useFormState(
  //   placeBet.bind(null, user ?? null, slip),
  //   initialState
  // )
  const placeBet = async (): Promise<void> => {
    // TODO: get stake values from the form and set into the slip
    await fetch('/api/slip', { method: 'POST', body: JSON.stringify(slip) })
  }

  const options = [...Object.keys(slip)]

  function renderOption(
    option: MarketOption & { stake?: number; marketName: string; eventName: string }
  ) {
    return (
      <li key={option.id} className={styles.option}>
        <div className={styles.header}>
          <div className={styles.name}>
            <div>{option.name}</div>
            <div>{option.odds.toFixed(2)}</div>
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
    )
  }

  return (
    <form className={styles.betForm}>
      <ol className={`${styles.right} ${styles.column}`}>
        {options.map((optionIdStr) => slip[optionIdStr]).map(renderOption)}
        {options.length > 1 &&
          renderOption({
            odds: options.map((optionId) => slip[optionId]).reduce((acc, o) => acc * o.odds, 1),
            marketName: '',
            eventName: '',
            id: 'long',
            name: getLongBetName(options.length),
          })}
      </ol>
      {options.length > 0 ? (
        <div className={styles.actions}>
          <SubmitButton onClick={placeBet} />
        </div>
      ) : (
        'Click on the odds boxes to add one or more bets to your slip'
      )}
    </form>
  )
}
