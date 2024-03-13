import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { NextRequest, NextResponse } from 'next/server'
import { MarketOption } from '@/gql/types.generated'
import { kv } from '@vercel/kv'

export const POST = withApiAuthRequired(async function addSlipOption(req: NextRequest) {
  const res = new NextResponse()
  const session = await getSession(req, res)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', status: 400 }, res)
  }
  const { sub } = session.user
  const option = (await req.json()) as MarketOption
  console.log('option', option)

  await kv.hset(`betslip:${sub}`, { [`${option.id}`]: option })
  return NextResponse.json({ success: true }, res)
})
