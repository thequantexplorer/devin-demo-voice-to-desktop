const express = require('express');
const path = require('path');
const data = require('./data');

function createApp() {
  const app = express();
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.get('/api/status', (req, res) => {
    res.json({ components: data.components.map((name) => ({ name, status: data.current[name] })) });
  });
  app.get('/api/history', (req, res) => res.json({ history: data.history, incidents: data.incidents }));
  return app;
}

module.exports = { createApp };
