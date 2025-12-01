# Day Trading Performance Calendar

A visual dashboard that tracks daily trading performance, aggregating results by day, symbol, and timeframe (weekly / monthly / yearly / all-time). The app is built with Vite + React so it runs locally with `npm run dev` and can be deployed to Vercel without any backend work.

## Features

- Month-style calendar that highlights winning vs losing days with trade counts and net P&L per tile.
- Sidebar filter to focus on a single symbol or view all stocks at once.
- Modal editor for any day so you can log P&L and number of trades with instant calendar updates.
- Win/loss calculation cards with quick toggles for weekly, monthly, yearly, and all-time views.
- JSON importer that can seed multiple years of history (existing entries get updated instead of duplicated).
- LocalStorage persistence for edits plus a starter seed in `src/data/seedData.js`.
- Weekly row summaries inside the calendar so every row shows its total net P&L at a glance.
- Optional Supabase sync so data updates propagate to every viewer automatically.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 to view the dashboard during development.

### Build & Deploy

```
npm run build
```

The build output in `dist/` can be deployed directly to Vercel. Keep the default Vite build command (`npm run build`) and output directory (`dist`).

## Remote Sync (optional)

By default the app stores edits in `localStorage`. To keep every device in sync:

1. **Create a Supabase project** (free tier works) and add a table named `trading_days` with columns:
   - `date` (text, part of primary key)
   - `stock` (text, part of primary key)
   - `pnl` (numeric)
   - `trades` (integer)
2. Generate an **anon** key from Supabase and add these env vars (locally in a `.env` file and in Vercel’s dashboard):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Restart `npm run dev`. The hero section will mention “Live data sync enabled” once it connects.

All modal edits/imports upsert into Supabase immediately, so anyone loading the dashboard fetches the same dataset.

## Importing Historical Data

1. Prepare a JSON array where each element looks like:

```json
{
  "date": "2024-09-18",
  "stock": "AAPL",
  "pnl": 1200,
  "trades": 3
}
```

2. Click **“Import JSON history”** in the sidebar and select your file. Existing days (matched by `date + stock`) will be overwritten; new days are appended.
3. You can also edit `src/data/seedData.js` if you prefer to bundle a static set of records.

## Notes

- All state is kept client-side; no authentication or backend services are required.
- When Supabase env vars are present the app automatically hydrates from (and writes to) that table, while still caching a copy in `localStorage` for fast reloads.
- Styling lives in `src/App.css` for quick tweaking, and utility helpers are under `src/utils/tradingUtils.js`.
