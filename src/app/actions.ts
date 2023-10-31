'use server'

import { MarketOption } from '@/gql/types.generated'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { kv } from '@vercel/kv'
import { revalidatePath } from 'next/cache'

export async function addSlipOption(user: UserProfile | null, option: MarketOption) {
  await kv.sadd(`betslip:${user?.sub}`, JSON.stringify(option))
  revalidatePath('/events')
}
