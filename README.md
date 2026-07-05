# FinTrackPro
A personal finance tracking web app that runs entirely in the browser — no backend, no database, no build tools. Log in, add transactions, and watch your balance, income, and expenses update instantly with a live chart and searchable transaction history.
Built with plain HTML, CSS, and JavaScript.

## Features

- **Login / Register** — simple username-and-password session handling, stored locally in the browser
- **Add / Edit / Delete Transactions** — log income or expenses with description, amount, date, and category
- **Live Dashboard** — current balance, total income, total expenses, and transaction count recalculate instantly
- **Cash Flow Chart** — a Chart.js bar chart comparing income vs. expenses, auto-scaling as data grows
- **Responsive Transaction View** — a full table on desktop/tablet, card layout on mobile
- **Search & Filter** — search by description, filter by income/expense
- **Dark Mode** — toggle between light and dark themes; preference is remembered on next visit
- **Settings** — update your name, username, password, and preferred currency symbol (USD/EUR/GBP/INR/JPY)
- **Reset All Data** — wipe all transactions and start fresh, with a confirmation prompt
- **Fully Responsive** — dedicated mobile navigation (floating icon menu) and a fixed sidebar on desktop

## Tech Stack

- HTML5, CSS3 (CSS variables for theming, Flexbox/Grid for layout)
- Vanilla JavaScript (DOM manipulation, no frameworks)
- [Chart.js](https://www.chartjs.org/) for the cash flow chart (loaded via CDN)
- [Remix Icon](https://remixicon.com/) for icons (loaded via CDN)
- Browser `localStorage` for all data persistence — no backend or database required


## Project Structure

```
├── index.html      # All page markup: login/register, dashboard, settings, add/edit transaction modal
├── styles.css      # All styling, including light/dark theme variables and responsive breakpoints
├── script.js       # All application logic: auth, transactions, chart rendering, settings
└── README.md
```

## Notes on Data & Accounts

- All data (accounts and transactions) is stored in your browser's `localStorage`. It does **not** sync across devices or browsers, and clearing your browser data will erase it.
- Authentication is a simple client-side session check for demonstration purposes — it is **not** secure authentication and should not be used to store real sensitive data.

## Possible Future Improvements

- Export transactions as a CSV file
- Group transactions by month with a monthly summary
- Per-category spending limits with alerts
- Recurring transaction support
- Sync data across devices via a real backend/database
