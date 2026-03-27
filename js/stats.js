import { SERVICES, CATEGORIES, RECENT_TRANSACTIONS, MARKETPLACE_STATS } from './data.js';

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function timeAgo(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return Math.floor(diff / 86400000) + 'd ago';
}

function renderBar(value, max, label, count) {
  const pct = Math.round((value / max) * 100);
  const width = Math.max(pct, 4);
  return `<div class="bar-row">
    <span class="bar-label">${label}</span>
    <div class="bar-track">
      <div class="bar-fill" style="width: ${width}%"></div>
    </div>
    <span class="bar-value">${count}</span>
  </div>`;
}

function renderStats() {
  let sidebar = '';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// OVERVIEW</h3>';
  sidebar += `<div class="stat-line"><span class="stat-label">Services</span><span class="stat-value">${MARKETPLACE_STATS.totalServices}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Tools</span><span class="stat-value">${MARKETPLACE_STATS.totalTools}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Total Calls</span><span class="stat-value">${formatNumber(MARKETPLACE_STATS.totalCalls)}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Volume</span><span class="stat-value price-val">$${formatNumber(MARKETPLACE_STATS.totalVolume)}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Avg Uptime</span><span class="stat-value">${MARKETPLACE_STATS.avgUptime}%</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Avg Latency</span><span class="stat-value">${MARKETPLACE_STATS.avgLatency}ms</span></div>`;
  sidebar += '</div>';

  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// PROTOCOL MIX</h3>';
  sidebar += '<div class="proto-list">';
  sidebar += '<div class="proto-item"><span class="proto-tag">x402</span> HTTP payments</div>';
  sidebar += '<div class="proto-item"><span class="proto-tag">A2A</span> Agent-to-Agent</div>';
  sidebar += '<div class="proto-item"><span class="proto-tag">ERC-8004</span> On-chain registry</div>';
  sidebar += '<div class="proto-item"><span class="proto-tag">MCP</span> Model Context Protocol</div>';
  sidebar += '</div>';
  sidebar += '</div>';

  let main = '';
  main += '<div class="stats-page">';

  // Big numbers
  main += '<div class="stats-hero">';
  main += `<div class="hero-stat"><span class="hero-val">${MARKETPLACE_STATS.totalServices}</span><span class="hero-label">Agent Services</span></div>`;
  main += `<div class="hero-stat"><span class="hero-val">${MARKETPLACE_STATS.totalTools}</span><span class="hero-label">Total Tools</span></div>`;
  main += `<div class="hero-stat"><span class="hero-val price-val">$${formatNumber(MARKETPLACE_STATS.totalVolume)}</span><span class="hero-label">USDC Volume</span></div>`;
  main += `<div class="hero-stat"><span class="hero-val">${formatNumber(MARKETPLACE_STATS.totalCalls)}</span><span class="hero-label">API Calls</span></div>`;
  main += '</div>';

  // Category breakdown
  main += '<div class="stats-section">';
  main += '<h2 class="section-title">// SERVICES BY CATEGORY</h2>';
  main += '<div class="bar-chart">';
  const cats = CATEGORIES.filter(c => c.id !== 'all');
  const maxCount = Math.max(...cats.map(c => c.count));
  for (const cat of cats) {
    main += renderBar(cat.count, maxCount, cat.name, cat.count);
  }
  main += '</div>';
  main += '</div>';

  // Tools by category
  main += '<div class="stats-section">';
  main += '<h2 class="section-title">// TOOLS BY CATEGORY</h2>';
  main += '<div class="bar-chart">';
  const toolsByCat = {};
  for (const s of SERVICES) {
    toolsByCat[s.category] = (toolsByCat[s.category] || 0) + s.tools;
  }
  const maxTools = Math.max(...Object.values(toolsByCat));
  for (const cat of cats) {
    const count = toolsByCat[cat.id] || 0;
    main += renderBar(count, maxTools, cat.name, count);
  }
  main += '</div>';
  main += '</div>';

  // Volume by category
  main += '<div class="stats-section">';
  main += '<h2 class="section-title">// CALL VOLUME BY CATEGORY</h2>';
  main += '<div class="bar-chart">';
  const callsByCat = {};
  for (const s of SERVICES) {
    callsByCat[s.category] = (callsByCat[s.category] || 0) + s.calls;
  }
  const maxCalls = Math.max(...Object.values(callsByCat));
  for (const cat of cats) {
    const count = callsByCat[cat.id] || 0;
    main += renderBar(count, maxCalls, cat.name, formatNumber(count));
  }
  main += '</div>';
  main += '</div>';

  // Top services
  main += '<div class="stats-section">';
  main += '<h2 class="section-title">// TOP SERVICES BY VOLUME</h2>';
  main += '<div class="top-services">';
  const sorted = [...SERVICES].sort((a, b) => b.calls - a.calls).slice(0, 8);
  const topMax = sorted[0].calls;
  for (const s of sorted) {
    main += `<div class="bar-row">
      <span class="bar-label"><a href="#service/${s.id}" class="bar-link">${s.name}</a></span>
      <div class="bar-track">
        <div class="bar-fill" style="width: ${Math.round((s.calls / topMax) * 100)}%"></div>
      </div>
      <span class="bar-value">${formatNumber(s.calls)}</span>
    </div>`;
  }
  main += '</div>';
  main += '</div>';

  // Recent transactions
  main += '<div class="stats-section">';
  main += '<h2 class="section-title">// RECENT TRANSACTIONS</h2>';
  main += '<div class="tx-feed">';
  for (const tx of RECENT_TRANSACTIONS) {
    const service = SERVICES.find(s => s.id === tx.service);
    const catClass = service ? `cat-${service.category.toLowerCase()}` : '';
    main += `<div class="tx-row">
      <span class="tx-time">${timeAgo(tx.timestamp)}</span>
      <span class="tx-caller">${tx.caller}</span>
      <span class="tx-arrow">&rarr;</span>
      <a href="#service/${tx.service}" class="tx-service ${catClass}">${tx.service}</a>
      <span class="tx-amount price-val">$${tx.amount.toFixed(tx.amount < 0.01 ? 3 : 2)}</span>
    </div>`;
  }
  main += '</div>';
  main += '</div>';

  main += '</div>';

  return { sidebar, main };
}

export { renderStats };
