/* Catálogo: fetch, normalização para itens planos (produto × variante)
   e seleção pura (query + categoria + faixa de preço + ordenação).
   O JSON é a única fonte de dados — nada é fixo no HTML. */

import { bus, normText, slugify } from "./utils.js";
import { getIds } from "./favorites.js";

const DEFAULT_SORT = "relevancia";

const state = {
  meta: null,
  hero: null,
  categorias: [],
  itens: [],
  porId: new Map(),
  limitesPreco: { min: 0, max: 0 },
  filtros: {
    query: "",
    categoria: "todos",
    precoMin: 0,
    precoMax: Infinity,
    sort: DEFAULT_SORT,
    favoritos: false,
  },
};

export async function loadStore(url = "assets/data/produtos.json") {
  let res;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (cause) {
    const err = new Error("Falha de rede ao buscar " + url, { cause });
    err.url = url;
    throw err;
  }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ao buscar ${url}`);
    err.status = res.status;
    err.url = url;
    throw err;
  }
  const data = await res.json();
  normalize(data);
  bus.emit("store:ready", state);
  return state;
}

function normalize(data) {
  state.meta = data.meta || {};
  state.hero = data.hero || {};
  state.categorias = (data.categorias || []).map((c) => ({
    id: c.id || slugify(c.nome),
    nome: c.nome,
    descricao: c.descricao || "",
    total: c.produtos?.length || 0,
  }));

  const itens = [];
  (data.categorias || []).forEach((cat) => {
    const catId = cat.id || slugify(cat.nome);
    (cat.produtos || []).forEach((p) => {
      const tamanhos = Array.isArray(p.tamanhos) && p.tamanhos.length ? p.tamanhos : [{}];
      const variantes = tamanhos.map((t, i) => ({
        uid: `${p.id || slugify(p.nome)}-${t.tipo ? slugify(t.tipo) : i + 1}`,
        tamanho: t.tipo || "Único",
        recipiente: t.recipiente || "",
        peso: t.peso || "—",
        quantidade: Number(t.quantidade) || 1,
        preco: Number(t.preco) || 0,
        queima: t.queima || "",
        medidas: t.medidas || "",
        imagem: t.imagem || p.imagem || "",
        imagemThumb: t.imagemThumb || t.imagem || p.imagemThumb || p.imagem || "",
      }));
      variantes.forEach((v, i) => {
        const item = {
          ...v,
          id: p.id || "",
          nome: p.nome || "Produto",
          slug: p.slug || slugify(p.nome),
          familia: p.familiaOlfativa || "",
          cor: p.corExclusiva || "",
          icone: p.icone || "",
          badge: p.badge || "",
          descricao: p.descricao || "",
          imagem: v.imagem || p.imagem || "",
          imagemThumb: v.imagemThumb || p.imagemThumb || p.imagem || "",
          categoriaId: catId,
          categoriaNome: cat.nome,
          variantes: variantes.map((x) => ({ ...x, ativo: x.uid === v.uid })),
        };
        itens.push(item);
        state.porId.set(item.uid, item);
      });
    });
  });

  state.itens = itens;
  const prices = itens.map((i) => i.preco);
  state.limitesPreco = {
    min: prices.length ? Math.floor(Math.min(...prices)) : 0,
    max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
  };
}

/* ---------- Seleção (função pura) ---------- */
const SORTS = {
  "preco-asc": (a, b) => a.preco - b.preco,
  "preco-desc": (a, b) => b.preco - a.preco,
  az: (a, b) => a.nome.localeCompare(b.nome, "pt-BR"),
  za: (a, b) => b.nome.localeCompare(a.nome, "pt-BR"),
  relevancia: (a, b) =>
    Number(b.badge !== "") - Number(a.badge !== "") || a.nome.localeCompare(b.nome, "pt-BR"),
};

export function getItensFiltrados() {
  const { query, categoria, precoMin, precoMax, sort, favoritos } = state.filtros;
  let list = state.itens;

  if (categoria !== "todos") list = list.filter((i) => i.categoriaId === categoria);

  if (favoritos) {
    const favs = getIds();
    list = list.filter((i) => favs.has(i.uid) || favs.has(i.id));
  }

  if (precoMin > state.limitesPreco.min) list = list.filter((i) => i.preco >= precoMin);
  if (precoMax < state.limitesPreco.max) list = list.filter((i) => i.preco <= precoMax);

  if (query) {
    const q = normText(query);
    list = list.filter((i) =>
      normText(`${i.nome} ${i.id} ${i.familia} ${i.categoriaNome}`).includes(q)
    );
  }

  return [...list].sort(SORTS[sort] || SORTS[DEFAULT_SORT]);
}

export function setFiltro(patch) {
  Object.assign(state.filtros, patch);
  bus.emit("filtros:change", state.filtros);
}

export function getItem(uid) {
  return state.porId.get(uid);
}

export const getStore = () => state;