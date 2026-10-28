const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const { createApp } = require('../server/app');
const { dailyUptime } = require('../server/uptime');

const NOW = new Date('2026-10-28T12:00:00Z');
const day = (u, date) => u.days.find((d) => d.date === date);

test('/api/uptime returns 90 days per component ending today', async () => {
  const res = await request(createApp({ now: () => NOW })).get('/api/uptime');
  assert.strictEqual(res.body.days, 90);
  assert.strictEqual(res.body.components.length, 5);
  for (const c of res.body.components) {
    assert.strictEqual(c.days.length, 90);
    assert.strictEqual(c.days[0].date, '2026-07-31');
    assert.strictEqual(c.days[89].date, '2026-10-28');
  }
});

test('major incident marks the day red and counts as downtime', () => {
  const [u] = dailyUptime(['Checkout API'], [
    { id: 'a', component: 'Checkout API', title: 'x', startedAt: '2026-10-24T14:05:00Z', resolvedAt: '2026-10-24T15:20:00Z', severity: 'major' },
  ], { now: NOW });
  const d = day(u, '2026-10-24');
  assert.strictEqual(d.status, 'outage');
  assert.strictEqual(d.outageMinutes, 75);
  assert.strictEqual(day(u, '2026-10-23').status, 'operational');
  assert.ok(u.uptime < 100 && u.uptime > 99.9);
});

test('minor incident is amber, spans midnight, and does not reduce uptime', () => {
  const [u] = dailyUptime(['N'], [
    { id: 'b', component: 'N', title: 'y', startedAt: '2026-09-02T22:30:00Z', resolvedAt: '2026-09-03T01:15:00Z', severity: 'minor' },
  ], { now: NOW });
  assert.strictEqual(day(u, '2026-09-02').status, 'degraded');
  assert.strictEqual(day(u, '2026-09-02').degradedMinutes, 90);
  assert.strictEqual(day(u, '2026-09-03').degradedMinutes, 75);
  assert.strictEqual(u.uptime, 100);
});

test('worst severity wins and ongoing incidents are clipped to now', () => {
  const [u] = dailyUptime(['S'], [
    { id: 'c', component: 'S', title: 'minor', startedAt: '2026-10-28T02:00:00Z', resolvedAt: null, severity: 'minor' },
    { id: 'd', component: 'S', title: 'major', startedAt: '2026-10-28T09:00:00Z', resolvedAt: '2026-10-28T09:30:00Z', severity: 'major' },
  ], { now: NOW });
  const today = day(u, '2026-10-28');
  assert.strictEqual(today.status, 'outage');
  assert.strictEqual(today.degradedMinutes, 600);
  assert.ok(today.incidents.find((i) => i.id === 'c').ongoing);
});

test('incidents older than the window are ignored', () => {
  const [u] = dailyUptime(['S'], [
    { id: 'e', component: 'S', title: 'old', startedAt: '2026-01-01T00:00:00Z', resolvedAt: '2026-01-01T05:00:00Z', severity: 'major' },
  ], { now: NOW });
  assert.ok(u.days.every((d) => d.status === 'operational'));
  assert.strictEqual(u.uptime, 100);
});
