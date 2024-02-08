import { EventFragment, MarketFragment } from '@/gql/documents.generated'
import styles from '@/ui/event-list/event-list.module.css'
import { AddSlipOptionForm } from '@/ui/event-list/add-slip-option-form'
import { MarketOption } from '@/gql/types.generated'
import { MarketOptionWithHistory } from '@/ui/event-list/event-list'

export function Market({ event, market }: { event: EventFragment; market: MarketFragment }) {
  const options = market?.options
  if (!options) return null

  if (market.name === 'h2h' || market.name === 'h2h_lay') {
    return options.map((option) => (
      <div key={option?.id} className={styles.oddsBox}>
        <div className={styles.optionName}>{option?.name}</div>
        <AddSlipOptionForm option={option!} event={event} market={market} />
        <div className={styles.oddsHistory}>
          {(option as MarketOptionWithHistory).history ?? ''}
        </div>
      </div>
    ))
  }
  if (market.name === 'totals') {
    return options.map((option) => (
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
