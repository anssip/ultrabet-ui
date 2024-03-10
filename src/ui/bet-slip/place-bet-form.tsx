'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import styles from '@/ui/bet-slip/bet-slip.module.css'
import globals from '@/ui/globals.module.css'
import React, { useContext, useEffect, useState } from 'react'
import { BetSlipOption, Slip } from '@/ui/bet-slip/bet-slip'
import { Bet, Market, MarketOption } from '@/gql/types.generated'
import { RemoveSlipOptionForm } from '@/ui/bet-slip/remove-slip-option-form'
import { useRouter } from 'next/navigation'
import { getLongBetName } from '@/lib/util'
import { getOptionPointLabel, getSpreadOptionLabel } from '@/ui/event-util'
import useSlip, { PlaceBetResponse } from '@/lib/useSlip'
import { SlipContext, SlipType } from '@/lib/slip-context'
import { SportWithEventsFragment } from '@/gql/documents.generated'
import { removeSlipOption } from '@/app/actions'

export type CreatedBets = {
  singles: Bet[]
  long?: Bet[]
}

function SubmitButton({
  onClick,
  loading,
}: {
  onClick: (e: { preventDefault: () => void; stopPropagation: () => void }) => void
  loading: boolean
}) {
  return (
    <button
      type={'submit'}
      aria-disabled={loading}
      className={`${globals.button} ${globals.primary} ${loading ? styles.submitting : ''}`}
      onClick={onClick}
    >
      {loading ? 'Hold on...' : 'Place bet'}
    </button>
  )
}

const initialState = {
  message: null,
}

export type PlaceBetFormProps = {
  sports: SportWithEventsFragment[]
}

export function PlaceBetForm({ sports }: PlaceBetFormProps) {
  const slipState: SlipType | null = useContext(SlipContext)
  const [stakes, setStakes] = useState<Map<string, number>>(new Map())
  const [longStake, setLongStake] = useState<number | null>(null)

  const optionIds = slipState?.options?.map((option) => option.id) ?? []
  const [longOption, setLongOption] = useState<BetSlipOption | null>(null)
  const [createdBetsCount, setCreatedBetsCount] = useState(0)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const events = sports.flatMap((sport) => sport.events ?? [])

  const getSingles = (): BetSlipOption[] => {
    return (
      slipState?.options.map((option) => {
        return {
          ...option,
          stake: stakes.get(option.id) ?? 0,
          event: option.market?.event ?? null,
          marketName: option.market?.name ?? '',
        }
      }) ?? []
    )
  }

  const getLongOption = (): BetSlipOption | null => {
    return (longStake ?? 0) > 0
      ? {
          id: 'long',
          stake: longStake as number,
          event: null,
          marketName: '',
          name: getLongBetName(optionIds.length),
          odds: slipState?.options.reduce((acc, o) => acc * o.odds, 1) ?? 0,
        }
      : null
  }

  const placeBet = (e: { preventDefault: () => void; stopPropagation: () => void }) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    slipState?.postBet(getSingles(), getLongOption()).then(
      (bets: PlaceBetResponse) => {
        setLoading(false)
        const count = (bets.singles?.length ?? 0) + (bets.long ? 1 : 0)
        router.refresh()
        setCreatedBetsCount(count)

        setTimeout(() => {
          setCreatedBetsCount(0)
        }, 3000)
      },
      (error) => {
        setLoading(false)
        console.error('Error placing bet', error)
      }
    )
  }

  function renderOption(option: MarketOption) {
    if (!option) return null

    function renderEventInfo() {
      // find the event that has the market that has the option
      const event = events.find((e) => {
        return !!e?.markets?.find((m) =>
          m?.options?.find((o: MarketOption | null) => o?.id === option.id)
        )
      })
      console.log('event', event)
      if (!event) {
        return null
      }
      return (
        <>
          {event.homeTeamName} {getSpreadOptionLabel(event, true)} vs {event.awayTeamName}{' '}
          {getSpreadOptionLabel(event, false)}
        </>
      )
    }

    // console.log('option', option, event)
    return (
      <li key={option.id} className={styles.option}>
        <div className={styles.optionInfo}>
          <div className={styles.header}>
            <div className={styles.name}>
              <div>
                {option.name} {getOptionPointLabel(option, option.market?.name ?? '')}
              </div>
              <div>{option.odds.toFixed(2)}</div>
            </div>
          </div>
          <div className={styles.content}>
            <div>{option.market?.name}</div>
            <div>{event && renderEventInfo()}</div>
          </div>
        </div>
        <input
          className={styles.stake}
          type="number"
          name={`${option.id}-stake`}
          id={`${option.id}-stake`}
          min={0}
          step={1}
          placeholder="Stake"
          required
          value={option.id === 'long' ? longStake ?? '' : stakes.get(option.id) ?? ''}
          onChange={(e) => {
            if (option.id === 'long') {
              return setLongStake(e.target.value === '' ? null : Number(e.target.value))
            }
            const newStakes = new Map(stakes)
            if (e.target.value === '') {
              newStakes.delete(option.id)
              setStakes(newStakes)
            } else {
              newStakes.set(option.id, Number(e.target.value))
              setStakes(newStakes)
            }
          }}
        />
      </li>
    )
  }

  if (createdBetsCount > 0) {
    return (
      <p>
        {createdBetsCount > 1 ? createdBetsCount : 'Your'} bet
        {createdBetsCount > 1 ? 's were' : ' was'} placed!
      </p>
    )
  }
  if (!slipState?.options) return null
  const long = slipState?.options.find((option) => option.id === 'long')
  return (
    <>
      <ol className={styles.column}>
        {slipState?.options.map((option) => (
          <li key={option.id} className={styles.option}>
            <div className={styles.header}>
              <RemoveSlipOptionForm option={option} />
            </div>
          </li>
        ))}
      </ol>
      <form className={styles.betForm}>
        <ol className={`${styles.right} ${styles.column}`}>
          {slipState?.options.map(renderOption)}
          {optionIds.length > 1 &&
            renderOption({
              id: 'long',
              name: getLongBetName(optionIds.length),
              odds: slipState.options.reduce((acc, o) => acc * o.odds, 1),
            })}
        </ol>
        {optionIds.length > 0 ? (
          <div className={styles.actions}>
            <SubmitButton onClick={placeBet} loading={loading} />
          </div>
        ) : (
          <div className={styles.empty}>
            Click on the odds to add one or more bets to your slip!
          </div>
        )}
      </form>
    </>
  )
}
