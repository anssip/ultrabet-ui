'use server'

import { MarketOption } from '@/gql/types.generated'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { kv } from '@vercel/kv'
import { revalidatePath } from 'next/cache'

export async function addSlipOption(user: UserProfile | null, option: MarketOption) {
  // const slip = await kv.hget<MarketOption[]>(`betslip:${user?.sub}`)
  await kv.hset(`betslip:${user?.sub}`, { [`${option.id}`]: option })
  revalidatePath('/events')
}
