import styles from './page.module.css'
import React from 'react'
import { Card } from '@/ui/card/card'
import CardHeader from '@/ui/card/card-header'
import { CardContent } from '@/ui/card/card-content'

export default function Loading() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>My Bets</h1>

      <Card className={styles.betItem}>
        <CardHeader title="Loading..." />
        <CardContent>
          <div className={styles.numbers}>
            <div className={styles.number}>
              <div>...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
