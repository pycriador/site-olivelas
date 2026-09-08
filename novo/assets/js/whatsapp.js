/**
 * OLIVELAS — WhatsApp Message & Gateway Handler (/novo)
 */

export const WA_PHONE = '5511963820374';

export function buildDirectItemUrl(itemTitle, variantInfo = '') {
  let text = `Olá! Quero pedir a vela *${itemTitle}*`;
  if (variantInfo) {
    text += ` (${variantInfo})`;
  }
  text += ` da Olivelas.`;
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}

export function buildCartCheckoutUrl(cartItems, totalPriceFormatted) {
  if (!cartItems || cartItems.length === 0) {
    return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Olá! Vim pelo site da Olivelas.')}`;
  }

  const lines = [
    '🌿 *OLIVELAS — Novo Pedido pelo Catálogo*',
    '----------------------------------------',
    ''
  ];

  cartItems.forEach((item, index) => {
    const itemSubtotal = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(item.preco * item.quantidade);

    lines.push(`${index + 1}. *${item.nome}* (${item.tipo}${item.peso ? ' · ' + item.peso : ''})`);
    lines.push(`   Qtd: ${item.quantidade} × ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco)} = *${itemSubtotal}*`);
    lines.push('');
  });

  lines.push('----------------------------------------');
  lines.push(`💰 *Total Estimado:* ${totalPriceFormatted}`);
  lines.push('');
  lines.push('Por favor, confirme a disponibilidade e o valor do frete para o meu CEP.');

  const fullText = lines.join('\n');
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(fullText)}`;
}

export function buildGeneralContactUrl() {
  const text = 'Oi! Vim pelo site da Olivelas e gostaria de tirar uma dúvida.';
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
}
