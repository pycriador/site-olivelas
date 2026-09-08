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
check("FALLBACK_DATA tem 5 complementos", FALLBACK_DATA.complementos.length === 5);
check("WhatsApp correto", WA_PHONE === "5511963820374");

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

console.log(`\nAll ${pass} checks passed for /novo!`);
