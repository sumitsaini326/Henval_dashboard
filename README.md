# Henval Dashboard

A responsive business dashboard with revenue charts, sales-channel breakdowns, and searchable recent transactions. It uses plain HTML, CSS, and JavaScript; no build step or package installation is required.

> **Sample data:** The figures and transactions are illustrative demo content, not live business data. Connect a trusted data source before using this dashboard for real reporting.

## Run locally

Open `index.html` in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Dashboard features

- Responsive overview with revenue, orders, average order value, and customer metrics
- Interactive weekly, monthly, and yearly revenue chart
- Sales-by-channel visualization
- Searchable recent transactions
- CSV export of the displayed sample transactions
- Light and dark themes

The interface is a static frontend. It does not include a backend, authentication, persistent storage, or live analytics.
