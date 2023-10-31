import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

// https://github.com/auth0/nextjs-auth0/blob/main/EXAMPLES.md#app-router-1
export const GET = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse()
  const session = await getSession(req, res)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', status: 400 }, res)
  }
  console.log('found session', session)
  const slipOptions = await kv.smembers(`betslip:${session.user.sub}`)
  return NextResponse.json({ slipOptions, id: session.user.sub }, res)
})
