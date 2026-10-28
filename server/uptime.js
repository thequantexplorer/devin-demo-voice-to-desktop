// Per-day uptime computed from incident history (UTC days, oldest first, ending today).
const DAY_MS = 24 * 60 * 60 * 1000;
const RANK = { operational: 0, degraded: 1, outage: 2 };

// minor -> degraded (amber); major/critical -> outage (red). Only outage time counts as downtime.
const statusForSeverity = (severity) => (severity === 'major' || severity === 'critical' ? 'outage' : 'degraded');

function dailyUptime(components, incidents, { days = 90, now = new Date() } = {}) {
  const nowMs = now.getTime();
  const todayStart = Math.floor(nowMs / DAY_MS) * DAY_MS;
  const firstStart = todayStart - (days - 1) * DAY_MS;

  return components.map((name) => {
    const mine = incidents.filter((i) => i.component === name);
    let totalMs = 0;
    let downMs = 0;
    const dayList = Array.from({ length: days }, (_, d) => {
      const start = firstStart + d * DAY_MS;
      const end = Math.min(start + DAY_MS, nowMs);
      const day = { date: new Date(start).toISOString().slice(0, 10), status: 'operational', outageMinutes: 0, degradedMinutes: 0, incidents: [] };
      for (const inc of mine) {
        const from = Math.max(Date.parse(inc.startedAt), start);
        const to = Math.min(inc.resolvedAt ? Date.parse(inc.resolvedAt) : nowMs, end);
        if (to <= from) continue;
        const status = statusForSeverity(inc.severity);
        const minutes = Math.round((to - from) / 60000);
        if (status === 'outage') day.outageMinutes += minutes;
        else day.degradedMinutes += minutes;
        if (RANK[status] > RANK[day.status]) day.status = status;
        day.incidents.push({ id: inc.id, title: inc.title, severity: inc.severity, minutes, ongoing: !inc.resolvedAt });
      }
      totalMs += Math.max(end - start, 0);
      downMs += Math.min(day.outageMinutes * 60000, Math.max(end - start, 0));
      return day;
    });
    const uptime = totalMs ? Math.round((1 - downMs / totalMs) * 10000) / 100 : 100;
    return { name, uptime, days: dayList };
  });
}

module.exports = { dailyUptime, statusForSeverity };
