import styles from './page.module.css'
import React from 'react'

export default function Loading() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>My Bets</h1>

      <div className={styles.betCard}>
        <div className={styles.betItem}>
          <div className={styles.betHeader}>€ loading...</div>
          <div className={styles.betDetails}>
            <div className={`${styles.eventName} ${styles.smallText}`}>loading...</div>
          </div>
          <div className={styles.numbers}>
            <div className={styles.number}>
              <div className={styles.smallText}>Stake</div>
              <div>...</div>
            </div>
            <div className={styles.number}>
              <div className={styles.smallText}>To Return</div>
              <div>...</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
