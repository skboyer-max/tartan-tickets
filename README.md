# Tartan Tickets

A responsive Next.js prototype for Story 1: browsing upcoming campus events. Event dates, locations, prices, and live remaining-seat counts are shown on the home page. Sold-out events offer a waitlist instead of a purchase action.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Type a name to try the event actions. **Simulated payment** never charges a card; it only records a temporary in-memory order and reduces the displayed availability. **Join waitlist** records a temporary in-memory waitlist entry. All demo data resets when the server restarts. No database, payment provider, or sign-in provider is used.

## Checks

```bash
npm test
npm run build
```
