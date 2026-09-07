/* WhatsApp: monta mensagens e links wa.me a partir do número e dos dados do JSON. */

import { formatCurrency } from "./utils.js";

export const waLink = (numero, texto) => {
  const n = String(numero || "").replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(texto)}`;
};

export const mensagemGeral = (meta) =>
  [
    "Olá!",
    `Cheguei pelo catálogo da ${meta.nome || "loja"}.`,
    "Gostaria de mais informações sobre os produtos.",
  ].join("\n");

export const mensagemProduto = (item) =>
  [
    "Olá!",
    "Tenho interesse no seguinte produto:",
    "",
    `Nome: ${item.nome}`,
    `Código: ${item.id}`,
    item.tamanho && item.tamanho !== "Único" ? `Tamanho: ${item.tamanho}` : null,
    `Peso: ${item.peso}`,
    `Preço: ${formatCurrency(item.preco)}`,
    `Quantidade por pacote: ${item.quantidade}`,
    "",
    "Gostaria de mais informações.",
  ]
    .filter(Boolean)
    .join("\n");

export const mensagemPedido = (linhas, total, meta) => {
  const corpo = linhas.map(
    (l) => `• ${l.nome}${l.tamanho && l.tamanho !== "Único" ? ` (${l.tamanho})` : ""} — Quantidade: ${l.qtd} — ${formatCurrency(l.subtotal)}`
  );
  return [
    "Olá!",
    `Gostaria de realizar o seguinte pedido${meta?.nome ? ` (${meta.nome})` : ""}:`,
    "",
    ...corpo,
    "",
    `Total estimado: ${formatCurrency(total)}`,
    "",
    "Aguardo confirmação. Obrigado!",
  ].join("\n");
};