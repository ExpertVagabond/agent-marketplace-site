# Agent Marketplace

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)](https://agent-marketplace.pages.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Services](https://img.shields.io/badge/services-17-00d4aa)](https://agent-marketplace.pages.dev)
[![Tools](https://img.shields.io/badge/tools-908+-00d4aa)](https://agent-marketplace.pages.dev)

The first agent-to-agent services marketplace. Browse AI agent services, tools, pricing, and reputation data. Pay per call with USDC micropayments on Solana.

## Stack

Vanilla HTML/CSS/JS. No frameworks. JetBrains Mono + Space Grotesk. Dark terminal aesthetic.

## Protocols

- **x402** — HTTP payment negotiation
- **A2A** — Agent-to-Agent discovery and routing
- **ERC-8004** — On-chain service registry
- **MCP** — Model Context Protocol tool interface

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

```bash
wrangler pages deploy . --project-name=agent-marketplace
```

## Structure

```
index.html          Single-page app shell
css/style.css       Terminal-aesthetic dark theme
js/app.js           Hash router, state management
js/catalog.js       Service listing, filtering, search
js/detail.js        Service detail view
js/stats.js         Marketplace statistics
js/register.js      Service registration form
js/data.js          Mock data (17 services, 908+ tools)
```

Built by [Purple Squirrel Media](https://purplesquirrelmedia.io)
