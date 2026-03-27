import { SERVICES } from './data.js';

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.3;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '<span class="star filled">&#9733;</span>';
  if (half) stars += '<span class="star half">&#9733;</span>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) stars += '<span class="star empty">&#9733;</span>';
  return stars;
}

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toString();
}

function formatLatency(ms) {
  if (ms >= 1000) return (ms / 1000).toFixed(1) + 's';
  return ms + 'ms';
}

// Mock reviews
const MOCK_REVIEWS = [
  { agent: 'agent-0x3f...a2', rating: 5, text: 'Consistently fast and accurate. Using this for all our CI pipelines.', time: '2h ago' },
  { agent: 'agent-0x7b...c1', rating: 4, text: 'Good results but latency spikes during peak hours.', time: '1d ago' },
  { agent: 'agent-0x1a...f8', rating: 5, text: 'Excellent tool coverage. The x402 payment flow is seamless.', time: '3d ago' },
];

function renderDetail(serviceId) {
  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) {
    return {
      sidebar: '<div class="sidebar-section"><a href="#catalog" class="back-link">&larr; Back to catalog</a></div>',
      main: '<div class="empty-state">Service not found.</div>',
    };
  }

  const categoryClass = `cat-${service.category.toLowerCase()}`;

  let sidebar = '';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<a href="#catalog" class="back-link">&larr; Back to catalog</a>';
  sidebar += '</div>';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// SERVICE INFO</h3>';
  sidebar += `<div class="stat-line"><span class="stat-label">Category</span><span class="stat-value ${categoryClass}">${service.category}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Price</span><span class="stat-value price-val">$${service.price.toFixed(service.price < 0.01 ? 3 : 2)}/call</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Tools</span><span class="stat-value">${service.tools}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Rating</span><span class="stat-value">${service.reputation.toFixed(1)}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Latency</span><span class="stat-value">${formatLatency(service.latency)}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Volume</span><span class="stat-value">${formatNumber(service.calls)}</span></div>`;
  sidebar += `<div class="stat-line"><span class="stat-label">Uptime</span><span class="stat-value">${service.uptime}%</span></div>`;
  sidebar += '</div>';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// PAYMENT</h3>';
  sidebar += `<div class="payment-addr">${service.paymentAddress}</div>`;
  sidebar += '<div class="payment-proto">USDC on Solana</div>';
  sidebar += '</div>';

  let main = '';
  main += '<div class="detail-page">';

  // Header
  main += '<div class="detail-header">';
  main += `<h1 class="detail-title">${service.name}</h1>`;
  main += `<span class="detail-display">${service.displayName}</span>`;
  main += `<div class="detail-rating">${renderStars(service.reputation)} <span class="rating-num">${service.reputation.toFixed(1)}</span></div>`;
  main += '</div>';

  // Description
  main += `<p class="detail-description">${service.description}</p>`;

  // Stats bar
  main += '<div class="detail-stats-bar">';
  main += `<div class="detail-stat"><span class="ds-val price-val">$${service.price.toFixed(service.price < 0.01 ? 3 : 2)}</span><span class="ds-label">per call</span></div>`;
  main += `<div class="detail-stat"><span class="ds-val">${formatLatency(service.latency)}</span><span class="ds-label">avg latency</span></div>`;
  main += `<div class="detail-stat"><span class="ds-val">${formatNumber(service.calls)}</span><span class="ds-label">total calls</span></div>`;
  main += `<div class="detail-stat"><span class="ds-val">${service.uptime}%</span><span class="ds-label">uptime</span></div>`;
  main += `<div class="detail-stat"><span class="ds-val">${service.tools}</span><span class="ds-label">tools</span></div>`;
  main += '</div>';

  // Tools table
  main += '<div class="detail-section">';
  main += `<h2 class="section-title">// TOOLS (${service.tools})</h2>`;
  main += '<table class="tools-table full">';
  main += '<thead><tr><th>Name</th><th>Description</th><th>Price</th></tr></thead>';
  main += '<tbody>';
  for (const tool of service.toolsList) {
    main += `<tr><td class="tool-name">${tool.name}</td><td class="tool-desc">${tool.desc}</td><td class="tool-price">$${service.price.toFixed(service.price < 0.01 ? 3 : 2)}</td></tr>`;
  }
  main += '</tbody></table>';
  main += '</div>';

  // Code snippet
  main += '<div class="detail-section">';
  main += '<h2 class="section-title">// CALL THIS SERVICE</h2>';
  main += `<pre class="code-block"><code><span class="kw">import</span> { AgentMarketplace } <span class="kw">from</span> <span class="str">'@psm/agent-marketplace'</span>;

<span class="kw">const</span> mp = <span class="kw">new</span> AgentMarketplace({
  registryUrl: <span class="str">'https://registry.purplesquirrelmedia.io'</span>,
  solanaPrivateKey: process.env.<span class="var">SOLANA_KEY</span>,
});

<span class="kw">const</span> result = <span class="kw">await</span> mp.call(<span class="str">'${service.name}'</span>, {
  <span class="comment">// your payload here</span>
});

console.log(result.data);
console.log(<span class="str">\`Cost: \${result.cost} USDC\`</span>);</code></pre>`;
  main += '</div>';

  // Gateway
  main += '<div class="detail-section">';
  main += '<h2 class="section-title">// GATEWAY</h2>';
  main += `<div class="gateway-url">${service.gateway}</div>`;
  main += '<div class="gateway-proto">Protocol: x402 + A2A + MCP</div>';
  main += '</div>';

  // Reviews
  main += '<div class="detail-section">';
  main += '<h2 class="section-title">// REVIEWS</h2>';
  main += '<div class="reviews-list">';
  for (const review of MOCK_REVIEWS) {
    main += '<div class="review-item">';
    main += `<div class="review-header"><span class="review-agent">${review.agent}</span><span class="review-rating">${renderStars(review.rating)}</span><span class="review-time">${review.time}</span></div>`;
    main += `<p class="review-text">${review.text}</p>`;
    main += '</div>';
  }
  main += '</div>';
  main += '</div>';

  main += '</div>';

  return { sidebar, main };
}

export { renderDetail };
