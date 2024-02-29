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
          <ul className="pure-menu-list">
            <li className="pure-menu-item">
              <Link href={`/events/all`} className="pure-menu-link">
                FULL LIST (
                {[...groups.values()].reduce((acc, sports) => acc + activeEventCount(sports), 0)})
              </Link>
            </li>
            {[...groups.entries()].map(([group, sports]) => (
              <li key={group} className="pure-menu-item">
                {/* TODO: change to selectable links */}
                <Link href={`/events/${group}`} className="pure-menu-link">
                  {group} ({activeEventCount(sports)})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
