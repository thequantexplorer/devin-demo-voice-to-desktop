const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { createApp } = require('../server/app');

test('reports five components', async () => {
  const res = await request(createApp()).get('/api/status');
  assert.strictEqual(res.body.components.length, 5);
});

test('history has 30 days per component', async () => {
  const res = await request(createApp()).get('/api/history');
  assert.strictEqual(res.body.history['Checkout API'].length, 30);
});
