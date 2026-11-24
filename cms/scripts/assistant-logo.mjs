// Our own icon for the "Claude, ChatGPT and Copilot" integration (three brands in one, so none
// of their logos): a chat bubble with a connector plugged in (the MCP server), in the site's colours.
//   node cms/scripts/assistant-logo.mjs  → cms/src/seed/logos/claude-chatgpt-and-copilot.png
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)('playwright');
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'seed', 'logos', 'claude-chatgpt-and-copilot.png');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" fill="#003230"/>
  <!-- chat bubble -->
  <path d="M96 128 h248 a40 40 0 0 1 40 40 v120 a40 40 0 0 1 -40 40 h-150 l-62 54 v-54 h-36 a40 40 0 0 1 -40 -40 v-120 a40 40 0 0 1 40 -40 Z" fill="#78ffaf"/>
  <!-- three dots: the assistant writing -->
  <circle cx="160" cy="228" r="20" fill="#003230"/><circle cx="220" cy="228" r="20" fill="#003230"/><circle cx="280" cy="228" r="20" fill="#003230"/>
  <!-- connector plugged into the bubble -->
  <path d="M384 228 h28" stroke="#78ffaf" stroke-width="20" stroke-linecap="round"/>
  <rect x="408" y="188" width="44" height="80" rx="12" fill="#e8f0ef"/>
  <path d="M452 208 h22 M452 248 h22" stroke="#e8f0ef" stroke-width="14" stroke-linecap="round"/>
</svg>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 512, height: 512 } });
await p.setContent(`<body style="margin:0">${svg}</body>`);
await p.screenshot({ path: out });
await b.close();
