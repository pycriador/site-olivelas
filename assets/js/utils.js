/* Utilidades puras + micro event bus para desacoplar módulos. */

export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

export const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const debounce = (fn, ms = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const normText = (s = "") =>
  s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export const formatCurrency = (value, moeda = "BRL", locale = "pt-BR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: moeda }).format(value);

export const formatDate = (iso, locale = "pt-BR") =>
  new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(new Date(iso));

export const slugify = (s = "") =>
  normText(s).trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Event Bus ---------- */
class Emitter {
  constructor() {
    this._map = new Map();
  }
  on(event, fn) {
    if (!this._map.has(event)) this._map.set(event, new Set());
    this._map.get(event).add(fn);
    return () => this.off(event, fn);
  }
  off(event, fn) {
    this._map.get(event)?.delete(fn);
  }
  emit(event, payload) {
    this._map.get(event)?.forEach((fn) => fn(payload));
  }
}

export const bus = new Emitter();

/* ---------- Clipboard / Share ---------- */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } finally {
      ta.remove();
    }
    return ok;
  }
};

export const webShare = (data) =>
  navigator.share ? navigator.share(data).then(() => true, () => false) : Promise.resolve(false);

/* ---------- Scroll ---------- */
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const scrollTop = () =>
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });

/* ---------- Data URI helpers ---------- */
export const withCacheBust = (url, version = "1") => `${url}?v=${version}`;