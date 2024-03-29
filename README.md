# A sports betting webapp

Demo betting frontend: https://www.parabolicbet.com/

* Shows in-play (live) events and upcoming events in different tabs
* Live event odds and scores are update as they happen
* The backend is [in my repository called `ultrabet`](https://github.com/anssip/ultrabet)

[See it live here](https://www.parabolicbet.com/).

<img width="1391" alt="Screenshot 2024-03-13 at 15 56 25" src="https://github.com/anssip/ultrabet-ui/assets/271711/053855a7-4df9-4d7b-ba81-454da2de01f9">

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

See the [complete roadmap here](https://github.com/anssip/ultrabet?tab=readme-ov-file#roadmap)

- [ ] Add loading state for add to slip action
- [ ] Redesign the bet slip
- [ ] Redesign the bets page
- [ ] Spreads (handicap) market
- [ ] Event view that shows all markets and options for an event
- [ ] Show gravatars (url is in Auth0)
- [ ] Update live scores in bets view
- [ ] Fix global styling
- [x] Show scores in bets view
- [x] Bug: does not accept a long bet only without any singles
- [x] Show some loading indicator when placing a bet
- [x[ Add a loading skeleton for the bets view
- [x] Fix the background color of the bets page
- [x] Bet slip UI
