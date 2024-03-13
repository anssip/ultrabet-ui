import { Sport } from '@/gql/types.generated'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type Props = {
  sports: Sport[]
}

export function SideMenu({ sports }: Props) {
  const groups: Map<string, Sport[]> = sports.reduce((acc, sport) => {
    const sports = acc.get(sport.group) || []
    sports.push(sport)
    acc.set(sport.group, sports)
    return acc
  }, new Map<string, Sport[]>())

  return (
    <>
      <a href="#menu" id="menuLink" className="menu-link">
        <span></span>
      </a>

      <div id="menu">
        <div className="pure-menu">
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <Link href={`/all`} className="pure-menu-link">
                FULL LIST
              </Link>
            </li>
            {[...groups.entries()].map(([group, sports]) => (
              <li key={group} className="pure-menu-item">
                {/* TODO: change to selectable links */}
                <Link href={`/${group}`} className="pure-menu-link">
                  {group}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
