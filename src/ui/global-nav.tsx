'use client';

import {usePathname} from "next/navigation";
import Link from "next/link";
import styled from '@emotion/styled'

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
`
const NavItemContainer = styled.li<{ active: boolean }>`
  list-style-type: none;
  margin-left: 1em;
  font-weight: ${({active}) => active ? '900' : '200'}
`
export default function GlobalNav() {
  return (
    <GlobalNavContainer>
      <nav>
        <MenuList>
          <GlobalNavItem label="In-play" slug="/"/>
          <GlobalNavItem label="Upcoming" slug="/upcoming"/>
        </MenuList>
      </nav>
    </GlobalNavContainer>
  )
}

function GlobalNavItem({
                         label,
                         slug,
                       }: {
  label: string
  slug: string
}) {
  const path = usePathname();
  console.log("segment", path);
  const isActive = slug === path;

  return (
    <NavItemContainer active={isActive}>
      <Link
        href={slug}
      >
        {label}
      </Link>
    </NavItemContainer>
  );
}
