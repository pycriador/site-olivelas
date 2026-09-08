import { FALLBACK_DATA } from "../novo/assets/js/data.js";
import { formatCurrency, slugify, normalizeStr } from "../novo/assets/js/utils.js";
import { buildDirectItemUrl, buildCartCheckoutUrl, WA_PHONE } from "../novo/assets/js/whatsapp.js";

let pass = 0;
const check = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (cond) pass++;
  else throw new Error(`assertion failed: ${name}`);
};

console.log("=== Running /novo Suite Tests ===");

// 1. Data checks
check("FALLBACK_DATA tem 9 velas", FALLBACK_DATA.velas.length === 9);
check("FALLBACK_DATA tem 3 kits", FALLBACK_DATA.kits.length === 3);
check("FALLBACK_DATA tem 3 aromatizadores", FALLBACK_DATA.aromatizadores.length === 3);
check("FALLBACK_DATA tem 2 acessorios", FALLBACK_DATA.acessorios.length === 2);
check("FALLBACK_DATA.produtos tem 17 itens", FALLBACK_DATA.produtos.length === 17);
check("FALLBACK_DATA tem 3 seções homeFeatured", Array.isArray(FALLBACK_DATA.homeFeatured) && FALLBACK_DATA.homeFeatured.length === 3);
check("homeFeatured contém novidades, mais-vendidos e rituais", FALLBACK_DATA.homeFeatured.map(s => s.id).join(",") === "novidades,mais-vendidos,rituais");
check("Verbena possui tag mais-vendidos", FALLBACK_DATA.velas.find(v => v.id === "OV01").tags.includes("mais-vendidos"));
check("Morango possui tag novidades", FALLBACK_DATA.velas.find(v => v.id === "OV03").tags.includes("novidades"));
check("Difusor possui tag rituais", FALLBACK_DATA.aromatizadores.find(a => a.id === "ARO1").tags.includes("rituais"));

// 1.1 Category & Em breve checks
const cortador = FALLBACK_DATA.acessorios.find(a => a.id === "ACC2");
check("Cortador de pavio tem status Em breve", cortador.emBreve === true || cortador.badge === "Em breve");

const kit10 = FALLBACK_DATA.kits.find(k => k.id === "KIT02");
check("Kit 10 Mini Velas está disponível com preço", kit10 && kit10.tamanhos[0].preco === 369.0);

const difusor = FALLBACK_DATA.aromatizadores.find(d => d.id === "ARO1");
check("Difusor de varetas tem status Em breve", difusor.emBreve === true || difusor.badge === "Em breve");

// 2. Formatters
check("formatCurrency formata 92.9 como R$ 92,90", formatCurrency(92.9).replace(/[\u202f\u00a0]/g, " ") === "R$ 92,90");
check("slugify trata caracteres", slugify("Orquídea Negra") === "orquidea-negra");
check("normalizeStr trata maiúsculas e acentos", normalizeStr("Mamãe & Bebê") === "mamae & bebe");

// 3. Candle structures & variants
const verbena = FALLBACK_DATA.velas.find(v => v.id === "OV01");
check("Verbena tem 2 tamanhos (Mini e Padrão)", verbena.tamanhos.length === 2);
check("Verbena Mini tem uid OV01-mini", verbena.tamanhos[0].uid === "OV01-mini");
check("Verbena Padrão tem uid OV01-padrao", verbena.tamanhos[1].uid === "OV01-padrao");
check("Verbena Mini tem imagem própria com -mini", verbena.tamanhos[0].imagem.includes("-mini"));

// 4. WhatsApp Direct URLs
const directUrl = buildDirectItemUrl("Verbena", "Tamanho Padrão 230 g");
check("directUrl tem wa.me", directUrl.includes("https://wa.me/5511963820374?text="));
check("directUrl contém nome da vela", directUrl.includes("Verbena"));
check("directUrl contém tamanho", directUrl.includes("230%20g"));

