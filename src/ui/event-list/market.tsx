import { EventFragment, MarketFragment } from '@/gql/documents.generated'
import styles from '@/ui/event-list/event-list.module.css'
import { AddSlipOptionForm } from '@/ui/event-list/add-slip-option-form'
import { MarketOption } from '@/gql/types.generated'
import { MarketOptionWithHistory } from '@/ui/event-list/event-list'
import { getOptionPointLabel } from '@/ui/event-util'

export function Market({
  event,
  market,
  live,
}: {
  event: EventFragment
  market: MarketFragment
  live: boolean
}) {
  const options = market?.options
  if (!options) return null

  const sortedOptions = options.sort((a, b) => {
    const order = ['home', 'draw', 'away'] // define your order
    const getTeamType = (option: MarketOption) => {
      if (option.name === event.homeTeamName) return 'home'
      if (option.name === 'Draw') return 'draw'
      if (option.name === event.awayTeamName) return 'away'
      return 'other'
    }
    return (
      order.indexOf(getTeamType(a as MarketOption)) - order.indexOf(getTeamType(b as MarketOption))
    )
  })

  function renderOptions(options: JSX.Element[]) {
    return (
      <div className={styles.market}>
        <div className={styles.eventName}>{event.name}</div>
        <div className={styles.oddsBox}>{options}</div>
      </div>
    )
  }

  if (market.name === 'h2h' || market.name === 'h2h_lay' || market.name === 'spreads') {
    const h2hOptions = ['1', 'x', '2']
    const options = sortedOptions.map((option, i: number) => (
      <div key={option?.id}>
        {market.name === 'spreads' ? getOptionPointLabel(option, market.name) : h2hOptions[i]}
        <AddSlipOptionForm option={option!} event={event} market={market} />
        {live && (
          <div className={styles.oddsHistory}>
            {(option as MarketOptionWithHistory).history ?? ''}
          </div>
        )}
      </div>
    ))
    return renderOptions(options)
  }
  if (market.name === 'totals') {
    const options = sortedOptions.map((option) => (
      <div key={option?.id}>
        <div className={styles.optionName}>
          {option?.name} {option?.point}
        </div>
        <AddSlipOptionForm option={option!} event={event} market={market} />
        {live && (
          <div className={styles.oddsHistory}>
            {(option as MarketOptionWithHistory).history ?? ''}
          </div>
        )}
      </div>
    ))
    return renderOptions(options)
  }

  return <div></div>
}
