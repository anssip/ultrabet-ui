'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
// @ts-ignore
import { useFormState, useFormStatus } from 'react-dom'
import styles from '@/ui/bet-slip/bet-slip.module.css'
import globals from '@/ui/globals.module.css'
import React, { useEffect, useState } from 'react'
import { BetSlipOption, Slip } from '@/ui/bet-slip/bet-slip'
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
  const optionIds = Object.keys(slip)
  const [longOption, setLongOption] = useState<BetSlipOption | null>(null)

  useEffect(() => {
    const ids = Object.keys(slip)
    setLongOption({
      odds: ids.map((optionId) => slip[optionId]).reduce((acc, o) => acc * o.odds, 1),
      marketName: '',
      eventName: '',
      id: 'long',
      name: getLongBetName(ids.length),
      stake: 0,
    })
  }, [slip])

  useEffect(() => {
    // update slipWithStakes when slip changes
    const newSlipWithStakes = Object.keys(slip).reduce((acc, optionId) => {
      const option = slip[optionId]
      return { ...acc, [optionId]: { ...option, stake: slipWithStakes[optionId]?.stake ?? 0 } }
    }, slipWithStakes)

    if (Object.keys(newSlipWithStakes).length !== Object.keys(slipWithStakes).length) {
      setSlipWithStakes(newSlipWithStakes)
    }
  }, [slip, slipWithStakes])

  const { user } = useUser()
  const placeBet = async (): Promise<void> => {
    await fetch('/api/slip', {
      method: 'POST',
      body: JSON.stringify({ singles: slipWithStakes, long: longOption }),
    })
  }

  function getStake(slip: Slip, optionId: string) {
    const option = slip[optionId]
    return option?.stake ?? 0
  }

  function setStake(slip: Slip, option: BetSlipOption, stake: number): void {
    if (option.id === 'long') {
      return setLongOption({ ...option, stake })
    }
    setSlipWithStakes({ ...slip, [option.id]: { ...option, stake } })
  }

  function renderOption(
    option: MarketOption & { stake?: number; marketName: string; eventName: string }
  ) {
    if (!option) return null
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
          step={1}
          placeholder="Enter stake"
          required
          value={option.id === 'long' ? longOption?.stake : getStake(slipWithStakes, option.id)}
          onChange={(e) => {
            setStake(slipWithStakes, option, parseFloat(e.target.value))
          }}
        />
      </li>
    )
  }

  return (
    <form className={styles.betForm}>
      <ol className={`${styles.right} ${styles.column}`}>
        {optionIds.map((optionIdStr) => slipWithStakes[optionIdStr]).map(renderOption)}
        {optionIds.length > 1 && longOption && renderOption(longOption)}
      </ol>
      {optionIds.length > 0 ? (
        <div className={styles.actions}>
          <SubmitButton onClick={placeBet} />
        </div>
      ) : (
        'Click on the odds boxes to add one or more bets to your slip'
      )}
    </form>
  )
}
