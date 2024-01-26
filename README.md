# A sports betting webapp

Demo betting frontend: https://www.parabolicbet.com/

* Shows in-play (live) events and upcoming events in different tabs
* Live event odds and scores are update as they happen
* The backend is [in my repository called `ultrabet`](https://github.com/anssip/ultrabet)

Screenshots below. [See it live here](https://www.parabolicbet.com/).

<img width="1287" alt="Screenshot 2023-11-26 at 15 52 51" src="https://github.com/anssip/ultrabet-ui/assets/271711/38cc235d-1cbe-4903-a5b2-a049e59fee30">

<img width="824" alt="Screenshot 2023-11-26 at 15 52 05" src="https://github.com/anssip/ultrabet-ui/assets/271711/3f914d06-bc1c-4cd8-a28a-e3e4c70cdbb9">


## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped
with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## TODO

- [ ] Show gravatars (url is in Auth0)
- [ ] Show scores in bets view for live bets 
- [ ] Fix global styling
- [x] Bug: does not accept a long bet only without any singles
- [x] Show some loading indicator when placing a bet
- [x[ Add a loading skeleton for the bets view
- [x] Fix the background color of the bets page
- [x] Bet slip UI
