'use client'

import styles from './page-nav.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavLink({
  label,
  slug,
  className,
}: {
  label: string
  slug: string
  className?: string
}) {
  const path = usePathname()
  const isActive = path.includes(slug) || (slug === 'h2h' && path === '/')
  console.log('slug, path, isActive', slug, path, isActive)

  return (
    <Link className={`${className} ${isActive ? styles.active : ''}`} href={slug}>
      {label}
    </Link>
  )
}

export function PageNav({ prefix }: { prefix: string }) {
  return (
    <nav className={styles.nav}>
      <NavLink slug="/events/h2h" label="1x2" />
      <NavLink slug="/events/spreads" label="Handicap" />
      <NavLink slug="/events/totals" label="Match Goals" />
    </nav>
  )
}
