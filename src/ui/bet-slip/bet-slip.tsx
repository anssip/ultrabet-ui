'use client'

import React, { useContext, useState } from 'react'
import styles from './bet-slip.module.css'
import { MarketOption } from '@/gql/types.generated'
import { PlaceBetForm } from '@/ui/bet-slip/place-bet-form'
import { EventFragment } from '@/gql/documents.generated'
import { Card } from '@/ui/card/card'
import classnames from 'classnames'
import useSlip from '@/lib/useSlip'
import { SlipContext } from '@/lib/slip-context'

export type BetSlipOption = MarketOption & {
  stake?: number
  marketName: string
  event: EventFragment | null
}

export type Slip = { [key: string]: BetSlipOption }

const BetSlip = () => {
  const [isOpen, setIsOpen] = useState(true)
  const slipState = useContext(SlipContext)
  console.log('BetSlip: slipState', slipState)
  const options = slipState?.options ?? []

  const getSlipTitle = () => {
    if (!options) {
      return 'Bet Slip'
    }
    if (options.length === 1) {
      return 'Single Bet'
    }
    if (options.length > 1) {
      return 'Long Bet'
    }
    return 'Bet Slip'
  }

  const handleOptionRemoved = (option: MarketOption) => {}

  return (
    <div className={classnames(styles.betslip, isOpen ? styles.open : styles.collapsed)}>
      <div
        className={`${styles.betslip} ${isOpen ? styles.hidden : styles.visible}`}
        onClick={() => setIsOpen(true)}
      >
        {getSlipTitle()}
      </div>
      <div className={styles.header}>
        <button
          className={classnames(styles.closebtn, isOpen ? styles.visible : styles.hidden)}
          onClick={() => setIsOpen(false)}
        ></button>
      </div>
      <div className={styles.options}>
        {/*TODO: pass a callback to PlaceBetForm to know when a bet is placed, then reload slip via*/}
        {/* the new hook. Same callback is also called when an option is removed from slip. */}
        <PlaceBetForm />
      </div>
    </div>
  )
}

export default BetSlip
