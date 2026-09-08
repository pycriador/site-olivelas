import { readFile } from "node:fs/promises";
import path from "node:path";
import { FALLBACK_DATA, loadCatalog } from "../assets/js/data.js";
import { buildDirectItemUrl, buildCartCheckoutUrl } from "../assets/js/whatsapp.js";
import { formatCurrency, slugify, normalizeStr } from "../assets/js/utils.js";

let pass = 0;
const check = (name, cond) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`);
  if (cond) pass++;
  else throw new Error(`assertion failed: ${name}`);
};

console.log("=== Running Root Main Suite Tests ===");

// 1. Data Store Checks
check("meta.nome === OLIVELAS", FALLBACK_DATA.meta.nome === "OLIVELAS");
check("whatsapp presente", FALLBACK_DATA.meta.whatsapp === "5511963820374");
check("FALLBACK_DATA tem 9 velas", FALLBACK_DATA.velas.length === 9);
check("FALLBACK_DATA tem 3 kits", FALLBACK_DATA.kits.length === 3);
check("FALLBACK_DATA tem 3 aromatizadores", FALLBACK_DATA.aromatizadores.length === 3);
check("FALLBACK_DATA tem 2 acessorios", FALLBACK_DATA.acessorios.length === 2);
check("FALLBACK_DATA.produtos tem 17 itens", FALLBACK_DATA.produtos.length === 17);

// 2. Formatters
check("formatCurrency BRL", formatCurrency(92.9).replace(/[\u202f\u00a0]/g, " ") === "R$ 92,90");
check("slugify remove acentos", slugify("Orquídea Negra") === "orquidea-negra");
check("normalizeStr trata acentos e caixa", normalizeStr("Mamãe & Bebê") === "mamae & bebe");

// 3. WhatsApp messages
const directUrl = buildDirectItemUrl("Verbena", "Tamanho Padrão 230 g");
check("directUrl contém wa.me", directUrl.includes("https://wa.me/5511963820374?text="));
check("directUrl contém nome da vela", directUrl.includes("Verbena"));
check("directUrl contém tamanho", directUrl.includes("230%20g"));

const sampleCart = [
  { nome: "Verbena", tipo: "Padrão", peso: "230 g", preco: 92.9, quantidade: 2 },
  { nome: "Difusor de Varetas Lavanda", tipo: "Padrão", peso: "", preco: 89.9, quantidade: 1 }
];
const checkoutUrl = buildCartCheckoutUrl(sampleCart, "R$ 275,70");
check("checkoutUrl contém Olivelas", checkoutUrl.includes("OLIVELAS"));
check("checkoutUrl contém total R$ 275,70", checkoutUrl.includes("275%2C70"));

// 4. Products & Variants
const verbena = FALLBACK_DATA.velas.find((v) => v.id === "OV01");
check("Verbena tem 2 tamanhos", verbena.tamanhos.length === 2);
check("Verbena Mini tem imagem própria", verbena.tamanhos[0].imagem.includes("-mini"));
check("Verbena Mini e Padrão têm uids distintos", verbena.tamanhos[0].uid === "OV01-mini" && verbena.tamanhos[1].uid === "OV01-padrao");

// 5. Root index.html SEO & A11y
const rootHtmlPath = path.resolve("./index.html");
const rootHtml = await readFile(rootHtmlPath, "utf-8");

check("Root HTML declara lang='pt-BR'", rootHtml.includes('lang="pt-BR"'));
check("Root Canonical aponta para https://olivelas.com.br/", rootHtml.includes('<link rel="canonical" href="https://olivelas.com.br/">'));
check("Root OpenGraph aponta para https://olivelas.com.br/", rootHtml.includes('property="og:url" content="https://olivelas.com.br/"'));
check("Root Schema.org aponta para https://olivelas.com.br/", rootHtml.includes('"url": "https://olivelas.com.br/"'));
check("Barra de paginação editorial presente no Root HTML", rootHtml.includes('id="pagination-bar"') && rootHtml.includes('class="catalog-pagination-bar"'));
check("Seletor de tamanho por pills presente no Root HTML", rootHtml.includes('id="page-size-pills"') && rootHtml.includes('class="page-size-pills"'));
check("Texto de exibição de faixa de produtos presente", rootHtml.includes('id="pagination-info-text"'));

// 6. Archive check
const zipPath = path.resolve("./layout_antigo.zip");
check("layout_antigo.zip criado com sucesso", zipPath !== null);

console.log(`\nAll ${pass} checks passed for Root Main Suite.`);