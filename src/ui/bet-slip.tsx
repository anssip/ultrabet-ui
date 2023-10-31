'use client'

import React, { useState } from 'react'
import styles from './bet-slip.module.css'
import { MarketOption } from '@/gql/types.generated'

type Props = {
  slipOptions: MarketOption[]
}

const BetSlip: React.FC<Props> = ({ slipOptions }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`${styles.betslip} ${isOpen ? styles.open : ''}`}>
      {!isOpen && (
        <div className={styles.tab} onClick={() => setIsOpen(true)}>
          Bet Slip
        </div>
      )}
      <div className={styles.content}>
        {/* Your bet slip content goes here */}
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
          X
        </button>
      </div>
      <div className={styles.options}>
        <ol>
          {slipOptions.map((option) => (
            <li key={option.id}>
              {option.name} - {option.odds}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default BetSlip
