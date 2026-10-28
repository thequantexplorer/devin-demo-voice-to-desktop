# acme-status-page

status.acme.dev. Shows current component status from `/api/status`. `/api/history` already serves 30 days of uptime rollups and past incidents, and `/api/uptime?days=90` computes per-day status from incident history, which the page renders as a 90-day uptime bar per component (green = no incidents, amber = minor, red = major/critical; hover a day for details).

```sh
npm install && npm start   # http://localhost:3200
npm test
```

---

This repo is a starter for a Devin demo. See [DEVIN_DEMO.md](DEVIN_DEMO.md) for setup and the prompt.
