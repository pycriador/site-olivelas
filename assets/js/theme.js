/* Tema (Dark Mode) + tokens de marca vindos do JSON.
   As cores da marca são gravadas em --brand-* (inline, no <html>);
   o tema escuro inverte apenas as variáveis "folha", via CSS. */

import { $, bus } from "./utils.js";

const STORAGE_KEY = "olivelas:theme";
const BRAND_KEYS = {
  corPrimaria: "--brand-ink",
  corSecundaria: "--brand-accent",
  corFundo: "--brand-paper",
  corApoio: "--brand-mist",
};

const GOOGLE_FONTS = (titulo, texto) => {
  const fam = [titulo, texto].filter(Boolean);
  if (!fam.length) return null;
  const families = fam.map((f) => f.replace(/\s+/g, "+")).join("&family=");
  return `https://fonts.googleapis.com/css2?family=${families}:wght@400;600;700&display=swap`;
};

export function applyBrand(meta = {}) {
  const root = document.documentElement;
  Object.entries(BRAND_KEYS).forEach(([key, prop]) => {
    if (meta[key]) root.style.setProperty(prop, meta[key]);
  });
  if (meta.fonteTitulo) root.style.setProperty("--font-heading", `"${meta.fonteTitulo}", Didot, Georgia, serif`);
  if (meta.fonteTexto) root.style.setProperty("--font-body", `"${meta.fonteTexto}", "Segoe UI", system-ui, sans-serif`);
  injectFontLink(meta.fonteTitulo, meta.fonteTexto);
}

export function initTheme(meta = {}) {
  applyBrand(meta);
  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  setTheme(initial);
  bus.on("theme:toggle", () =>
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")
  );
}

export function setTheme(mode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* armazenamento indisponível */
  }
  const btn = $("#theme-toggle");
  if (btn) {
    btn.setAttribute("aria-pressed", String(mode === "dark"));
    btn.setAttribute("aria-label", mode === "dark" ? "Desativar modo escuro" : "Ativar modo escuro");
    btn.innerHTML = mode === "dark" ? icons.sun : icons.moon;
  }
  bus.emit("theme:changed", mode);
}

function injectFontLink(titulo, texto) {
  const href = GOOGLE_FONTS(titulo, texto);
  if (!href) return;
  const existing = $('link[rel="stylesheet"][data-fonts]');
  if (existing && existing.href === href) return;
  if (existing) existing.remove();
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.fonts = "";
  document.head.appendChild(link);
}

/* SVG de ícones (tema/carrinho/busca) em linha, sem dependências externas. */
export const icons = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6.05H5.12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  what: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.02A9.82 9.82 0 0 0 12.04 2Zm5.83 14.12c-.25.7-1.45 1.33-2 1.38-.51.05-1.16.07-1.87-.12-.43-.11-.99-.32-1.7-.63-3.01-1.3-4.97-4.32-5.12-4.52-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37h.57c.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.33.03.53-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03.1.09.19.14.29.19.1.05.23.06.32-.04.1-.11.42-.49.53-.66.11-.17.23-.14.39-.08.15.05.98.46 1.15.55.17.08.28.12.32.2.05.06.05.37-.11.78Z"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4M12 2v13"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
  arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5v14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
};