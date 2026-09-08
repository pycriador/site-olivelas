/**
 * OLIVELAS — Cart Drawer & State Manager (/novo)
 */

import { bus, $, $$, formatCurrency, getStorage, setStorage, showToast } from './utils.js';
import { buildCartCheckoutUrl } from './whatsapp.js';

const CART_KEY = 'olivelas:novo:cart';

class CartManager {
  constructor() {
    this.items = getStorage(CART_KEY, {});
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    // Open cart drawer
    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('[data-action="open-cart"]');
      if (openBtn) {
        e.preventDefault();
        this.openDrawer();
      }

      const closeBtn = e.target.closest('[data-action="close-cart"]');
      if (closeBtn || (e.target.classList && e.target.classList.contains('drawer-overlay'))) {
        e.preventDefault();
        this.closeDrawer();
      }

      const clearBtn = e.target.closest('[data-action="clear-cart"]');
      if (clearBtn) {
        e.preventDefault();
        this.clear();
      }

      const checkoutBtn = e.target.closest('[data-action="checkout-cart"]');
      if (checkoutBtn) {
        e.preventDefault();
        this.checkoutWhatsApp();
      }
    });

    // Delegated stepper and removal
    const drawer = $('#cart-drawer');
    if (drawer) {
      drawer.addEventListener('click', (e) => {
        const incBtn = e.target.closest('[data-action="cart-inc"]');
        if (incBtn) {
          const uid = incBtn.dataset.uid;
          this.changeQuantity(uid, 1);
        }

        const decBtn = e.target.closest('[data-action="cart-dec"]');
        if (decBtn) {
          const uid = decBtn.dataset.uid;
          this.changeQuantity(uid, -1);
        }

        const removeBtn = e.target.closest('[data-action="cart-remove"]');
        if (removeBtn) {
          const uid = removeBtn.dataset.uid;
          this.removeItem(uid);
        }
      });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeDrawer();
    });
  }

  openDrawer() {
    const drawer = $('#cart-drawer');
    const overlay = $('#cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    const drawer = $('#cart-drawer');
    const overlay = $('#cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  addItem(item) {
    if (!item || !item.uid) return;

    if (item.esgotado || item.emBreve || (item.badge && (item.badge.toLowerCase().includes('breve') || item.badge.toLowerCase().includes('esgotado')))) {
      showToast(`"${item.nome}" não está disponível para compra no momento.`);
      return;
    }
    
    if (this.items[item.uid]) {
      this.items[item.uid].quantidade += item.quantidade || 1;
    } else {
      this.items[item.uid] = {
        uid: item.uid,
        id: item.id,
        nome: item.nome,
        tipo: item.tipo || 'Padrão',
        peso: item.peso || '',
        preco: Number(item.preco) || 0,
        imagem: item.imagem || '../assets/images/placeholder.webp',
        quantidade: item.quantidade || 1
      };
    }

    this.save();
    showToast(`"${item.nome} (${item.tipo})" adicionado ao carrinho!`);
    bus.emit('cart:updated', this.items);
  }

  changeQuantity(uid, delta) {
    if (!this.items[uid]) return;
    this.items[uid].quantidade += delta;
    if (this.items[uid].quantidade <= 0) {
      delete this.items[uid];
    }
    this.save();
    bus.emit('cart:updated', this.items);
  }

  removeItem(uid) {
    if (this.items[uid]) {
      const item = this.items[uid];
      delete this.items[uid];
      this.save();
      showToast(`Item removido do carrinho.`);
      bus.emit('cart:updated', this.items);
    }
  }

  clear() {
    this.items = {};
    this.save();
    showToast('Carrinho limpo.');
    bus.emit('cart:updated', this.items);
  }

  save() {
    setStorage(CART_KEY, this.items);
    this.updateUI();
  }

  getCount() {
    return Object.values(this.items).reduce((acc, curr) => acc + (curr.quantidade || 0), 0);
  }

  getTotalPrice() {
    return Object.values(this.items).reduce((acc, curr) => acc + (curr.preco * curr.quantidade), 0);
  }

  updateUI() {
    const count = this.getCount();
    const countBadges = $$('.cart-count-badge');
    countBadges.forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    const itemsContainer = $('#cart-items-list');
    const footerContainer = $('#cart-drawer-footer');
    const totalEl = $('#cart-total-value');

    if (!itemsContainer) return;

    const list = Object.values(this.items);

    if (list.length === 0) {
      itemsContainer.innerHTML = `
        <div class="empty-drawer-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L23 6.05H5.12"></path>
          </svg>
          <p>Seu carrinho está vazio</p>
          <small>Explore nossa coleção e escolha seus aromas favoritos.</small>
        </div>
      `;
      if (footerContainer) footerContainer.style.display = 'none';
      return;
    }

    if (footerContainer) footerContainer.style.display = 'flex';

    itemsContainer.innerHTML = list.map((item) => `
      <div class="cart-item" data-uid="${item.uid}">
        <div class="cart-item-img">
          <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <h4>${item.nome}</h4>
          <p class="cart-item-variant">${item.tipo} ${item.peso ? '· ' + item.peso : ''}</p>
          <span class="cart-item-price">${formatCurrency(item.preco)}</span>
        </div>
        <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
          <button class="cart-item-remove" data-action="cart-remove" data-uid="${item.uid}" aria-label="Remover item">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
          <div class="cart-stepper">
            <button type="button" data-action="cart-dec" data-uid="${item.uid}" aria-label="Diminuir">-</button>
            <span>${item.quantidade}</span>
            <button type="button" data-action="cart-inc" data-uid="${item.uid}" aria-label="Aumentar">+</button>
          </div>
        </div>
      </div>
    `).join('');

    if (totalEl) {
      totalEl.textContent = formatCurrency(this.getTotalPrice());
    }
  }

  checkoutWhatsApp() {
    const list = Object.values(this.items);
    if (list.length === 0) return;
    const url = buildCartCheckoutUrl(list, formatCurrency(this.getTotalPrice()));
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export const cart = new CartManager();
