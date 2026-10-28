const express = require('express');
const path = require('path');
const data = require('./data');
const { dailyUptime } = require('./uptime');

function createApp({ now = () => new Date() } = {}) {
  const app = express();
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('/api/status', (req, res) => {
    res.json({ components: data.components.map((name) => ({ name, status: data.current[name] })) });
  });
  app.get('/api/history', (req, res) => res.json({ history: data.history, incidents: data.incidents }));
  app.get('/api/uptime', (req, res) => {
    const days = Math.min(Math.max(parseInt(req.query.days, 10) || 90, 1), 365);
    res.json({ days, components: dailyUptime(data.components, data.incidents, { days, now: now() }) });
  });
  return app;
}

module.exports = { createApp };
