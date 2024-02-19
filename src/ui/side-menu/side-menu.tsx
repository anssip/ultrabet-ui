import { Sport } from '@/gql/types.generated'

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
          <a className={`pure-menu-heading`} href="#company">
            Sports
          </a>

          <ul className="pure-menu-list">
            {[...groups.keys()].map((group) => (
              <li key={group} className="pure-menu-item">
                {/* TODO: change to selectable links */}
                <a href={`/events/${group}`} className="pure-menu-link">
                  {group}
                </a>
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
