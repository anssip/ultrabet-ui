'use server'

import { MarketOption } from '@/gql/types.generated'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { kv } from '@vercel/kv'
import { revalidatePath } from 'next/cache'
import { BetSlipOption, Slip } from '@/ui/bet-slip/bet-slip'

export async function addSlipOption(user: UserProfile | null, option: BetSlipOption) {
  console.log('adding slip option to user', user?.sub, option.id)
  await kv.hset(`betslip:${user?.sub}`, { [`${option.id}`]: option })
  // revalidatePath('/')
}

export async function removeSlipOption(user: { sub: string } | null, option: MarketOption) {
  console.log(`removing slip option from user ${user?.sub}`, option.id)
  await kv.hdel(`betslip:${user?.sub}`, option.id)
  // revalidatePath('/')
}
