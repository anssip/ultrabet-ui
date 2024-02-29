import React from 'react'
import styles from './card-header.module.css'
import classnames from 'classnames'

export type CardHeaderProps = {
  avatar?: React.ReactNode // Optional avatar or icon
  title: React.ReactNode
  subheader?: React.ReactNode
  className?: string
}

function CardHeader({ avatar, title, subheader, className }: CardHeaderProps) {
  return (
    <div className={classnames(styles.cardHeader, className)}>
      {avatar && <div className={styles.avatar}>{avatar}</div>}
      <div className={styles.headerContent}>
        <div className={styles.title}>{title}</div>
        {subheader && <div className={styles.subheader}>{subheader}</div>}
      </div>
    </div>
  )
}

export default CardHeader