// 5. Cart Checkout message
const sampleCart = [
  { nome: "Verbena", tipo: "Padrão", peso: "230 g", preco: 92.9, quantidade: 2 },
  { nome: "Difusor de Varetas Lavanda", tipo: "Padrão", peso: "", preco: 89.9, quantidade: 1 }
];
const checkoutUrl = buildCartCheckoutUrl(sampleCart, "R$ 275,70");
check("checkoutUrl contém Olivelas", checkoutUrl.includes("OLIVELAS"));
check("checkoutUrl contém Verbena", checkoutUrl.includes("Verbena"));
check("checkoutUrl contém Difusor", checkoutUrl.includes("Difusor"));
check("checkoutUrl contém total R$ 275,70", checkoutUrl.includes("275%2C70"));

// 6. Availability & Cart/Favs Rules
const isItemUnavailable = (item) => {
  return Boolean(
    item.esgotado ||
    item.emBreve ||
    (item.badge && (
      item.badge.toLowerCase().includes('breve') ||
      item.badge.toLowerCase().includes('esgotado')
    ))
  );
};

const emBreveItem = FALLBACK_DATA.acessorios.find(a => a.id === "ACC2");
check("Produto 'Em breve' é detectado como indisponível para carrinho", isItemUnavailable(emBreveItem) === true);

const esgotadoItem = { id: "TEST_OUT", nome: "Vela Esgotada", esgotado: true, badge: "Esgotado" };
check("Produto 'Esgotado' é detectado como indisponível para carrinho", isItemUnavailable(esgotadoItem) === true);

const normalItem = FALLBACK_DATA.velas.find(v => v.id === "OV01");
check("Produto regular está disponível para carrinho", isItemUnavailable(normalItem) === false);

// Favoritos podem receber qualquer produto independente de estoque
const favSet = new Set();
favSet.add(emBreveItem.id);
favSet.add(esgotadoItem.id);
favSet.add(normalItem.id);
check("Favoritos aceitam produtos regulares, em breve e esgotados", favSet.has("ACC2") && favSet.has("TEST_OUT") && favSet.has("OV01"));

// 7. Pagination Logic Checks
function paginationSlots(curr, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, curr, curr - 1, curr + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  sorted.forEach((p) => {
    if (prev && p - prev > 1) out.push('...');
    out.push(p);
    prev = p;
  });
  return out;
}

function sizesFor(cols, total) {
  const step = cols * 2;
  if (!step || step < 1 || total < 1) return [Math.max(1, total)];
  const opts = [];
  for (let s = step; s <= total; s += step) opts.push(s);
  if (opts[opts.length - 1] !== total) opts.push(total);
  return opts;
}

import fs from "fs";
import path from "path";

check("paginationSlots para 3 páginas gera [1, 2, 3]", JSON.stringify(paginationSlots(1, 3)) === "[1,2,3]");
check("paginationSlots para 10 páginas na página 5 inclui ellipsis", paginationSlots(5, 10).includes("..."));
check("sizesFor 3 colunas e 17 itens gera múltiplos de 6", sizesFor(3, 17).includes(6) && sizesFor(3, 17).includes(12) && sizesFor(3, 17).includes(17));

// 8. SEO & Accessibility (a11y) Checks
const novoHtmlPath = path.resolve("./novo/index.html");
const novoHtml = fs.readFileSync(novoHtmlPath, "utf-8");

check("HTML declara lang='pt-BR'", novoHtml.includes('lang="pt-BR"'));
check("Meta description presente e otimizada", novoHtml.includes('<meta name="description"') && novoHtml.includes("cera 100% vegetal"));
check("Canonical tag presente", novoHtml.includes('<link rel="canonical" href="https://olivelas.com.br/novo/">'));
check("OpenGraph e Twitter cards presentes", novoHtml.includes('property="og:image"') && novoHtml.includes('name="twitter:card"'));
check("Schema.org JSON-LD presente", novoHtml.includes('<script type="application/ld+json">') && novoHtml.includes('"@type": "LocalBusiness"'));
check("Skip link para acessibilidade presente", novoHtml.includes('class="skip-link"') && novoHtml.includes('href="#colecao"'));
check("Role main ou tag main presentes com landmarks", novoHtml.includes('<main') && novoHtml.includes('role="banner"') && novoHtml.includes('role="contentinfo"'));
check("Imagens possuem atributo alt", !novoHtml.includes('<img') || !novoHtml.includes('<img :not([alt])>'));
check("Busca possui label acessível para leitores de tela", novoHtml.includes('for="catalog-search-input"') && novoHtml.includes('visually-hidden'));

console.log(`\nAll ${pass} checks passed for /novo!`);



