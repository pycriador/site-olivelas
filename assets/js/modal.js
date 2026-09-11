/**
 * OLIVELAS — Product Modal & Variant Selector (/novo)
 */

import { bus, $, $$, formatCurrency, showToast } from './utils.js';
import { cart } from './cart.js';
import { FALLBACK_DATA } from './data.js';
import { buildDirectItemUrl } from './whatsapp.js';

class ProductModal {
  constructor() {
    this.currentProduct = null;
    this.selectedVariant = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkHash();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const openModalBtn = e.target.closest('[data-action="open-modal"]');
      if (openModalBtn) {
        e.preventDefault();
        const id = openModalBtn.dataset.id;
        this.open(id);
      }

      const closeModalBtn = e.target.closest('[data-action="close-modal"]');
      if (closeModalBtn || (e.target.classList && e.target.classList.contains('modal-backdrop'))) {
        e.preventDefault();
        this.close();
      }

      const variantBtn = e.target.closest('[data-action="select-modal-variant"]');
      if (variantBtn) {
        e.preventDefault();
        const index = Number(variantBtn.dataset.index);
        this.selectVariant(index);
      }

      const addCartBtn = e.target.closest('[data-action="modal-add-cart"]');
      if (addCartBtn) {
        e.preventDefault();
        this.addToCart();
      }
    });

    window.addEventListener('hashchange', () => this.checkHash());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  checkHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#produto-')) {
      const id = hash.replace('#produto-', '');
      this.open(id, false);
    }
  }

  open(id, updateHash = true) {
    const appProducts = window.__olivelasApp?.data?.produtos;
    const allCandles = FALLBACK_DATA.velas || [];
    const allComp = FALLBACK_DATA.complementos || [];
    const fallbackList = FALLBACK_DATA.produtos || [...allCandles, ...allComp];
    const productList = appProducts || fallbackList;
    const product = productList.find((p) => p.id === id);

    if (!product) return;

    this.currentProduct = product;
    const defaultIndex = product.tamanhos && product.tamanhos.length > 1 ? 1 : 0;
    this.selectedVariant = product.tamanhos ? (product.tamanhos[defaultIndex] || product.tamanhos[0]) : null;

    if (updateHash) {
      window.history.replaceState(null, '', `#produto-${id}`);
    }

    this.render();

    const backdrop = $('#product-modal');
    if (backdrop) {
      backdrop.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    const backdrop = $('#product-modal');
    if (backdrop) {
      backdrop.classList.remove('is-open');
      document.body.style.overflow = '';
      if (window.location.hash.startsWith('#produto-')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }

  selectVariant(index) {
    if (!this.currentProduct || !this.currentProduct.tamanhos) return;
    this.selectedVariant = this.currentProduct.tamanhos[index];
    this.render();
  }

  addToCart() {
    if (!this.currentProduct) return;

    const isUnavailable = Boolean(
      this.currentProduct.esgotado ||
      this.currentProduct.emBreve ||
      (this.currentProduct.badge && (
        this.currentProduct.badge.toLowerCase().includes('breve') ||
        this.currentProduct.badge.toLowerCase().includes('esgotado')
      ))
    );

    if (isUnavailable) {
      showToast(`"${this.currentProduct.nome}" não está disponível para compra no momento.`);
      return;
    }

    if (this.selectedVariant) {
      cart.addItem({
        uid: this.selectedVariant.uid,
        id: this.currentProduct.id,
        nome: this.currentProduct.nome,
        tipo: this.selectedVariant.tipo,
        peso: this.selectedVariant.peso,
        preco: this.selectedVariant.preco,
        imagem: this.selectedVariant.imagem || this.currentProduct.imagem,
        quantidade: 1
      });
    } else {
      cart.addItem({
        uid: this.currentProduct.uid || `${this.currentProduct.id}-padrao`,
        id: this.currentProduct.id,
        nome: this.currentProduct.nome,
        tipo: 'Padrão',
        peso: '',
        preco: this.currentProduct.preco,
        imagem: this.currentProduct.imagem,
        quantidade: 1
      });
    }
  }

  render() {
    const card = $('#product-modal-content');
    if (!card || !this.currentProduct) return;

    const p = this.currentProduct;
    const isCandle = !!(p.tamanhos && p.tamanhos.length > 0);
    const v = this.selectedVariant || p;
    const img = v.imagemFull || v.imagem || p.imagemFull || p.imagem;
    const priceFormatted = formatCurrency(v.preco);
    const isEsgotado = Boolean(p.esgotado || (p.badge && p.badge.toLowerCase().includes('esgotado')));
    const isEmBreve = Boolean(p.emBreve || (p.badge && p.badge.toLowerCase().includes('breve')));
    const notifyWaUrl = `https://wa.me/5511963820374?text=Ol%C3%A1!%20Gostaria%20de%20ser%20avisado(a)%20quando%20o%20${encodeURIComponent(p.nome)}%20estiver%20dispon%C3%ADvel.`;
    const esgotadoWaUrl = `https://wa.me/5511963820374?text=Ol%C3%A1!%20Gostaria%20de%20saber%20a%20previs%C3%A3o%20de%20reposi%C3%A7%C3%A3o%20do%20produto%20${encodeURIComponent(p.nome)}.`;

    const waUrl = isEmBreve
      ? notifyWaUrl
      : (isEsgotado
        ? esgotadoWaUrl
        : (isCandle
          ? buildDirectItemUrl(p.nome, `Tamanho ${v.tipo} ${v.peso || ''}`.trim())
          : buildDirectItemUrl(p.nome)));

    let variantsHtml = '';
    if (isCandle && p.tamanhos.length > 1) {
      variantsHtml = `
        <div>
          <span style="font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-mute); display:block; margin-bottom:6px;">Escolha o Tamanho</span>
          <div class="modal-variants-pill-group">
            ${p.tamanhos.map((t, idx) => `
              <button type="button" class="modal-variant-btn ${this.selectedVariant && this.selectedVariant.tipo === t.tipo ? 'is-active' : ''}" data-action="select-modal-variant" data-index="${idx}">
                <span>${t.tipo}${t.peso ? ` · ${t.peso}` : ''}</span>
                <strong>${formatCurrency(t.preco)}</strong>
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    let specsHtml = '';
    if (isCandle && p.categoria === 'velas') {
      specsHtml = `
        <div class="modal-specs-list">
          <div class="modal-spec-item">
            <span>Tempo de Queima</span>
            <strong>${v.queima || '≈ 50 h'}</strong>
          </div>
          <div class="modal-spec-item">
            <span>Cera & Pavio</span>
            <strong>100% Vegetal · Algodão</strong>
          </div>
          <div class="modal-spec-item">
            <span>Código</span>
            <strong>${p.codigo || p.id}</strong>
          </div>
          <div class="modal-spec-item">
            <span>Acabamento</span>
            <strong>${v.tipo === 'Padrão' ? 'Tampa Dourada OV' : 'Vidro Âmbar Mini'}</strong>
          </div>
        </div>
      `;
    } else if (p.categoria === 'kits') {
      specsHtml = `
        <div class="modal-specs-list">
          <div class="modal-spec-item">
            <span>Tempo de Queima</span>
            <strong>${v.queima || 'Artesanal'}</strong>
          </div>
          <div class="modal-spec-item">
            <span>Conteúdo</span>
            <strong>${v.peso || 'Mini Velas'}</strong>
          </div>
          <div class="modal-spec-item">
            <span>Código</span>
            <strong>${p.codigo || p.id}</strong>
          </div>
          <div class="modal-spec-item">
            <span>Apresentação</span>
            <strong>Embalagem Especial</strong>
          </div>
        </div>
      `;
    }

    const modalImgAlt = `Fragrância ${p.nome} — ${p.familia || 'Coleção Olivelas'}`;

    card.innerHTML = `
      <button type="button" class="modal-close-btn" data-action="close-modal" aria-label="Fechar janela de detalhes do produto">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="modal-gallery">
        <img src="${img}" alt="${modalImgAlt}" loading="lazy" width="480" height="480">
      </div>
      <div class="modal-info">
        <div>
          <span class="eyebrow">${p.familia || 'Linhas Complementares'}</span>
          <h2 class="display" id="modal-product-title" style="margin-top:4px;">${p.nome}</h2>
        </div>
        <p class="desc">${p.descricao || p.nota || ''}</p>
        
        ${specsHtml}
        ${variantsHtml}

        <div style="margin-top:8px; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; align-items:baseline; justify-content:space-between;">
            <span style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--text-mute);">Preço</span>
            <strong style="font-family:var(--serif); font-size:1.6rem; color:var(--text-main);" aria-label="Preço: ${priceFormatted}">${priceFormatted}</strong>
          </div>
          
          <div style="display:flex; gap:10px; margin-top:4px;">
            ${isEmBreve ? `
              <a href="${notifyWaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--gold" style="flex:1; text-align:center;" aria-label="Receber aviso no WhatsApp quando ${p.nome} estiver disponível">
                Avise-me no WhatsApp
              </a>
            ` : (isEsgotado ? `
              <a href="${esgotadoWaUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--gold" style="flex:1; text-align:center;" aria-label="Consultar previsão de reposição de ${p.nome} no WhatsApp">
                Consultar Reposição
              </a>
            ` : `
              <button type="button" class="btn btn--gold" data-action="modal-add-cart" style="flex:1;" aria-label="Adicionar ${p.nome} (${v.tipo || 'Padrão'}) ao carrinho">
                Adicionar ao Carrinho
              </button>
            `)}
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn--ghost" style="padding-inline:16px;" aria-label="${isEmBreve ? 'Consultar ' + p.nome + ' no WhatsApp' : (isEsgotado ? 'Consultar reposição de ' + p.nome + ' no WhatsApp' : 'Fazer pedido de ' + p.nome + ' no WhatsApp')}">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.02A9.82 9.82 0 0 0 12.04 2Zm5.83 14.12c-.25.7-1.45 1.33-2 1.38-.51.05-1.16.07-1.87-.12-.43-.11-.99-.32-1.7-.63-3.01-1.3-4.97-4.32-5.12-4.52-.15-.2-1.22-1.62-1.22-3.1 0-1.47.77-2.19 1.05-2.49.27-.3.6-.37.8-.37h.57c.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.33.03.53-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03.1.09.19.14.29.19.1.05.23.06.32-.04.1-.11.42-.49.53-.66.11-.17.23-.14.39-.08.15.05.98.46 1.15.55.17.08.28.12.32.2.05.06.05.37-.11.78Z"/></svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

export const productModal = new ProductModal();
