'use client'

import styles from './page-nav.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classnames from 'classnames'

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
  const pathHasMarket = path.split('/').length >= 3
  const isActive = path.includes(slug) || (slug.includes('h2h') && !pathHasMarket)

  return (
    <li className="pure-menu-item">
      <Link
        className={classnames('pure-menu-link', className, { [`${styles.active}`]: isActive })}
        href={slug}
      >
        {label}
      </Link>
    </li>
  )
}

export function PageNav({ prefix }: { prefix: string }) {
  return (
    <nav className={classnames(styles.nav, 'pure-menu pure-menu-horizontal')}>
      <ul className={'pure-menu-list'}>
        <NavLink slug={`${prefix}/h2h`} label="1x2" />
        <NavLink slug={`${prefix}/spreads`} label="Spreads" />
        <NavLink slug={`${prefix}/totals`} label="Totals" />
      </ul>
    </nav>
  )
}
