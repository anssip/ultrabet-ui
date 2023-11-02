'use client'

import React, { useState } from 'react'
import styles from './bet-slip.module.css'
import { MarketOption } from '@/gql/types.generated'
import { RemoveSlipOptionForm } from '@/ui/remove-slip-option-form'

export type BetSlipOption = MarketOption & { stake?: number; marketName: string; eventName: string }

// dictionary of string keys to MarketOption values
export type Slip = { [key: string]: BetSlipOption }

type Props = {
  slip: Slip
}

const BetSlip: React.FC<Props> = ({ slip }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`${styles.betslip} ${isOpen ? styles.open : styles.collapsed}`}>
      {!isOpen && (
        <div className={styles.tab} onClick={() => setIsOpen(true)}>
          Bet Slip
        </div>
      )}
      <div className={styles.header}>
        {/* Your bet slip content goes here */}
        <button className={styles.closebtn} onClick={() => setIsOpen(false)}>
          {/*  caret down */}
        </button>
      </div>
      <div className={styles.options}>
        <ol>
          {Object.keys(slip)
            .map((optionIdStr) => slip[optionIdStr])
            .map((option) => (
              <li key={option.id} className={styles.option}>
                <div className={styles.header}>
                  <RemoveSlipOptionForm option={option} />
                  <div className={styles.name}>
                    <div>{option.name}</div>
                    <div>{option.odds}</div>
                  </div>
                </div>
                <div className={styles.content}>
                  <div>{option.marketName}</div>
                  <div>{option.eventName}</div>
                </div>
              </li>
            ))}
        </ol>
      </div>
    </div>
  )
}

export default BetSlip
