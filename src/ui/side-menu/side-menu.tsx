import { Sport } from '@/gql/types.generated'
import Link from 'next/link'

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

  function activeEventCount(sports: Sport[]) {
    return sports.reduce((acc: number, sport: Sport) => acc + (sport.activeEventCount ?? 0), 0)
  }

  return (
    <>
      <a href="#menu" id="menuLink" className="menu-link">
        <span></span>
      </a>

      <div id="menu">
        <div className="pure-menu">
          <a className={`pure-menu-heading`} href="#company">
            Sports
          </a>

          <ul className="pure-menu-list">
            {[...groups.entries()].map(([group, sports]) => (
              <li key={group} className="pure-menu-item">
                {/* TODO: change to selectable links */}
                <Link href={`/events/${group}`} className="pure-menu-link">
                  {group} ({activeEventCount(sports)})
                </Link>
              </li>
            ))}

            {/*<li className={`pure-menu-item pure-menu-divided pure-menu-selected`}>*/}
            {/*  <a href="#" className="pure-menu-link">*/}
            {/*    Services*/}
            {/*  </a>*/}
            {/*</li>*/}
          </ul>
        </div>
      </div>
    </>
  )
}
