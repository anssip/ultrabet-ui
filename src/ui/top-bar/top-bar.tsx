'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { formatTime } from '@/ui/date-util'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useRef, useState } from 'react'
import styles from './top-bar.module.css'
import { User } from '@/gql/types.generated'
import { NavLink } from '@/ui/page-nav'

export type Props = {
  bettingUser: User | null
}

export default function TopBar({ bettingUser }: Props) {
  const path = usePathname()
  const { user, isLoading } = useUser()
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toggleHorizontalTimeout, setToggleHorizontalTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const menuRef = useRef<HTMLDivElement>(null) // Specify the type for the ref
  const toggleRef = useRef<HTMLAnchorElement>(null) // Specify the type for the ref

  const handleUserMenuClick = () => {
    setUserMenuVisible(!userMenuVisible)
  }

  const toggleHorizontal = () => {
    if (!menuRef.current) return
    menuRef.current.classList.remove('closing')
    Array.from(menuRef.current.querySelectorAll('.custom-can-transform')).forEach((el) => {
      el.classList.toggle('pure-menu-horizontal')
    })
  }
  const toggleMenu = () => {
    console.log('toggleMenu()')
    if (!menuRef.current || !toggleRef.current) return
    if (menuRef.current.classList.contains(styles.open)) {
      menuRef.current.classList.add('closing')
      setToggleHorizontalTimeout(setTimeout(toggleHorizontal, 500))
    } else {
      if (menuRef.current.classList.contains('closing')) {
        if (toggleHorizontalTimeout) clearTimeout(toggleHorizontalTimeout)
      } else {
        toggleHorizontal()
      }
    }
    menuRef.current.classList.toggle(styles.open)
    toggleRef.current.classList.toggle(styles.x)
  }
  const closeMenu = () => {
    if (menuRef.current && menuRef.current.classList.contains(styles.open)) {
      toggleMenu()
    }
  }

  useEffect(() => {
    const windowChangeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize'
    window.addEventListener(windowChangeEvent, closeMenu)
    return () => {
      window.removeEventListener(windowChangeEvent, closeMenu)
    }
  }, [toggleHorizontalTimeout, toggleMenu])

  return (
    <div ref={menuRef} className={`${styles.container} pure-g`} id="topmenu">
      <div className="pure-u-1 pure-u-md-1-3">
        <div className="pure-menu">
          <Link href="#" className="pure-menu-heading custom-brand">
            Parabolic Bet
          </Link>
          <a
            href="#"
            ref={toggleRef}
            className={styles.toggle}
            id="toggle"
            onClick={(e) => {
              e.preventDefault()
              toggleMenu()
            }}
          >
            <s className={styles.bar}></s>
            <s className={styles.bar}></s>
          </a>
        </div>
      </div>
      <div className="pure-u-1 pure-u-md-1-3">
        <div className="pure-menu pure-menu-horizontal custom-can-transform">
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <NavLink className="pure-menu-link" slug={'/events'} label="Events" />
            </li>
            <li className="pure-menu-item">
              <NavLink className="pure-menu-link" slug={'/bets'} label="My Bets" />
            </li>
          </ul>
        </div>
      </div>
      <div className={`pure-u-1 pure-u-md-1-3 ${styles.profileActions}`}>
        <div className={`pure-menu pure-menu-horizontal`}>
          <ul className={`pure-menu-list`}>
            <li className={`pure-menu-item pure-menu-has-children pure-menu-allow-hover`}>
              {user ? (
                <a href="#" className={`pure-menu-link`}>
                  {user.name}
                </a>
              ) : (
                <Link className="pure-menu-link" href={'/api/auth/login'}>
                  Login
                </Link>
              )}
              {user && (
                <ul className="pure-menu-children">
                  <li className={`pure-menu-item`}>
                    <Link className="pure-menu-link" href={'/api/auth/logout'}>
                      Logout
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={`pure-menu-item ${styles.accountInfo}`}>
              <div className={styles.balance}> €{bettingUser?.wallet?.balance ?? 0}</div>
              <div className={styles.label}>{formatTime(new Date())}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    // </div>
  )
}
