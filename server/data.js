// Last 30 days of health-check rollups per component (1 = up all day, otherwise fraction of checks passing).
const components = ['Storefront', 'Checkout API', 'Payments Gateway', 'Search', 'Notifications'];
let s = 7;
const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
const days = 30;
const history = Object.fromEntries(components.map((c) => [c, Array.from({ length: days }, () => (rnd() < 0.08 ? Math.round((0.9 + rnd() * 0.09) * 1000) / 1000 : 1))]));
history['Checkout API'][days - 3] = 0.82;

const incidents = [
  { id: 'inc-43', component: 'Search', title: 'Search indexing lag (new products missing)', startedAt: '2026-10-28T02:40:00Z', resolvedAt: null, severity: 'minor' },
  { id: 'inc-42', component: 'Checkout API', title: 'Elevated 5xx on POST /checkout (gift cards)', startedAt: '2026-10-24T14:05:00Z', resolvedAt: '2026-10-24T15:20:00Z', severity: 'major' },
  { id: 'inc-41', component: 'Search', title: 'Slow search results in EU', startedAt: '2026-10-12T08:30:00Z', resolvedAt: '2026-10-12T09:02:00Z', severity: 'minor' },
  { id: 'inc-40', component: 'Payments Gateway', title: 'Card authorizations failing for Amex', startedAt: '2026-09-17T19:10:00Z', resolvedAt: '2026-09-17T20:05:00Z', severity: 'major' },
  { id: 'inc-39', component: 'Notifications', title: 'Delayed SMS delivery', startedAt: '2026-09-02T22:30:00Z', resolvedAt: '2026-09-03T01:15:00Z', severity: 'minor' },
  { id: 'inc-38', component: 'Storefront', title: 'Product images failing to load', startedAt: '2026-08-14T11:00:00Z', resolvedAt: '2026-08-14T11:40:00Z', severity: 'minor' },
];

const current = { Storefront: 'operational', 'Checkout API': 'operational', 'Payments Gateway': 'operational', Search: 'degraded', Notifications: 'operational' };

module.exports = { components, history, incidents, current };
