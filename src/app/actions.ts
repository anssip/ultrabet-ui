'use server'

import { MarketOption } from '@/gql/types.generated'
import { UserProfile } from '@auth0/nextjs-auth0/client'

export async function addSlipOption(
  user: UserProfile | null,
  option: MarketOption,
  formData: FormData
) {
  console.log('addSlipOption', user, option)
}
