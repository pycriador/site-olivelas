/* Modal de produto: detalhes, troca de variante, favoritar, compartilhar e carrinho. */

import { $, $$, bus, formatCurrency, copyToClipboard, webShare } from "./utils.js";
import { getItem, getStore } from "./catalog.js";
import { addItem, openSidebar } from "./cart.js";
import { isFav, toggleFav } from "./favorites.js";
import { waLink, mensagemProduto } from "./whatsapp.js";
import { icons } from "./theme.js";

let lastFocused = null;
let currentUid = "";

export function initModal() {
  const modal = $("#product-modal");
  const closeBtn = $("#modal-close");

  closeBtn?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    const { action } = actionEl.dataset;
    if (action === "modal-close") closeModal();
    if (action === "variant") openModal(actionEl.dataset.uid);
    if (action === "fav-toggle") {
      toggleFav(actionEl.dataset.id);
      rerenderActions();
    }
    if (action === "share") shareCurrent();
    if (action === "copy") copyCurrent();
    if (action === "modal-add") {
      addItem(currentUid, 1);
      closeModal();
      openSidebar();
      bus.emit("toast", { type: "success", text: "Produto adicionado ao carrinho" });
    }
  });
  modal?.addEventListener("keydown", trapFocus);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeModal();
  });
}

export function isOpen() {
  return $("#product-modal")?.classList.contains("is-open") ?? false;
}

export function openModal(uid) {
  const item = getItem(uid);
  if (!item) return;
  currentUid = uid;
  lastFocused = document.activeElement;

  const modal = $("#product-modal");
  renderMedia(item);
  renderBody(item);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  $("#modal-close")?.focus();
  updateHash(item);
}

export function closeModal() {
  const modal = $("#product-modal");
  if (!modal?.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("is-locked");
  if (lastFocused) lastFocused.focus();
  const { pathname, search, hash } = location;
  if (hash.startsWith("#produto-")) {
    history.replaceState(null, "", pathname + search);
  }
}

export function resolveHash(hash) {
  if (!hash.startsWith("#produto-")) return;
  const uid = hash.slice("#produto-".length);
  const item = getItem(uid);
  if (item) openModal(uid);
  else {
    const guess = [...getStore().itens].find((i) => i.slug === uid || i.slug === uid.replace(/-/g, ""));
    if (guess) openModal(guess.uid);
  }
}

function renderMedia(item) {
  const media = $("#modal-media");
  const src = item.imagem || "assets/images/placeholder.webp";
  media.innerHTML = `
    ${item.badge ? `<span class="badge-chip modal-badge">${item.badge}</span>` : ""}
    <div class="modal-image-wrapper">
      <img src="${src}" alt="${item.nome}" width="800" height="800">
    </div>`;
}

function renderBody(item) {
  const body = $("#modal-body");
  const variants = getStore().itens.filter((i) => i.id === item.id && i.uid !== item.uid);
  const specs = [
    ["Peso / Tamanho", item.peso],
    ["Recipiente", item.recipiente],
    ["Cera", "100% Vegetal (Livre de parafina)"],
    ["Pavio", "100% Algodão Puro"],
    item.queima ? ["Tempo de queima", item.queima] : null,
    item.medidas ? ["Medidas", item.medidas] : null,
    ["Categoria", item.categoriaNome],
  ].filter(Boolean);

  body.innerHTML = `
    <div>
      <div class="modal-family-row">
        ${item.cor ? `<span class="card-color-dot" style="background:${item.cor}"></span>` : ""}
        ${item.familia ? `<span class="modal-family">${item.familia}</span>` : `<span class="modal-family">${item.categoriaNome}</span>`}
      </div>
      <h3 class="modal-title" id="modal-title">${item.nome}</h3>
    </div>

    <p class="modal-price">${formatCurrency(item.preco)}</p>

    ${item.descricao ? `<p class="modal-desc">${item.descricao}</p>` : ""}

    ${variants.length ? `
      <div>
        <p class="variant-label">Escolha o tamanho</p>
        <div class="variant-list" role="radiogroup" aria-label="Tamanho">
          ${[item, ...variants].sort((a, b) => a.preco - b.preco).map((v) => `
            <button class="variant-opt${v.uid === currentUid ? " is-active" : ""}" role="radio"
              aria-checked="${v.uid === currentUid}" data-action="variant" data-uid="${v.uid}">
              <span class="variant-opt-main">
                <span class="variant-opt-title">${v.tamanho}</span>
                <span class="variant-opt-sub">${v.peso} · ${formatCurrency(v.preco)}</span>
              </span>
              <span class="variant-opt-price">${formatCurrency(v.preco)}</span>
            </button>`).join("")}
        </div>
      </div>` : ""}

    <dl class="spec-grid" aria-label="Especificações">
      ${specs.map(([k, v]) => `<div class="spec-item"><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
    </dl>

    <div class="mini-actions">
      <button type="button" class="mini-btn mini-btn-fav${isFav(item.id) ? " is-active is-fav" : ""}" data-action="fav-toggle" data-id="${item.id}"
        aria-pressed="${isFav(item.id)}">${icons.heart}<span>${isFav(item.id) ? "Favoritado" : "Favoritar"}</span></button>
      <button type="button" class="mini-btn" data-action="share">${icons.share}<span>Compartilhar</span></button>
      <button type="button" class="mini-btn" data-action="copy">${icons.link}<span>Copiar link</span></button>
    </div>

    <div class="modal-actions">
      <button type="button" class="btn btn-accent btn-block" data-action="modal-add">${icons.cart} Adicionar ao carrinho</button>
      <a class="btn btn-wa-solid btn-block" href="${waLink(getStore().meta.whatsapp, mensagemProduto(item))}"
        target="_blank" rel="noopener" data-action="wa-direct">${icons.what} Pedir pelo WhatsApp</a>
    </div>`;
}

function rerenderActions() {
  const item = getItem(currentUid);
  if (!item) return;
  const btn = $('.modal [data-action="fav-toggle"]');
  if (!btn) return;
  const active = isFav(item.id);
  btn.classList.toggle("is-active", active);
  btn.classList.toggle("is-fav", active);
  btn.setAttribute("aria-pressed", String(active));
  const label = btn.querySelector("span");
  if (label) label.textContent = active ? "Favoritado" : "Favoritar";
}

function shareCurrent() {
  const item = getItem(currentUid);
  if (!item) return;
  const url = shareUrl(item);
  webShare({ title: `${item.nome} — OLIVELAS`, text: item.descricao || item.nome, url }).then((ok) => {
    if (!ok) copyCurrent(url);
  });
}

async function copyCurrent(url = shareUrl(getItem(currentUid))) {
  const ok = await copyToClipboard(url);
  bus.emit("toast", {
    type: ok ? "success" : "error",
    text: ok ? "Link copiado" : "Não foi possível copiar",
  });
}

function shareUrl(item) {
  const { meta } = getStore();
  const base = (meta.site || location.origin + location.pathname).replace(/\/$/, "");
  return `${base}/#produto-${item.uid}`;
}

function updateHash(item) {
  const { pathname, search } = location;
  history.replaceState(null, "", `${pathname}${search}#produto-${item.uid}`);
}

function trapFocus(e) {
  if (e.key !== "Tab") return;
  const modal = $("#product-modal");
  if (!modal?.classList.contains("is-open")) return;
  const focusables = $$('[data-action], a[href], button:not([disabled]), input, select', modal).filter((el) => el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}