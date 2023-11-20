'use client'

import React, { useState } from 'react'
import styles from './bet-slip.module.css'
import { MarketOption } from '@/gql/types.generated'
import { RemoveSlipOptionForm } from '@/ui/bet-slip/remove-slip-option-form'
import { PlaceBetForm } from '@/ui/bet-slip/place-bet-form'

export type BetSlipOption = MarketOption & { stake?: number; marketName: string; eventName: string }

export type Slip = { [key: string]: BetSlipOption }

type Props = {
  slip: Slip
}

const BetSlip: React.FC<Props> = ({ slip }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`${styles.betslip} ${isOpen ? styles.open : styles.collapsed}`}>
      <div
        className={`${styles.tab} ${isOpen ? styles.hidden : styles.visible}`}
        onClick={() => setIsOpen(true)}
      >
        Bet Slip
      </div>
      <div className={styles.header}>
        <button className={styles.closebtn} onClick={() => setIsOpen(false)}></button>
      </div>
      <div className={styles.options}>
        <PlaceBetForm slip={slip} />
      </div>
    </div>
  )
}

export default BetSlip
