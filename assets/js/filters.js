/* Filtros: menu de categorias (lido do JSON), ordenação e faixa de preço. */

import { $, $$, clamp, bus, formatCurrency } from "./utils.js";
import { getStore, setFiltro } from "./catalog.js";

let popoverOpen = false;

export function initFilters() {
  bus.on("categoria:select", selectCategoria);
  renderCategories();
  initSort();
  initPriceRange();
}

/* ---------- Menu de categorias ---------- */
function renderCategories() {
  const { categorias, itens } = getStore();
  const wrap = $("#categorias");
  if (!wrap) return;

  const counts = new Map();
  itens.forEach((i) => counts.set(i.categoriaId, (counts.get(i.categoriaId) || 0) + 1));

  const pills = [{ id: "todos", nome: "Todos", total: itens.length }, ...categorias.map((c) => ({ ...c, total: counts.get(c.id) || 0 }))];

  wrap.innerHTML = pills
    .map(
      (c, i) => `
      <button type="button" class="cat-pill${c.id === "todos" ? " is-active" : ""}"
        data-action="categoria" data-value="${c.id}" role="tab"
        aria-selected="${c.id === "todos"}"
        aria-controls="grid"
        id="tab-${c.id}"
        style="--i:${i}">
        ${c.nome}
        <span class="cat-count">${c.total}</span>
      </button>`
    )
    .join("");

  wrap.addEventListener("click", (e) => {
    const pill = e.target.closest("[data-action='categoria']");
    if (!pill) return;
    selectCategoria(pill.dataset.value);
  });
}

function selectCategoria(id) {
  setFiltro({ categoria: id });
  $$("#categorias .cat-pill").forEach((p) => {
    const active = p.dataset.value === id;
    p.classList.toggle("is-active", active);
    p.setAttribute("aria-selected", String(active));
  });
}

/* ---------- Ordenação ---------- */
function initSort() {
  const select = $("#sort");
  if (!select) return;
  const labels = { relevancia: "Relevância", "preco-asc": "Mais baratos", "preco-desc": "Mais caros", az: "A–Z", za: "Z–A" };
  select.innerHTML = Object.entries(labels)
    .map(([v, t]) => `<option value="${v}">${t}</option>`)
    .join("");
  select.value = getStore().filtros.sort;
  select.addEventListener("change", () => setFiltro({ sort: select.value }));
}

/* ---------- Faixa de preço (slider duplo) ---------- */
function initPriceRange() {
  const { limitesPreco } = getStore();
  const min = limitesPreco.min;
  const max = Math.max(limitesPreco.max, min + 1);

  const root = $("#price-popover");
  if (!root) return;

  const elMin = root.querySelector("#price-min");
  const elMax = root.querySelector("#price-max");
  const fill = root.querySelector("#price-track-fill");
  const readMin = root.querySelector("#price-out-min");
  const readMax = root.querySelector("#price-out-max");

  elMin.min = elMax.min = min;
  elMin.max = elMax.max = max;
  elMin.value = min;
  elMax.value = max;
  elMin.step = elMax.step = 1;

  const paint = () => {
    const lo = Math.min(Number(elMin.value), Number(elMax.value));
    const hi = Math.max(Number(elMin.value), Number(elMax.value));
    const span = max - min || 1;
    const pct = (v) => clamp(((v - min) / span) * 100, 0, 100);
    fill.style.left = `${pct(lo)}%`;
    fill.style.width = `${pct(hi) - pct(lo)}%`;
    readMin.textContent = formatCurrency(lo);
    readMax.textContent = formatCurrency(hi);
    setFiltro({ precoMin: lo, precoMax: hi });
  };

  const sync = () => {
    if (Number(elMin.value) > Number(elMax.value) - 1) {
      const swap = Number(elMin.value) > Number(elMax.value);
      if (swap) {
        const t = elMin.value;
        elMin.value = elMax.value;
        elMax.value = t;
      }
    }
    paint();
  };

  elMin.addEventListener("input", () => {
    elMin.value = Math.min(Number(elMin.value), Number(elMax.value));
    paint();
  });
  elMax.addEventListener("input", () => {
    elMax.value = Math.max(Number(elMax.value), Number(elMin.value));
    paint();
  });
  elMin.addEventListener("change", sync);
  elMax.addEventListener("change", sync);

  paint();

  const toggle = $("#price-toggle");
  if (toggle) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      popoverOpen = !popoverOpen;
      root.classList.toggle("is-open", popoverOpen);
      toggle.setAttribute("aria-expanded", String(popoverOpen));
    });
  }
  document.addEventListener("click", (e) => {
    if (popoverOpen && !root.classList.contains("is-open")) return;
    if (popoverOpen && !root.contains(e.target) && !(toggle && toggle.contains(e.target))) {
      popoverOpen = false;
      root.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    }
  });
  bus.on("filtros:reset", () => {
    elMin.value = min;
    elMax.value = max;
    paint();
  });
}