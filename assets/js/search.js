/* Busca em tempo real (nome, código, categoria) com debounce. */

import { $, bus, debounce } from "./utils.js";
import { setFiltro } from "./catalog.js";

export function initSearch() {
  const input = $("#search");
  const clear = $("#search-clear");
  if (!input) return;

  const handler = debounce((value) => {
    setFiltro({ query: value });
  }, 220);

  input.addEventListener("input", () => {
    handler(input.value);
    clear.classList.toggle("is-visible", input.value.length > 0);
  });

  clear?.addEventListener("click", () => {
    input.value = "";
    clear.classList.remove("is-visible");
    setFiltro({ query: "" });
    input.focus();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      clear.classList.remove("is-visible");
      setFiltro({ query: "" });
    }
  });

  bus.on("filtros:reset", () => {
    input.value = "";
    clear?.classList.remove("is-visible");
  });
}