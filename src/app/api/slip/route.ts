import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'
import { getAccessToken, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { getClient } from '@/lib/client'
import { PlaceBetDocument, PlaceSingleBetsDocument } from '@/gql/documents.generated'
import { BetType } from '@/gql/types.generated'
import { BetSlipOption, Slip } from '@/ui/bet-slip/bet-slip'

// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#app-router-1
export const GET = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse()
  const session = await getSession(req, res)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', status: 400 }, res)
  }
  const slip: Slip = (await kv.hgetall(`betslip:${session.user.sub}`)) ?? {}
  return NextResponse.json({ slip, id: session.user.sub }, res)
})

async function clearSlip(options: BetSlipOption[], sub: string) {
  console.log(`clearing slip for user ${sub}`, options)
  await Promise.all(options.map((option) => kv.hdel(`betslip:${sub}`, option.id)))
}

export const POST = withApiAuthRequired(async function postSlipRoute(req) {
  const res = new NextResponse()
  const token = await getAccessToken(req, res, { scopes: ['email', 'profile', 'openid'] })
  console.log('got access token', token)

  const bets = await req.json()
  console.log('bets', bets)

  const betOptions = Object.values(bets.singles) as BetSlipOption[]
  const singles = betOptions.filter((single) => !!single.stake)
  const long = bets.long as BetSlipOption

  try {
    const client = getClient(true)
    const [placeBetData, placeSingleBetsData] = await Promise.all([
      long?.stake ?? 0 > 0
        ? client.mutate({
            mutation: PlaceBetDocument,
            variables: {
              marketOptions: betOptions.map((option) => option.id),
              betType: BetType.Parlay,
              stake: long.stake as number,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          })
        : Promise.resolve(null),
      singles.length > 0
        ? client.mutate({
            mutation: PlaceSingleBetsDocument,
            variables: {
              options: singles.map((option) => ({
                marketOptionId: option.id,
                stake: option.stake as number,
              })),
            },
            context: {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          })
        : Promise.resolve(null),
    ])
    console.log('got response data', JSON.stringify({ placeBetData, placeSingleBetsData }, null, 2))

    const session = await getSession(req, res)
    await clearSlip([...betOptions, long], session?.user.sub)

    const longBet = placeBetData?.data?.placeBet
    const singleBets = placeSingleBetsData?.data?.placeSingleBets
    // res.status(200).json({ success: true, data: { singles: singleBets, long: longBet } })
    return NextResponse.json({ success: true, data: { singles: singleBets, long: longBet } })
  } catch (error) {
    console.error('error placing bet', error)
    // @ts-ignore
    return NextResponse.json({ error: error.message, status: 400 }, res)
  }
})
