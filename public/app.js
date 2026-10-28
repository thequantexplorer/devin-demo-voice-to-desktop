(async () => {
  const { components } = await (await fetch('/api/status')).json();
  const bad = components.filter((c) => c.status !== 'operational');
  const banner = document.getElementById('banner');
  banner.textContent = bad.length ? `Degraded: ${bad.map((c) => c.name).join(', ')}` : 'All systems operational';
  banner.className = 'banner' + (bad.length ? ' degraded' : '');
  document.getElementById('components').innerHTML = components
    .map((c) => `<li><span>${c.name}</span><span class="${c.status}">${c.status[0].toUpperCase() + c.status.slice(1)}</span></li>`)
    .join('');
})();
