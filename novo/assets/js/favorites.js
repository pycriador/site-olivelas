/**
 * OLIVELAS — Favorites Manager & Drawer (/novo)
 */

import { bus, $, $$, formatCurrency, getStorage, setStorage, showToast } from './utils.js';
import { cart } from './cart.js';
import { FALLBACK_DATA } from './data.js';

const FAVS_KEY = 'olivelas:novo:favs';

class FavoritesManager {
  constructor() {
    this.favs = new Set(getStorage(FAVS_KEY, []));
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const favBtn = e.target.closest('[data-action="toggle-fav"]');
      if (favBtn) {
        e.preventDefault();
        const id = favBtn.dataset.id;
        const name = favBtn.dataset.name || 'Produto';
        this.toggle(id, name);
      }

      const openFavs = e.target.closest('[data-action="open-favs"]');
      if (openFavs) {
        e.preventDefault();
        this.openDrawer();
      }

      const closeFavs = e.target.closest('[data-action="close-favs"]');
      if (closeFavs) {
        e.preventDefault();
        this.closeDrawer();
      }

      const addFavToCart = e.target.closest('[data-action="fav-add-cart"]');
      if (addFavToCart) {
        e.preventDefault();
        const id = addFavToCart.dataset.id;
        this.addFavoriteToCart(id);
      }
    });

    bus.on('favs:updated', () => this.updateUI());
  }

  isFavorite(id) {
    return this.favs.has(id);
  }

  toggle(id, name = 'Produto') {
    if (!id) return;
    if (this.favs.has(id)) {
      this.favs.delete(id);
      showToast(`"${name}" removido dos favoritos.`);
    } else {
      this.favs.add(id);
      showToast(`"${name}" adicionado aos favoritos!`);
    }
    this.save();
  }

  save() {
    setStorage(FAVS_KEY, Array.from(this.favs));
    this.updateUI();
    bus.emit('favs:updated', this.favs);
  }

  openDrawer() {
    const drawer = $('#favs-drawer');
    const overlay = $('#favs-overlay');
    if (drawer && overlay) {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      this.renderDrawer();
    }
  }

  closeDrawer() {
    const drawer = $('#favs-drawer');
    const overlay = $('#favs-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  updateUI() {
    const count = this.favs.size;
    const badges = $$('.fav-count-badge');
    badges.forEach((el) => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update heart buttons on cards
    $$('[data-action="toggle-fav"]').forEach((btn) => {
      const id = btn.dataset.id;
      if (this.favs.has(id)) {
        btn.classList.add('is-fav');
        btn.setAttribute('aria-label', 'Remover dos favoritos');
      } else {
        btn.classList.remove('is-fav');
        btn.setAttribute('aria-label', 'Adicionar aos favoritos');
      }
    });
  }

  renderDrawer() {
    const container = $('#favs-items-list');
    if (!container) return;

    if (this.favs.size === 0) {
      container.innerHTML = `
        <div class="empty-drawer-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
          <p>Sua lista de favoritos está vazia</p>
          <small>Clique no ícone de coração nos produtos para salvá-los aqui.</small>
        </div>
      `;
      return;
    }

    const allCandles = FALLBACK_DATA.velas || [];
    const allComp = FALLBACK_DATA.complementos || [];
    const allItems = [...allCandles, ...allComp];

    const favItems = allItems.filter((i) => this.favs.has(i.id));

    container.innerHTML = favItems.map((item) => {
      const isCandle = !!item.tamanhos;
      const defaultVar = isCandle ? item.tamanhos[1] : item;
      const priceFormatted = formatCurrency(defaultVar.preco);

      return `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-img">
            <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
          </div>
          <div class="cart-item-info">
            <h4>${item.nome}</h4>
            <p class="cart-item-variant">${item.familia || 'Coleção Olivelas'}</p>
            <span class="cart-item-price">${priceFormatted}</span>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:6px;">
            <button class="cart-item-remove" data-action="toggle-fav" data-id="${item.id}" data-name="${item.nome}" aria-label="Remover">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <button type="button" class="btn btn-sm btn--gold" data-action="fav-add-cart" data-id="${item.id}" style="padding: 6px 12px; font-size: 9.5px;">
              + Carrinho
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  addFavoriteToCart(id) {
    const allCandles = FALLBACK_DATA.velas || [];
    const allComp = FALLBACK_DATA.complementos || [];
    const item = [...allCandles, ...allComp].find((i) => i.id === id);

    if (!item) return;

    if (item.tamanhos) {
      const padrao = item.tamanhos[1] || item.tamanhos[0];
      cart.addItem({
        uid: padrao.uid,
        id: item.id,
        nome: item.nome,
        tipo: padrao.tipo,
        peso: padrao.peso,
        preco: padrao.preco,
        imagem: padrao.imagem,
        quantidade: 1
      });
    } else {
      cart.addItem({
        uid: item.uid,
        id: item.id,
        nome: item.nome,
        tipo: 'Padrão',
        peso: '',
        preco: item.preco,
        imagem: item.imagem,
        quantidade: 1
      });
    }
  }
}

export const favorites = new FavoritesManager();
