/* Favoritos: conjunto de códigos de produto persistido em LocalStorage. */

import { $, $$, bus } from "./utils.js";

const KEY = "olivelas:favs";
let favs = new Set();

export function initFavorites() {
  load();
  bus.on("fav:change", paintFavoritesGlobal);
}

function load() {
  try {
    favs = new Set(JSON.parse(localStorage.getItem(KEY)) || []);
  } catch {
    favs = new Set();
  }
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...favs]));
  } catch {
    /* armazenamento indisponível */
  }
  bus.emit("fav:change", { ids: getIds() });
}

export const isFav = (productId) => favs.has(productId);

export function toggleFav(productId) {
  if (!productId) return;
  if (favs.has(productId)) favs.delete(productId);
  else favs.add(productId);
  save();
}

export function getIds() {
  return new Set(favs);
}

export function paintFavoritesGlobal() {
  // Atualiza botões nos cards da grade e dos destaques da home
  $$("[data-action='fav']").forEach((el) => {
    const id = el.dataset.id;
    const active = favs.has(id);
    el.classList.toggle("is-active", active);
    el.setAttribute("aria-pressed", String(active));
    el.setAttribute("aria-label", active ? "Remover dos favoritos" : "Adicionar aos favoritos");
  });

  // Atualiza botão do modal se estiver aberto
  const modalBtn = $("#product-modal [data-action='fav-toggle']");
  if (modalBtn) {
    const id = modalBtn.dataset.id;
    const active = favs.has(id);
    modalBtn.classList.toggle("is-active", active);
    modalBtn.classList.toggle("is-fav", active);
    modalBtn.setAttribute("aria-pressed", String(active));
    const label = modalBtn.querySelector("span");
    if (label) label.textContent = active ? "Favoritado" : "Favoritar";
  }
}