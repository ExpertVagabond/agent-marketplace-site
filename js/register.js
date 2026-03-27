import { CATEGORIES } from './data.js';

function renderRegister() {
  let sidebar = '';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// REGISTER</h3>';
  sidebar += '<p class="sidebar-text">Register your MCP server as a paid agent service. Services are discoverable by other agents and paid per-call via USDC on Solana.</p>';
  sidebar += '</div>';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// REQUIREMENTS</h3>';
  sidebar += '<ul class="req-list">';
  sidebar += '<li>MCP-compatible server</li>';
  sidebar += '<li>Public HTTPS endpoint</li>';
  sidebar += '<li>Solana wallet for payments</li>';
  sidebar += '<li>x402 payment header support</li>';
  sidebar += '</ul>';
  sidebar += '</div>';
  sidebar += '<div class="sidebar-section">';
  sidebar += '<h3 class="sidebar-heading">// PROTOCOLS</h3>';
  sidebar += '<div class="proto-list">';
  sidebar += '<div class="proto-item"><span class="proto-tag">x402</span> Payment negotiation</div>';
  sidebar += '<div class="proto-item"><span class="proto-tag">A2A</span> Discovery & routing</div>';
  sidebar += '<div class="proto-item"><span class="proto-tag">MCP</span> Tool interface</div>';
  sidebar += '</div>';
  sidebar += '</div>';

  let main = '';
  main += '<div class="register-page">';
  main += '<h1 class="page-title">Register a Service</h1>';
  main += '<p class="page-subtitle">Add your agent service to the marketplace. Once registered, other agents can discover and pay to use your tools.</p>';

  main += '<form id="register-form" class="register-form">';

  // Row 1: name + display name
  main += '<div class="form-row two-col">';
  main += '<div class="form-group">';
  main += '<label for="reg-name">Service ID <span class="required">*</span></label>';
  main += '<input type="text" id="reg-name" placeholder="my-agent-service" pattern="[a-z0-9-]+" required />';
  main += '<span class="form-hint">lowercase, hyphens only</span>';
  main += '</div>';
  main += '<div class="form-group">';
  main += '<label for="reg-display">Display Name <span class="required">*</span></label>';
  main += '<input type="text" id="reg-display" placeholder="My Agent Service" required />';
  main += '</div>';
  main += '</div>';

  // Description
  main += '<div class="form-group">';
  main += '<label for="reg-desc">Description <span class="required">*</span></label>';
  main += '<textarea id="reg-desc" rows="3" placeholder="What does your service do? What tools does it expose?" required></textarea>';
  main += '</div>';

  // Row 2: category + price
  main += '<div class="form-row two-col">';
  main += '<div class="form-group">';
  main += '<label for="reg-category">Category <span class="required">*</span></label>';
  main += '<select id="reg-category" required>';
  for (const cat of CATEGORIES.filter(c => c.id !== 'all')) {
    main += `<option value="${cat.id}">${cat.name}</option>`;
  }
  main += '</select>';
  main += '</div>';
  main += '<div class="form-group">';
  main += '<label for="reg-price">Price per Call (USDC) <span class="required">*</span></label>';
  main += '<input type="number" id="reg-price" min="0.001" step="0.001" placeholder="0.01" required />';
  main += '</div>';
  main += '</div>';

  // Payment address
  main += '<div class="form-group">';
  main += '<label for="reg-payment">Solana Payment Address <span class="required">*</span></label>';
  main += '<input type="text" id="reg-payment" placeholder="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" required />';
  main += '</div>';

  // Gateway
  main += '<div class="form-group">';
  main += '<label for="reg-gateway">Gateway Endpoint <span class="required">*</span></label>';
  main += '<input type="url" id="reg-gateway" placeholder="https://my-service.example.com/mcp" required />';
  main += '</div>';

  // Tools count
  main += '<div class="form-group">';
  main += '<label for="reg-tools">Number of Tools</label>';
  main += '<input type="number" id="reg-tools" min="1" placeholder="10" />';
  main += '</div>';

  main += '<div class="form-actions">';
  main += '<button type="submit" class="btn-primary">Register Service</button>';
  main += '<span class="form-note">Registration will be submitted to the on-chain registry via ERC-8004.</span>';
  main += '</div>';

  main += '</form>';

  // Preview section
  main += '<div id="register-preview" class="register-preview hidden"></div>';

  main += '</div>';

  return { sidebar, main };
}

function bindRegisterEvents() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('reg-name').value,
      displayName: document.getElementById('reg-display').value,
      description: document.getElementById('reg-desc').value,
      category: document.getElementById('reg-category').value,
      price: parseFloat(document.getElementById('reg-price').value),
      paymentAddress: document.getElementById('reg-payment').value,
      gateway: document.getElementById('reg-gateway').value,
      tools: parseInt(document.getElementById('reg-tools').value) || 0,
    };

    const preview = document.getElementById('register-preview');
    preview.classList.remove('hidden');
    preview.innerHTML = `
      <h3>Registration Submitted</h3>
      <pre class="code-block"><code>{
  "name": "${data.name}",
  "displayName": "${data.displayName}",
  "category": "${data.category}",
  "price": ${data.price},
  "gateway": "${data.gateway}",
  "paymentAddress": "${data.paymentAddress.slice(0, 12)}...",
  "status": "pending_verification",
  "tx": "0x..."
}</code></pre>
      <p class="preview-note">Your service will appear in the catalog after on-chain verification (~2 min).</p>
    `;
  });
}

export { renderRegister, bindRegisterEvents };
