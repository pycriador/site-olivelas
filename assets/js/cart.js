/* Carrinho: persistência em LocalStorage, sidebar lateral e finalização via WhatsApp. */

import { $, $$, bus, formatCurrency } from "./utils.js";
import { getStore, getItem } from "./catalog.js";
import { waLink, mensagemPedido } from "./whatsapp.js";
import { icons } from "./theme.js";

const KEY = "olivelas:cart";
let items = null;
let open = false;

export function initCart() {
  load();
  buildSidebar();
  bus.on("store:ready", emit);
  bus.on("cart:open", () => openSidebar());
  bus.on("cart:close", () => closeSidebar());
}

/* ---------- Modelo ---------- */
function load() {
  try {
    items = JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    items = {};
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* armazenamento indisponível */
  }
  emit();
}

export function getCount() {
  return Object.values(items || {}).reduce((s, q) => s + q, 0);
}

export function getLines() {
  return Object.entries(items || {})
    .map(([uid, qtd]) => {
      const item = getItem(uid);
      if (!item) return null;
      const subtotal = item.preco * qtd;
      return { uid, item, qtd, subtotal };
    })
    .filter(Boolean);
}

export function getTotal() {
  return getLines().reduce((s, l) => s + l.subtotal, 0);
}

export function addItem(uid, qtd = 1) {
  const item = getItem(uid);
  if (item && item.esgotado) return false;
  if (!items[uid]) items[uid] = 0;
  items[uid] += qtd;
  save();
  return true;
}

export function setQtd(uid, qtd) {
  if (qtd <= 0) {
    delete items[uid];
  } else {
    items[uid] = qtd;
  }
  save();
}

export function clearCart() {
  items = {};
  save();
}

function emit() {
  bus.emit("cart:change", { count: getCount(), total: getTotal() });
}

/* ---------- UI ---------- */
function buildSidebar() {
  const drawer = $("#cart-drawer");
  const overlay = $("#cart-overlay");
  if (!drawer) return;

  drawer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action } = btn.dataset;
    if (action === "cart-close") closeSidebar();
    if (action === "cart-inc") setQtd(btn.dataset.uid, (items[btn.dataset.uid] || 0) + 1);
    if (action === "cart-dec") setQtd(btn.dataset.uid, (items[btn.dataset.uid] || 0) - 1);
    if (action === "cart-remove") delete items[btn.dataset.uid], save();
    if (action === "cart-clear") clearCart();
    if (action === "cart-checkout") checkout();
  });

  overlay?.addEventListener("click", closeSidebar);

  drawer.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  bus.on("cart:change", render);
}

export function openSidebar() {
  open = true;
  $("#cart-drawer")?.classList.add("is-open");
  $("#cart-overlay")?.classList.add("is-open");
  document.body.classList.add("is-locked");
  $("#cart-drawer")?.setAttribute("aria-hidden", "false");
  $("#cart-close")?.focus();
}

export function closeSidebar() {
  open = false;
  $("#cart-drawer")?.classList.remove("is-open");
  $("#cart-overlay")?.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  $("#cart-drawer")?.setAttribute("aria-hidden", "true");
}

function render({ count, total }) {
  const badge = $("#cart-count");
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("is-visible", count > 0);
    badge.setAttribute("aria-hidden", "false");
    const btn = $("#cart-open");
    btn?.setAttribute("aria-label", `Abrir carrinho, ${count} item(ns)`);
  }

  const wrap = $("#cart-items");
  const footer = $("#cart-footer");
  const drawerTitle = $("#cart-drawer-count");
  if (!wrap) return;

  const lines = getLines();
  if (drawerTitle) drawerTitle.textContent = `Carrinho${count ? ` (${count})` : ""}`;

  if (!lines.length) {
    wrap.innerHTML = `
      <div class="cart-empty">
        ${icons.cart}
        <p>Seu carrinho está vazio.<br>Explore o catálogo e adicione produtos.</p>
        <button class="btn btn-primary btn-sm" data-action="cart-close">Continuar comprando</button>
      </div>`;
    footer?.setAttribute("hidden", "");
    return;
  }

  wrap.innerHTML = lines
    .map(
      (l, i) => `
      <article class="cart-line" style="--i:${i}">
        <img class="cart-line-img" src="${l.item.imagemThumb || "assets/images/placeholder.webp"}"
          alt="" loading="lazy" width="84" height="84">
        <div class="cart-line-info">
          <p class="cart-line-name">${l.item.nome}</p>
          <p class="cart-line-meta">${l.item.id}${l.item.tamanho && l.item.tamanho !== "Único" ? ` · ${l.item.tamanho}` : ""} · ${formatCurrency(l.item.preco)}</p>
          <p class="cart-line-sub" aria-label="Subtotal">${formatCurrency(l.subtotal)}</p>
        </div>
        <div class="cart-line-controls">
          <div class="stepper">
            <button data-action="cart-dec" data-uid="${l.uid}" aria-label="Diminuir quantidade">${icons.minus}</button>
            <output aria-live="polite">${l.qtd}</output>
            <button data-action="cart-inc" data-uid="${l.uid}" aria-label="Aumentar quantidade">${icons.plus}</button>
          </div>
          <button class="cart-line-remove" data-action="cart-remove" data-uid="${l.uid}" aria-label="Remover ${l.item.nome}">
            ${icons.trash} Remover
          </button>
        </div>
      </article>`
    )
    .join("");

  const totalLabel = formatCurrency(total);
  $("#cart-total").textContent = totalLabel;
  footer?.removeAttribute("hidden");
}

/* ---------- Checkout ---------- */
function checkout() {
  const { meta } = getStore();
  const lines = getLines();
  if (!lines.length) return;
  const msg = mensagemPedido(
    lines.map((l) => ({ nome: l.item.nome, tamanho: l.item.tamanho, preco: l.item.preco, qtd: l.qtd, subtotal: l.subtotal })),
    getTotal(),
    meta
  );
  window.open(waLink(meta.whatsapp, msg), "_blank", "noopener");
}