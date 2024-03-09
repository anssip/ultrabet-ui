import useSlip, { PlaceBetResponse } from '@/lib/useSlip'
import React from 'react'
import { BetSlipOption } from '@/ui/bet-slip/bet-slip'
import { MarketOption } from '@/gql/types.generated'

export type SlipType = {
  options: MarketOption[]
  refetchSlip: () => void
  loading: boolean
  removeOption: (optionId: string) => Promise<void>
  addOption: (option: MarketOption) => Promise<void>
  postBet: (singles: BetSlipOption[], long: BetSlipOption | null) => Promise<PlaceBetResponse>
}

export const SlipContext = React.createContext<SlipType | null>(null)

export const SlipProvider = ({ children }: { children: React.ReactNode }) => {
  const slipState = useSlip()

  return <SlipContext.Provider value={slipState}>{children}</SlipContext.Provider>
}
