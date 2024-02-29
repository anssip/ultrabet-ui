import { getAccessToken } from '@auth0/nextjs-auth0'

export function getLongBetName(length: number) {
  const names = new Map([
    [1, 'Single'],
    [2, 'Double'],
    [3, 'Treble'],
    [4, 'Fourfold'],
    [5, 'Fivefold'],
    [6, 'Sixfold'],
    [7, 'Sevenfold'],
    [8, 'Eightfold'],
    [9, 'Ninefold'],
    [10, 'Tenfold'],
  ])
  return names.get(length) ?? `${length}-fold`
}

export async function fetchAccessToken() {
  try {
    const { accessToken } = await getAccessToken()
    return accessToken
  } catch (e) {
    return null
  }
}
