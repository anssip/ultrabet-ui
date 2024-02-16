'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { formatTime } from '@/ui/date-util'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState } from 'react'
import styles from './top-bar.module.css'
import { User } from '@/gql/types.generated'

export type Props = {
  bettingUser: User | null
}

export default function TopBar({ bettingUser }: Props) {
  const path = usePathname()
  const { user, isLoading } = useUser()
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const handleUserMenuClick = () => {
    setUserMenuVisible(!userMenuVisible)
  }

  return (
    <div className={styles.container}>
      <ul className={`pure-menu-list`}>
        <li
          className={`pure-menu-item ${user ? 'pure-menu-has-children' : ''} pure-menu-allow-hover`}
        >
          {user ? (
            <a href="#" className={`pure-menu-link`}>
              {user.name}
            </a>
          ) : (
            <Link className={`pure-menu-link`} href={'/api/auth/login'}>
              Login
            </Link>
          )}
          {user && (
            <ul className="pure-menu-children">
              <li className={`pure-menu-item`}>
                <Link className={`pure-menu-link`} href={'/api/auth/logout'}>
                  Logout
                </Link>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <div className={styles.balance}> €{bettingUser?.wallet?.balance ?? 0}</div>
      <div className={styles.label}>{formatTime(new Date())}</div>
    </div>
  )
}
