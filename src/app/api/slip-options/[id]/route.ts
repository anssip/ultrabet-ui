import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { BetSlipOption } from '@/ui/bet-slip/bet-slip'
import { MarketOption } from '@/gql/types.generated'

export const DELETE = withApiAuthRequired(async function removeSlipOption(req: NextRequest) {
  const res = new NextResponse()
  const session = await getSession(req, res)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', status: 400 }, res)
  }
  const { sub } = session.user
  const optionId = req.url.split('/').pop()
  if (typeof optionId !== 'string') {
    return NextResponse.json({ error: 'A valid optionId is required', status: 400 }, res)
  }
  await kv.hdel(`betslip:${sub}`, optionId)
  return NextResponse.json({ success: true }, res)
})
