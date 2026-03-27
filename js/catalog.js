import { SERVICES, CATEGORIES } from './data.js';

let activeCategory = 'all';
let searchQuery = '';
let minPrice = 0;
let maxPrice = 1;
let minReputation = 0;
let expandedService = null;

function getFilteredServices() {
  return SERVICES.filter(s => {
    if (activeCategory !== 'all' && s.category !== activeCategory) return false;
    if (s.price < minPrice || s.price > maxPrice) return false;
    if (s.reputation < minReputation) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
        s.displayName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
    }
    return true;
  });
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatLatency(ms) {
  if (ms >= 1000) return (ms / 1000).toFixed(1) + 's';
  return ms + 'ms';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<span class="star filled">&#9733;</span>';
  if (half) stars += '<span class="star half">&#9733;</span>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) stars += '<span class="star empty">&#9733;</span>';
  return stars;
}

function renderSidebar() {
  let html = '<div class="sidebar-section">';
  html += '<h3 class="sidebar-heading">// CATEGORIES</h3>';
  html += '<ul class="category-list">';
  for (const cat of CATEGORIES) {
    const active = cat.id === activeCategory ? ' active' : '';
    html += `<li class="category-item${active}" data-category="${cat.id}">
      <span class="cat-name">${cat.name}</span>
      <span class="cat-count">${cat.count}</span>
    </li>`;
  }
  html += '</ul></div>';

  html += '<div class="sidebar-section">';
  html += '<h3 class="sidebar-heading">// PRICE RANGE</h3>';
  html += '<div class="filter-range">';
  html += `<input type="range" id="price-min" min="0" max="0.25" step="0.001" value="${minPrice}" />`;
  html += `<input type="range" id="price-max" min="0" max="0.25" step="0.001" value="${maxPrice}" />`;
  html += `<div class="range-labels"><span>$${minPrice.toFixed(3)}</span><span>$${maxPrice.toFixed(3)}</span></div>`;
  html += '</div></div>';

  html += '<div class="sidebar-section">';
  html += '<h3 class="sidebar-heading">// MIN REPUTATION</h3>';
  html += '<div class="filter-range">';
  html += `<input type="range" id="rep-min" min="0" max="5" step="0.1" value="${minReputation}" />`;
  html += `<div class="range-labels"><span>${minReputation.toFixed(1)}</span><span>5.0</span></div>`;
  html += '</div></div>';

  html += '<div class="sidebar-section sidebar-stats">';
  html += '<h3 class="sidebar-heading">// QUICK STATS</h3>';
  html += `<div class="stat-line"><span class="stat-label">Services</span><span class="stat-value">${SERVICES.length}</span></div>`;
  html += `<div class="stat-line"><span class="stat-label">Total Tools</span><span class="stat-value">${SERVICES.reduce((a, s) => a + s.tools, 0)}</span></div>`;
  html += `<div class="stat-line"><span class="stat-label">Avg Uptime</span><span class="stat-value">${(SERVICES.reduce((a, s) => a + s.uptime, 0) / SERVICES.length).toFixed(1)}%</span></div>`;
  html += '</div>';

  return html;
}

