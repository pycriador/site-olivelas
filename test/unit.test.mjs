import { readFile } from "node:fs/promises";
import { loadStore, getStore, getItensFiltrados, setFiltro } from "../assets/js/catalog.js";
import { waLink, mensagemProduto, mensagemPedido } from "../assets/js/whatsapp.js";
import { formatCurrency, slugify } from "../assets/js/utils.js";

const raw = await readFile(new URL("../assets/data/produtos.json", import.meta.url), "utf8");
const payload = JSON.parse(raw);

globalThis.fetch = async () => ({ ok: true, json: async () => payload });

let pass = 0;
const check = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (cond) pass++;
  else throw new Error(`assertion failed: ${name}`);
};

await loadStore("assets/data/produtos.json");
const store = getStore();

check("meta.nome === OLIVELAS", store.meta.nome === "OLIVELAS");
check("whatsapp presente", store.meta.whatsapp === "5511963820374");
check("26 itens normalizados (9 velas*2 + 3 kits + 3 arom + 2 acess)", store.itens.length === 26);
check("4 categorias", store.categorias.length === 4);
check("itens com uid único", new Set(store.itens.map((i) => i.uid)).size === store.itens.length);

const todas = getItensFiltrados();
check("sem filtro -> 26", todas.length === 26);
check("sem filtro sort relevancia começa com badge", todas[0].badge !== "");

setFiltro({ categoria: "acessorios" });
let list = getItensFiltrados();
check("filtro categoria acessorios -> 2", list.length === 2 && list.every((i) => i.categoriaId === "acessorios"));

setFiltro({ query: "lavanda", categoria: "todos" });
list = getItensFiltrados();
check("busca lavanda -> 3 (Difusor + Mini + Grande)", list.length === 3 && list.every((i) => /lavanda/i.test(i.nome.toLowerCase().normalize("NFD"))));

setFiltro({ query: "OV05", categoria: "todos" });
list = getItensFiltrados();
check("busca por código OV05 -> 2 (mini+grande)", list.length === 2);

setFiltro({ categoria: "todos", query: "", precoMin: 20, precoMax: 40 });
list = getItensFiltrados();
check("faixa preço 20-40 exclui 16,90 e 42,90+", list.length > 0 && list.every((i) => i.preco >= 20 && i.preco <= 40));

setFiltro({ precoMin: 0, precoMax: Infinity, sort: "preco-asc" });
list = getItensFiltrados();
check("mais barato primeiro = Cortador 16,90", list[0].preco === 16.9);

setFiltro({ sort: "az", precoMin: 0, precoMax: Infinity });
list = getItensFiltrados();
check("ordem A-Z", list[0].nome === "Alfazema");

check("formatCurrency BRL", formatCurrency(92.9).replace(/[\u202f\u00a0]/g, " ") === "R$ 92,90");
check("slugify remove acentos", slugify("Orquídea Negra") === "orquidea-negra");

const item = store.itens.find((i) => i.id === "OV01" && i.tamanho === "Mini");
const msg = mensagemProduto(item);
check("mensagem produto contém nome", msg.includes("Verbena"));
check("mensagem produto contém código", msg.includes("OV01"));
check("mensagem produto tem preço formatado", msg.includes("42,90"));
check("waLink numérico + encoded", waLink(" 5511963820374 ", "Olá!") === "https://wa.me/5511963820374?text=Ol%C3%A1!");

const pedido = mensagemPedido(
  [
    { nome: "Verbena", tamanho: "Mini", qtd: 2, subtotal: 85.8 },
    { nome: "Lavanda", tamanho: "Grande", qtd: 1, subtotal: 88.9 },
  ],
  174.7,
  store.meta
);
check("mensagem pedido com total estimado", pedido.includes("Total estimado:") && pedido.includes("174,70"));
const miniItem = store.itens.find((i) => i.id === "OV01" && i.tamanho === "Mini");
const padraoItem = store.itens.find((i) => i.id === "OV01" && i.tamanho === "Padrão");
check("mini vela tem imagem própria diferente da vela padrão", miniItem.imagem !== padraoItem.imagem && miniItem.imagem.includes("-mini"));
check("mini vela e padrão têm uids distintos", miniItem.uid === "OV01-mini" && padraoItem.uid === "OV01-padrao");

const acessorioItem = store.itens.find((i) => i.categoriaId === "acessorios");
const aromatizadorItem = store.itens.find((i) => i.categoriaId === "aromatizadores");
check("acessorios classificados como em breve", acessorioItem.badge === "Em breve");
check("aromatizadores classificados como em breve", aromatizadorItem.badge === "Em breve");
check("velas aromaticas continuam disponiveis", miniItem.esgotado === false);

console.log(`\n${pass} checks passed.`);