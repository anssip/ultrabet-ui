'use client'

import styles from './page-nav.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

function NavLink({ label, slug }: { label: string; slug: string }) {
  const path = usePathname()
  console.log('segment', path)
  const isActive = path.includes(slug)

  return (
    <Link className={`${isActive ? styles.active : ''}`} href={slug}>
      {label}
    </Link>
  )
}

export function PageNav({ prefix }: { prefix: string }) {
  return (
    <nav className={styles.nav}>
      <NavLink label="1x2" slug={`h2h`} />
      <NavLink slug={`totals`} label="Match Goals" />
    </nav>
  )
}
