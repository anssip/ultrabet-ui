'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { formatTime } from '@/ui/date-util'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState } from 'react'
import styles from './global-nav.module.css'

export default function GlobalNav() {
  const { user, isLoading } = useUser()
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const handleUserMenuClick = () => {
    setUserMenuVisible(!userMenuVisible)
  }

  function renderUserItem() {
    if (isLoading) return <div className={styles.label}>Loading...</div>
    if (user)
      return (
        <button className={styles.menuButton} onClick={handleUserMenuClick}>
          {user.name}
        </button>
      )
    return (
      <Link className={styles.menuLink} href={'/api/auth/login'}>
        Login
      </Link>
    )
  }

  return (
    <div className={styles.globalNavContainer}>
      <nav>
        <ul className={styles.menuList}>
          <li className={styles.navItemGroup}>
            <GlobalNavItem label="In-play" slug="/" />
            <GlobalNavItem label="Upcoming" slug="/upcoming" />
            {user && <GlobalNavItem label="My Bets" slug="/bets" />}
          </li>
          <li className={`${styles.navItemContainer} ${styles.active}`}>
            {renderUserItem()}
            {userMenuVisible && (
              <div className={styles.popup}>
                <a href={'/api/auth/logout'} className={styles.menuLink}>
                  Logout
                </a>
              </div>
            )}
            <div className={styles.label}>{formatTime(new Date())}</div>
          </li>
        </ul>
      </nav>
    </div>
  )
}

function GlobalNavItem({ label, slug }: { label: string; slug: string }) {
  const path = usePathname()
  console.log('segment', path)
  const isActive = slug === path

  return (
    <Link
      className={`${styles.menuLink} ${isActive ? styles.active : ''} ${styles.navItemContainer}`}
      href={slug}
    >
      {label}
    </Link>
  )
}
