'use server'

import { MarketOption } from '@/gql/types.generated'

export async function addSlipOption(option: MarketOption, formData: FormData) {
  console.log('addSlipOption', option)
}
