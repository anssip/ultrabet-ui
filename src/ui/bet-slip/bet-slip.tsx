'use client'

import React, { useContext, useState } from 'react'
import styles from './bet-slip.module.css'
import { MarketOption } from '@/gql/types.generated'
import { PlaceBetForm } from '@/ui/bet-slip/place-bet-form'
import { EventFragment } from '@/gql/documents.generated'
import classnames from 'classnames'
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
        <div className={styles.betSlipTitle}>
          {getSlipTitle()}
          <div className={styles.showAction}>Show selections ^</div>
        </div>
      </div>
      <div className={styles.header}>
        <button
          className={classnames(styles.closebtn, isOpen ? styles.visible : styles.hidden)}
          onClick={() => setIsOpen(false)}
        ></button>
      </div>
      <div className={styles.options}>
        <PlaceBetForm />
      </div>
    </div>
  )
}

export default BetSlip
