import React from 'react'
import styles from './CardActions.module.css'
import classnames from 'classnames'

export type CardActionsProps = {
  children: React.ReactNode
  className?: string
}

export function CardActions({ children, className }: CardActionsProps) {
  return <div className={classnames(styles.actions, className)}>{children}</div>
}