function renderServiceRow(service) {
  const isExpanded = expandedService === service.id;
  const categoryClass = `cat-${service.category.toLowerCase()}`;

  let html = `<div class="service-row${isExpanded ? ' expanded' : ''}" data-service-id="${service.id}">`;
  html += '<div class="service-row-main">';
  html += `<div class="service-name-col">`;
  html += `<span class="service-id">${service.name}</span>`;
  html += `<span class="service-display">${service.displayName}</span>`;
  html += '</div>';
  html += `<span class="service-category ${categoryClass}">${service.category}</span>`;
  html += `<span class="service-price">$${service.price.toFixed(service.price < 0.01 ? 3 : 2)}<span class="price-unit">/call</span></span>`;
  html += `<span class="service-rating">${renderStars(service.reputation)}<span class="rating-num">${service.reputation.toFixed(1)}</span></span>`;
  html += `<span class="service-latency">${formatLatency(service.latency)}</span>`;
  html += `<span class="service-calls">${formatNumber(service.calls)} calls</span>`;
  html += `<span class="service-uptime">${service.uptime}%<span class="uptime-label"> up</span></span>`;
  html += '</div>';

  if (isExpanded) {
    html += '<div class="service-detail-inline">';
    html += `<p class="service-desc">${service.description}</p>`;
    html += '<div class="detail-cols">';
    html += '<div class="detail-tools">';
    html += `<h4>Tools (${service.tools})</h4>`;
    html += '<table class="tools-table"><thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>';
    for (const tool of service.toolsList) {
      html += `<tr><td class="tool-name">${tool.name}</td><td class="tool-desc">${tool.desc}</td></tr>`;
    }
    html += '</tbody></table>';
    html += '</div>';
    html += '<div class="detail-meta">';
    html += `<div class="meta-item"><span class="meta-label">Gateway</span><span class="meta-value">${service.gateway}</span></div>`;
    html += `<div class="meta-item"><span class="meta-label">Payment</span><span class="meta-value addr">${service.paymentAddress.slice(0, 8)}...${service.paymentAddress.slice(-6)}</span></div>`;
    html += `<div class="meta-item"><span class="meta-label">Protocol</span><span class="meta-value">x402 + A2A</span></div>`;
    html += '</div>';
    html += '</div>';
    html += '<div class="detail-snippet">';
    html += '<h4>Call this service</h4>';
    html += `<pre><code>import { AgentMarketplace } from '@psm/agent-marketplace';

const mp = new AgentMarketplace({
  registryUrl: 'https://registry.purplesquirrelmedia.io',
  solanaPrivateKey: process.env.SOLANA_KEY,
});

const result = await mp.call('${service.name}', {
  // your payload here
});
console.log(result);</code></pre>`;
    html += '</div>';
    html += `<a href="#service/${service.id}" class="detail-link">Full details &rarr;</a>`;
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderCatalog() {
  const filtered = getFilteredServices();
  const sidebar = renderSidebar();

  let main = '';
  main += '<div class="search-bar">';
  main += `<span class="search-icon">&#9906;</span>`;
  main += `<input type="text" id="search-input" placeholder="Search services, tools, categories..." value="${searchQuery}" />`;
  main += `<span class="result-count">${filtered.length} service${filtered.length !== 1 ? 's' : ''}</span>`;
  main += '</div>';

  main += '<div class="service-list-header">';
  main += '<span class="col-name">Service</span>';
  main += '<span class="col-cat">Category</span>';
  main += '<span class="col-price">Price</span>';
  main += '<span class="col-rating">Rating</span>';
  main += '<span class="col-latency">Latency</span>';
  main += '<span class="col-calls">Volume</span>';
  main += '<span class="col-uptime">Uptime</span>';
  main += '</div>';

  main += '<div class="service-list">';
  if (filtered.length === 0) {
    main += '<div class="empty-state">No services match your filters.</div>';
  } else {
    for (const s of filtered) {
      main += renderServiceRow(s);
    }
  }
  main += '</div>';

  return { sidebar, main };
}

function bindCatalogEvents() {
  // Category clicks
  document.querySelectorAll('.category-item').forEach(el => {
    el.addEventListener('click', () => {
      activeCategory = el.dataset.category;
      renderPage();
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderPage();
      // Re-focus after render
      const input = document.getElementById('search-input');
      if (input) { input.focus(); input.selectionStart = input.selectionEnd = input.value.length; }
    });
  }

  // Price range
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  if (priceMin) priceMin.addEventListener('input', (e) => { minPrice = parseFloat(e.target.value); renderPage(); });
  if (priceMax) priceMax.addEventListener('input', (e) => { maxPrice = parseFloat(e.target.value); renderPage(); });

  // Reputation
  const repMin = document.getElementById('rep-min');
  if (repMin) repMin.addEventListener('input', (e) => { minReputation = parseFloat(e.target.value); renderPage(); });

  // Row expand
  document.querySelectorAll('.service-row-main').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.parentElement.dataset.serviceId;
      expandedService = expandedService === id ? null : id;
      renderPage();
    });
  });
}

function renderPage() {
  const { sidebar, main } = renderCatalog();
  document.getElementById('sidebar').innerHTML = sidebar;
  document.getElementById('main-content').innerHTML = main;
  bindCatalogEvents();
}

export { renderCatalog, bindCatalogEvents };
