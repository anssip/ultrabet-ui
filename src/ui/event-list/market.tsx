import { EventFragment, MarketFragment } from '@/gql/documents.generated'
import styles from '@/ui/event-list/event-list.module.css'
import { AddSlipOptionForm } from '@/ui/event-list/add-slip-option-form'
import { MarketOption } from '@/gql/types.generated'
import { MarketOptionWithHistory } from '@/ui/event-list/event-list'
import { getOptionPointLabel } from '@/ui/event-util'

export function Market({ event, market }: { event: EventFragment; market: MarketFragment }) {
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

  if (market.name === 'h2h' || market.name === 'h2h_lay' || market.name === 'spreads') {
    return sortedOptions.map((option) => (
      <div key={option?.id} className={styles.oddsBox}>
        <div className={styles.optionName}>
          {option?.name}{' '}
          <span className={styles.point}>{getOptionPointLabel(option, market.name)}</span>
        </div>
        <AddSlipOptionForm option={option!} event={event} market={market} />
        <div className={styles.oddsHistory}>
          {(option as MarketOptionWithHistory).history ?? ''}
        </div>
      </div>
    ))
  }
  if (market.name === 'totals') {
    return sortedOptions.map((option) => (
      <div key={option?.id} className={styles.oddsBox}>
        <div className={styles.optionName}>
          {option?.name} {option?.point}
        </div>
        <AddSlipOptionForm option={option!} event={event} market={market} />
        <div className={styles.oddsHistory}>
          {(option as MarketOptionWithHistory).history ?? ''}
        </div>
      </div>
    ))
  }

  return <div></div>
}
