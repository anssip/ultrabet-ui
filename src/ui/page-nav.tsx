'use client'

import styles from './page-nav.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import classnames from 'classnames'

type SelectionResolver = (slug: string, path: string) => boolean

export function NavLink({
  label,
  slug,
  className,
  activeClassName,
  selectionResolver,
}: {
  label: string
  slug: string
  className?: string
  activeClassName?: string
  selectionResolver?: SelectionResolver
}) {
  const path = usePathname()
  const isActive = selectionResolver?.(slug, path)

  return (
    <li className="pure-menu-item">
      <Link
        className={classnames('pure-menu-link', className, isActive && activeClassName, {
          [`${styles.active}`]: isActive,
        })}
        href={slug}
      >
        {label}
      </Link>
    </li>
  )
}

export function MarketNav({ prefix }: { prefix: string }) {
  const selectionResolver: SelectionResolver = (slug, path) => {
    const pathHasMarket = path.split('/').length >= 3
    return path.includes(slug) || (slug.includes('h2h') && !pathHasMarket)
  }

  return (
    <nav className={classnames(styles.marketNav, 'pure-menu pure-menu-horizontal')}>
      <ul className={'pure-menu-list'}>
        <NavLink selectionResolver={selectionResolver} slug={`${prefix}/h2h`} label="1x2" />
        <NavLink selectionResolver={selectionResolver} slug={`${prefix}/spreads`} label="Spreads" />
        <NavLink selectionResolver={selectionResolver} slug={`${prefix}/totals`} label="Totals" />
      </ul>
    </nav>
  )
}

export function PageNav() {
  const selectionResolver: SelectionResolver = (slug, path) => {
    console.log('slug: ', slug.replace('/', ''))
    console.log('path: ', path.replace('/', ''))

    return slug.replace('/', '') == path.replace('/', '')
  }

  return (
    <ul className="pure-menu-list">
      <li className="pure-menu-item">
        <NavLink
          selectionResolver={selectionResolver}
          className="pure-menu-link"
          activeClassName="pure-menu-selected"
          slug={'/'}
          label="Events"
        />
      </li>
      <li className="pure-menu-item">
        <NavLink
          selectionResolver={selectionResolver}
          className="pure-menu-link"
          activeClassName="pure-menu-selected"
          slug={'/bets'}
          label="My Bets"
        />
      </li>
    </ul>
  )
}
