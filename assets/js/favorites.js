/* Favoritos: conjunto de códigos de produto persistido em LocalStorage. */

import { $$, bus } from "./utils.js";

const KEY = "olivelas:favs";
let favs = new Set();

export function initFavorites() {
  load();
  bus.on("fav:change", paintHearts);
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
  if (favs.has(productId)) favs.delete(productId);
  else favs.add(productId);
  save();
}

export function getIds() {
  return new Set(favs);
}

function paintHearts() {
  $$("[data-fav-id]").forEach((el) => {
    const active = favs.has(el.dataset.favId);
    el.classList.toggle("is-active", active);
    el.setAttribute("aria-pressed", String(active));
  });
}