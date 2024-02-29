import React from 'react'
import styles from './Card.module.css'
import classnames from 'classnames'

export type CardProps = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <div className={classnames(styles.card, className)}>{children}</div>
}
