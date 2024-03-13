import React from 'react'
import styles from './card-content.module.css'
import classnames from 'classnames'

export type CardContentProps = {
  children: React.ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={classnames(styles.content, className)}>{children}</div>
}
