import React from 'react'
import Image from 'next/image'
import styles from './CardMedia.module.css'

export type CardMediaProps = {
  image: string
  title?: string
  layout?: 'fill' | 'responsive' // Optional: Support different layouts
  // For 'responsive' layout, width and height must be provided
  width?: number
  height?: number
  children?: React.ReactNode
}

export function CardMedia({
  image,
  title,
  layout = 'fill', // Default to 'fill' to cover the div
  width,
  height,
  children,
}: CardMediaProps) {
  return (
    <div
      className={styles.media}
      style={{
        position: 'relative',
        height: layout === 'fill' ? '100%' : height,
        width: layout === 'fill' ? '100%' : width,
      }}
    >
      <Image
        src={image}
        alt={title ?? ''}
        layout={children ? 'fill' : layout}
        objectFit="cover"
        quality={100} // You can adjust the quality
        priority // Remove if not needed
      />
      {children && <div className={styles.overlay}>{children}</div>}
    </div>
  )
}
