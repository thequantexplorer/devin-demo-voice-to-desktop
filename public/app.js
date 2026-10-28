const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const label = (s) => s[0].toUpperCase() + s.slice(1);
const DAY_LABEL = { operational: 'No incidents', degraded: 'Degraded performance', outage: 'Outage' };
const fmtDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const fmtMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);

function uptimeBar(u) {
  const bars = u.days
    .map((d, i) => `<span class="day ${d.status}" data-i="${i}" role="img" aria-label="${esc(`${fmtDate(d.date)}: ${DAY_LABEL[d.status]}`)}"></span>`)
    .join('');
  return `<div class="uptime" data-name="${esc(u.name)}"><div class="bars">${bars}</div>
    <div class="legend"><span>${u.days.length} days ago</span><span class="pct">${u.uptime}% uptime</span><span>Today</span></div></div>`;
}

function tooltipHtml(d) {
  const rows = d.incidents.length
    ? d.incidents.map((i) => `<li class="${i.severity === 'minor' ? 'degraded' : 'outage'}">${esc(i.title)} <small>${i.ongoing ? 'ongoing, ' : ''}${fmtMinutes(i.minutes)}</small></li>`).join('')
    : '<li class="none">No downtime recorded on this day.</li>';
  return `<strong>${fmtDate(d.date)}</strong><div class="tip-status ${d.status}">${DAY_LABEL[d.status]}</div><ul>${rows}</ul>`;
}

(async () => {
  const [{ components }, uptime] = await Promise.all([
    fetch('/api/status').then((r) => r.json()),
    fetch('/api/uptime?days=90').then((r) => r.json()).catch(() => ({ components: [] })),
  ]);
  const byName = Object.fromEntries(uptime.components.map((u) => [u.name, u]));
  const bad = components.filter((c) => c.status !== 'operational');
  const banner = document.getElementById('banner');
  banner.textContent = bad.length ? `Degraded: ${bad.map((c) => c.name).join(', ')}` : 'All systems operational';
  banner.className = 'banner' + (bad.length ? ' degraded' : '');
  const list = document.getElementById('components');
  list.innerHTML = components
    .map((c) => `<li><div class="row"><span>${esc(c.name)}</span><span class="${c.status}">${label(c.status)}</span></div>${byName[c.name] ? uptimeBar(byName[c.name]) : ''}</li>`)
    .join('');

  const tip = document.getElementById('tooltip');
  const hide = () => (tip.hidden = true);
  let shownAtY = 0;
  list.addEventListener('mouseover', (e) => {
    const bar = e.target.closest('.day');
    if (!bar) return;
    const day = byName[bar.closest('.uptime').dataset.name].days[bar.dataset.i];
    tip.innerHTML = tooltipHtml(day);
    tip.hidden = false;
    shownAtY = window.scrollY;
    const r = bar.getBoundingClientRect();
    const w = tip.offsetWidth;
    const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), document.documentElement.clientWidth - w - 8);
    tip.style.left = `${left + window.scrollX}px`;
    tip.style.top = `${r.bottom + window.scrollY + 8}px`;
  });
  list.addEventListener('mouseout', (e) => {
    if (e.target.closest('.day') && !e.relatedTarget?.closest?.('.day')) hide();
  });
  window.addEventListener('scroll', () => window.scrollY !== shownAtY && hide(), { passive: true });
})();
