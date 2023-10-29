'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styled from '@emotion/styled'
import { formatTime } from '@/ui/date-util'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState } from 'react'

const GlobalNavContainer = styled.div`
  width: 100%;
  background-color: #be8ec4;
  color: white;
  margin-bottom: 2em;
  padding: 1em;
`

const MenuList = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const NavItemContainer = styled.li<{ active: boolean }>`
  list-style-type: none;
  margin-left: 1em;
  font-weight: ${({ active }) => (active ? '900' : '200')};
`
const NavItemGroup = styled.div`
  display: flex;
  flex-direction: row;
`
const Label = styled.div`
  background-color: transparent;
  border: none;
  font-weight: 200;
  color: white;
`
const MenuButton = styled.button`
  background-color: transparent;
  border: none;
  font-weight: 200;
  color: white;
  padding: 0;
  cursor: pointer;
`
const Popup = styled.div`
  position: absolute;
  background-color: #9a6cb4;
  color: white;
  padding: 1em;
  margin-top: 0.5em;
  margin-left: -0.5em;
  border-radius: 0.4em;
  font-weight: 200;
`
const MenuLink = styled(Link)`
  font-weight: 200;
`

export default function GlobalNav() {
  const { user, error, isLoading } = useUser()
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const handleUserMenuClick = () => {
    setUserMenuVisible(!userMenuVisible)
  }

  function renderUserItem() {
    if (isLoading) return <Label>Loading...</Label>
    if (user) return <MenuButton onClick={handleUserMenuClick}>{user.name}</MenuButton>
    return <MenuLink href={'/api/auth/login'}>Login</MenuLink>
  }

  return (
    <GlobalNavContainer>
      <nav>
        <MenuList>
          <NavItemGroup>
            <GlobalNavItem label="In-play" slug="/" />
            <GlobalNavItem label="Upcoming" slug="/upcoming" />
          </NavItemGroup>
          <NavItemContainer active>
            {renderUserItem()}
            {userMenuVisible && (
              <Popup>
                <MenuLink href={'/api/auth/logout'}>Logout</MenuLink>
              </Popup>
            )}
            <Label>{formatTime(new Date())}</Label>
          </NavItemContainer>
        </MenuList>
      </nav>
    </GlobalNavContainer>
  )
}

function GlobalNavItem({ label, slug }: { label: string; slug: string }) {
  const path = usePathname()
  console.log('segment', path)
  const isActive = slug === path

  return (
    <NavItemContainer active={isActive}>
      <Link href={slug}>{label}</Link>
    </NavItemContainer>
  )
}
