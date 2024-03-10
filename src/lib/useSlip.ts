import { useState, useEffect } from 'react'
import { BetSlipOption, Slip } from '@/ui/bet-slip/bet-slip'
import { kv } from '@vercel/kv'
import { UserContext, UserProfile, useUser } from '@auth0/nextjs-auth0/client'
import { MarketOption } from '@/gql/types.generated'
import { SlipType } from '@/lib/slip-context'

async function loadSlip(): Promise<Slip> {
  console.log('loading betslip')
  const response = await fetch('/api/slip')
  const data = await response.json()
  console.log('loaded slip', data)
  return data.slip
}

async function removeSlipOption(optionId: string) {
  console.log('removing slip option', optionId)
  const response = await fetch(`/api/slip-options/${optionId}`, {
    method: 'DELETE',
  })
  const data = await response.json()
  console.log('removed slip option', data)
}

async function addSlipOption(option: BetSlipOption) {
  console.log('adding slip option', option)
  const response = await fetch('/api/slip-options', {
    method: 'POST',
    body: JSON.stringify(option),
  })
  const data = await response.json()
  console.log('added slip option', data)
}

export type PlaceBetResponse = {
  singles: BetSlipOption[]
  long: BetSlipOption | null
}

async function placeBet(
  singles: BetSlipOption[],
  long: BetSlipOption | null
): Promise<PlaceBetResponse> {
  console.log('placing bet', singles, long)
  const response = await fetch('/api/slip', {
    method: 'POST',
    body: JSON.stringify({ singles, long }),
  })
  return response.json()
}

const useSlip = (): SlipType => {
  const { user } = useUser()
  const [loading, setIsLoading] = useState(false)
  const [options, setOptions] = useState<BetSlipOption[]>([])

  useEffect(() => {
    if (!user) {
      return
    }
    if (loading) {
      return
    }
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const newData = await loadSlip()
        if (newData) {
          setOptions(newData ? Object.values(newData) : [])
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user])

  const refetchSlip = async () => {
    if (!user) {
      return
    }
    const slip = await loadSlip()
    setOptions(Object.values(slip))
  }

  const removeOption = async (optionId: string) => {
    console.log('removing option', optionId)
    setIsLoading(true)
    await removeSlipOption(optionId)
    // delete optionId from slip
    const newSlip = options.filter((option) => option.id !== optionId)

    console.log('new slip', newSlip)
    console.log('Is slip changed?', newSlip !== options)

    setOptions(newSlip)
    await refetchSlip()
    setIsLoading(false)
  }

  const addOption = async (option: BetSlipOption) => {
    setIsLoading(true)
    await addSlipOption(option)
    await refetchSlip()
    setIsLoading(false)
  }

  const postBet = async (
    singles: BetSlipOption[],
    long: BetSlipOption | null
  ): Promise<PlaceBetResponse> => {
    setIsLoading(true)
    const response = await placeBet(singles, long)
    setOptions([])
    setIsLoading(false)
    return response
  }

  return { options, refetchSlip, loading, removeOption, addOption, postBet }
}

export default useSlip
