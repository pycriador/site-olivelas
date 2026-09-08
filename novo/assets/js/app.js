/**
 * OLIVELAS — Main Application Orchestrator (/novo)
 * Totalmente orientado a dados do produtos.json
 */

import { bus, $, $$, formatCurrency, normalizeStr, getStorage, setStorage, showToast } from './utils.js';
import { loadCatalog, FALLBACK_DATA } from './data.js';
import { cart } from './cart.js';
import { favorites } from './favorites.js';
import { productModal } from './modal.js';
import { buildDirectItemUrl, buildGeneralContactUrl } from './whatsapp.js';

class App {
  constructor() {
    this.data = FALLBACK_DATA;
    this.activeCategory = 'todos';
    this.searchQuery = '';
    this.selectedVariants = new Map(); // id -> variant index
    this.init();
  }

  async init() {
    this.initTheme();
    this.bindGlobalEvents();
    
    this.data = await loadCatalog();
    this.renderPageTexts();
    this.renderHomeFeatured();
    this.renderCatalog();
    this.renderComplementos();
    this.renderAtelieRandomPhoto();
    favorites.updateUI();
    cart.updateUI();
  }

  initTheme() {
    const savedTheme = getStorage('olivelas:novo:theme', 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);

    document.addEventListener('click', (e) => {
      const toggleBtn = e.target.closest('[data-action="toggle-theme"]');
      if (toggleBtn) {
        e.preventDefault();
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        setStorage('olivelas:novo:theme', next);
        this.updateThemeButton(next);
        showToast(`Tema ${next === 'dark' ? 'escuro' : 'claro'} ativado.`);
      }
    });
  }

  updateThemeButton(theme) {
    const btn = $('[data-action="toggle-theme"]');
    if (btn) {
      btn.setAttribute('aria-label', `Alternar tema (atual: ${theme})`);
      btn.innerHTML = theme === 'dark'
        ? `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`
        : `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
  }

  renderPageTexts() {
    // 1. Hero Texts
    const h = this.data.heroConfig || {};
    if (h.eyebrow && $('#hero-eyebrow')) $('#hero-eyebrow').textContent = h.eyebrow;
    if (h.chamadaPrincipal && $('#hero-title')) $('#hero-title').textContent = h.chamadaPrincipal;
    if (h.descricao && $('#hero-lead')) $('#hero-lead').textContent = h.descricao;
    if (h.prelaunch && $('#hero-prelaunch')) $('#hero-prelaunch').textContent = h.prelaunch;
    if (h.botaoColecao && $('#hero-cta-colecao')) $('#hero-cta-colecao').textContent = h.botaoColecao;
    if (h.botaoPedido && $('#hero-cta-pedido')) $('#hero-cta-pedido').textContent = h.botaoPedido;

    // 2. Pilares / Benefícios
    const pilares = this.data.pilares;
    const pilaresContainer = $('#benefits-grid');
    if (pilaresContainer && Array.isArray(pilares) && pilares.length > 0) {
      pilaresContainer.innerHTML = pilares.map((p) => `
        <div class="benefit-item">
          <div class="benefit-icon" aria-hidden="true">
            ${this.getIconSvg(p.icone)}
          </div>
          <div>
            <strong>${p.titulo}</strong>
            <span>${p.descricao}</span>
          </div>
        </div>
      `).join('');
    }

    // 3. Coleção Config
    const c = this.data.colecaoConfig || {};
    if (c.eyebrow && $('#colecao-eyebrow')) $('#colecao-eyebrow').textContent = c.eyebrow;
    if (c.titulo && $('#colecao-title')) $('#colecao-title').textContent = c.titulo;
    if (c.subtitulo && $('#colecao-lead')) $('#colecao-lead').innerHTML = c.subtitulo;
    if (c.notaCatalogo && $('#colecao-note')) $('#colecao-note').textContent = c.notaCatalogo;
    if (c.fineprint && $('#colecao-fineprint')) $('#colecao-fineprint').textContent = c.fineprint;

    // Render Filter Pills dynamically
    const navPills = $('#category-nav-pills');
    if (navPills && c.colecoesDisponiveis && c.colecoesDisponiveis.length > 0) {
      navPills.innerHTML = c.colecoesDisponiveis.map((col, idx) => `
        <button type="button" class="cat-pill ${idx === 0 ? 'is-active' : ''}" data-category="${col.filtro}">
          ${col.nome}
        </button>
      `).join('');
    }

    // 4. Complementos Config
    const comp = this.data.complementosConfig || {};
    if (comp.eyebrow && $('#compl-eyebrow')) $('#compl-eyebrow').textContent = comp.eyebrow;
    if (comp.titulo && $('#compl-title')) $('#compl-title').textContent = comp.titulo;
    if (comp.subtitulo && $('#compl-lead')) $('#compl-lead').textContent = comp.subtitulo;

    // 5. O Ateliê Config
    const at = this.data.atelie || {};
    if (at.eyebrow && $('#atelie-eyebrow')) $('#atelie-eyebrow').textContent = at.eyebrow;
    if (at.titulo && $('#atelie-title')) $('#atelie-title').textContent = at.titulo;
    if (at.descricao && $('#atelie-lead')) $('#atelie-lead').textContent = at.descricao;
    if (at.especificacoes && $('#atelie-spec')) $('#atelie-spec').textContent = at.especificacoes;
    if (at.tagline && $('#atelie-tagline')) $('#atelie-tagline').textContent = at.tagline;

    // 6. Como Pedir Config
    const cp = this.data.comoPedir || {};
    if (cp.eyebrow && $('#pedir-eyebrow')) $('#pedir-eyebrow').textContent = cp.eyebrow;
    if (cp.titulo && $('#pedir-title')) $('#pedir-title').textContent = cp.titulo;
    if (cp.subtitulo && $('#pedir-lead')) $('#pedir-lead').textContent = cp.subtitulo;
    if (cp.botaoWhatsApp && $('#pedir-btn-wa')) $('#pedir-btn-wa').textContent = cp.botaoWhatsApp;
    if (cp.botaoInstagram && $('#pedir-btn-insta')) $('#pedir-btn-insta').textContent = cp.botaoInstagram;
    if (cp.fineprint && $('#pedir-fineprint')) $('#pedir-fineprint').textContent = cp.fineprint;

    const pedirLines = $('#pedir-lines');
    if (pedirLines && cp.linhas && cp.linhas.length > 0) {
      pedirLines.innerHTML = cp.linhas.map((l) => `
        <div class="row">
          <h3>${l.titulo}</h3>
          <p>${l.descricao}</p>
        </div>
      `).join('');
    }
  }

  renderHomeFeatured() {
    const container = $('#home-featured');
    if (!container) return;

    const sections = this.data.homeFeatured || [];
    if (sections.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = sections.map((sec) => {
      const items = this.getItemsForFeaturedSection(sec);
      if (items.length === 0) return '';

      return `
        <section class="featured-section" id="featured-${sec.id}" aria-labelledby="featured-${sec.id}-title">
          <div class="featured-head">
            <div class="featured-head-titles">
              <span class="eyebrow">${sec.eyebrow}</span>
              <h3 id="featured-${sec.id}-title">${sec.titulo}</h3>
            </div>
            <a class="featured-see-all" href="#colecao" data-action="filter-featured" data-filter="${sec.tag}">
              Ver todos <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <div class="home-product-rail">
            ${items.map((item) => this.renderHomeProductCard(item)).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  getItemsForFeaturedSection(section) {
    const all = this.data.produtos || [];
    const tag = normalizeStr(section.tag || section.id);

    let matches = all.filter(p => Array.isArray(p.tags) && p.tags.map(t => normalizeStr(t)).includes(tag));

    if (matches.length === 0) {
      if (tag === 'novidades') {
        matches = all.filter(p => ['novo', 'premium', 'lembrancinhas', 'eventos'].includes(normalizeStr(p.badge || '')) || p.slug === 'morango-champanhe' || (p.id && p.id.startsWith('KIT')));
      } else if (tag === 'mais-vendidos') {
        matches = all.filter(p => ['mais vendido', 'assinatura', 'relaxante', 'presenteavel'].includes(normalizeStr(p.badge || '')) || p.id === 'OV01' || p.id === 'OV04' || p.id === 'OV08');
      } else if (tag === 'rituais') {
        matches = all.filter(p => p.categoria === 'aromatizadores' || p.categoria === 'acessorios');
      }
    }

    const unique = [...new Map(matches.map(i => [i.id, i])).values()];
    return unique.slice(0, 4);
  }

  renderHomeProductCard(item) {
    const isFav = favorites.isFavorite(item.id);
    const defaultIndex = item.tamanhos && item.tamanhos.length > 1 ? 1 : 0;
    const v = (item.tamanhos && item.tamanhos[defaultIndex]) || (item.tamanhos && item.tamanhos[0]) || {
      tipo: 'Padrão',
      peso: '',
      preco: item.preco || 0,
      imagem: item.imagem
    };
    const isEmBreve = Boolean(item.emBreve || (item.badge && item.badge.toLowerCase().includes('breve')));
    const isEsgotado = Boolean(item.esgotado || (item.badge && item.badge.toLowerCase().includes('esgotado')));
    const notifyWaUrl = `https://wa.me/5511963820374?text=Ol%C3%A1!%20Gostaria%20de%20ser%20avisado(a)%20quando%20o%20${encodeURIComponent(item.nome)}%20estiver%20dispon%C3%ADvel.`;
    const esgotadoWaUrl = `https://wa.me/5511963820374?text=Ol%C3%A1!%20Gostaria%20de%20saber%20a%20previs%C3%A3o%20de%20reposi%C3%A7%C3%A3o%20do%20produto%20${encodeURIComponent(item.nome)}.`;
    const priceDisplay = v.preco ? formatCurrency(v.preco) : '';

    return `
      <article class="home-product-card" style="--product-accent: ${item.cor || 'var(--gold)'};" data-card-id="${item.id}">
        <div class="home-product-media" data-action="open-modal" data-id="${item.id}" title="Ver detalhes de ${item.nome}">
          ${item.badge ? `<span class="badge-chip">${item.badge}</span>` : ''}
          <img src="${v.imagem || item.imagem}" alt="${item.nome}" loading="lazy">
          <button type="button" class="card-fav ${isFav ? 'is-fav' : ''}" data-action="toggle-fav" data-id="${item.id}" data-name="${item.nome}" aria-label="Favoritar ${item.nome}">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </button>
        </div>

        <div class="home-product-body">
          <div class="card-family-row">
            ${item.cor ? `<span class="card-color-dot" style="background:${item.hexCor || item.cor}"></span>` : ''}
            <span>${item.familia || item.categoria}</span>
          </div>
          <button type="button" class="home-product-name" data-action="open-modal" data-id="${item.id}">
            ${item.nome}
          </button>
          <strong class="price">${priceDisplay}</strong>
          ${isEmBreve ? `
            <a class="btn btn-sm btn--gold btn-block" href="${notifyWaUrl}" target="_blank" rel="noopener" style="text-align:center;">
              Avise-me
            </a>
          ` : (isEsgotado ? `
            <a class="btn btn-sm btn--gold btn-block" href="${esgotadoWaUrl}" target="_blank" rel="noopener" style="text-align:center;">
              Consultar Reposição
            </a>
          ` : `
            <button type="button" class="btn btn-sm btn--gold btn-block" data-action="card-add-cart" data-id="${item.id}">
              + Carrinho
            </button>
          `)}
        </div>
      </article>
    `;
  }

  renderAtelieRandomPhoto() {
    const at = this.data.atelie || {};
    const imgEl = $('#atelie-random-photo');
    if (!imgEl) return;

    let images = at.imagensAleatorias;
    if (!images || images.length === 0) {
      images = (this.data.velas || []).map(v => v.imagem);
    }

    if (images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const chosenImg = images[randomIndex];
      imgEl.src = chosenImg;

      const candleMatch = (this.data.velas || []).find(v => chosenImg.includes(v.slug) || chosenImg.includes(v.id));
      const candleName = candleMatch ? candleMatch.nome : 'Vela Grande';
      imgEl.alt = `Ateliê Olivelas — Vela artesanal ${candleName}`;
    }
  }

  getIconSvg(name) {
    switch (name) {
      case 'feather':
      case 'leaf':
        return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 12.5V21h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>`;
      case 'palette':
        return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.24-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z"/></svg>`;
      case 'sparkle':
        return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 6.1L4 11l6.1 1.9L12 19l1.9-6.1L20 11l-6.1-1.9L12 3Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/></svg>`;
      case 'shield':
      default:
        return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`;
    }
  }

  bindGlobalEvents() {
    // Back to top button
    const backTop = $('#back-top-btn');
    if (backTop) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backTop.classList.add('is-visible');
        } else {
          backTop.classList.remove('is-visible');
        }
      });
      backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Category filter pills
    document.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-category]');
      if (pill) {
        e.preventDefault();
        $$('[data-category]').forEach((p) => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        this.activeCategory = pill.dataset.category;
        this.renderCatalog();
      }

      // Filter from featured sections "Ver todos"
      const featLink = e.target.closest('[data-action="filter-featured"]');
      if (featLink) {
        e.preventDefault();
        const filter = featLink.dataset.filter;
        this.activeCategory = filter;
        $$('[data-category]').forEach((p) => p.classList.remove('is-active'));
        this.renderCatalog();
        $('#colecao')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Search input
    const searchInput = $('#catalog-search-input');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = normalizeStr(e.target.value);
          this.renderCatalog();
        }, 180);
      });
    }

    // Card variant selection
    document.addEventListener('click', (e) => {
      const variantRow = e.target.closest('[data-action="select-card-variant"]');
      if (variantRow) {
        e.preventDefault();
        const id = variantRow.dataset.id;
        const index = Number(variantRow.dataset.index);
        this.selectedVariants.set(id, index);
        this.updateCardVariant(id, index);
      }

      // Add to cart from card
      const addCardBtn = e.target.closest('[data-action="card-add-cart"]');
      if (addCardBtn) {
        e.preventDefault();
        const id = addCardBtn.dataset.id;
        this.handleCardAddToCart(id);
      }
    });
  }

  updateCardVariant(id, index) {
    const card = $(`[data-card-id="${id}"]`);
    if (!card) return;

    const allProducts = this.data.produtos || this.data.velas || [];
    const candle = allProducts.find((c) => c.id === id);
    if (!candle || !candle.tamanhos || !candle.tamanhos[index]) return;

    const v = candle.tamanhos[index];

    // Highlight selected variant row
    const rows = card.querySelectorAll('.variant-row');
    rows.forEach((r, idx) => {
      if (idx === index) r.classList.add('is-selected');
      else r.classList.remove('is-selected');
    });

    // Update image if available
    const img = card.querySelector('.thumb-wrap img');
    if (img && v.imagem) {
      img.src = v.imagem;
    }

    // Update direct WhatsApp link
    const waLink = card.querySelector('.order-wa');
    if (waLink) {
      waLink.href = buildDirectItemUrl(candle.nome, `Tamanho ${v.tipo} ${v.peso}`);
    }
  }

  handleCardAddToCart(id) {
    const allProducts = this.data.produtos || this.data.velas || [];
    const candle = allProducts.find((c) => c.id === id);
    if (!candle) return;

    if (candle.esgotado || candle.emBreve || (candle.badge && (candle.badge.toLowerCase().includes('breve') || candle.badge.toLowerCase().includes('esgotado')))) {
      showToast(`"${candle.nome}" não está disponível para compra no momento.`);
      return;
    }

    const defaultIndex = candle.tamanhos && candle.tamanhos.length > 1 ? 1 : 0;
    const variantIndex = this.selectedVariants.get(id) ?? defaultIndex;
    const v = (candle.tamanhos && candle.tamanhos[variantIndex]) || (candle.tamanhos && candle.tamanhos[0]) || {
      uid: `${candle.id}-padrao`,
      tipo: 'Padrão',
      peso: '',
      preco: candle.preco || 0,
      imagem: candle.imagem
    };

    cart.addItem({
      uid: v.uid,
      id: candle.id,
      nome: candle.nome,
      tipo: v.tipo,
      peso: v.peso,
      preco: v.preco,
      imagem: v.imagem || candle.imagem,
      quantidade: 1
    });
  }

  getFilteredCandles() {
    let all = this.data.produtos || this.data.velas || [];

    return all.filter((c) => {
      // Category / Tag filter
      if (this.activeCategory && this.activeCategory !== 'todos') {
        const catNorm = normalizeStr(c.categoria || '');
        const activeCatNorm = normalizeStr(this.activeCategory);
        const famNorm = normalizeStr(c.familia || '');
        const tagsNorm = (c.tags || []).map(t => normalizeStr(t));
        
        const matchesCategory = catNorm === activeCatNorm;
        const matchesFamily = famNorm.includes(activeCatNorm);
        const matchesTag = tagsNorm.includes(activeCatNorm);
        
        // Fallback checks for tag filters if tags aren't explicitly declared
        let matchesFallback = false;
        if (activeCatNorm === 'novidades') {
          matchesFallback = ['novo', 'premium', 'lembrancinhas', 'eventos'].includes(normalizeStr(c.badge || '')) || c.slug === 'morango-champanhe' || (c.id && c.id.startsWith('KIT'));
        } else if (activeCatNorm === 'mais-vendidos') {
          matchesFallback = ['mais vendido', 'assinatura', 'relaxante', 'presenteavel'].includes(normalizeStr(c.badge || '')) || c.id === 'OV01' || c.id === 'OV04' || c.id === 'OV08';
        } else if (activeCatNorm === 'rituais') {
          matchesFallback = catNorm === 'aromatizadores' || catNorm === 'acessorios';
        }

        if (!matchesCategory && !matchesFamily && !matchesTag && !matchesFallback) {
          return false;
        }
      }
      // Text search
      if (this.searchQuery) {
        const query = this.searchQuery;
        const nameNorm = normalizeStr(c.nome);
        const codeNorm = normalizeStr(c.codigo || c.id || '');
        const descNorm = normalizeStr(c.descricao || '');
        const noteNorm = normalizeStr(c.nota || '');
        const famNorm = normalizeStr(c.familia || '');
        if (!nameNorm.includes(query) && !codeNorm.includes(query) && !descNorm.includes(query) && !noteNorm.includes(query) && !famNorm.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }

  renderCatalog() {
    const grid = $('#grid-scents');
    if (!grid) return;

    const filtered = this.getFilteredCandles();

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 16px; color: var(--text-mute);">
          <p style="font-family:var(--serif); font-size:1.2rem; color:var(--text-main); margin-bottom:6px;">Nenhum produto encontrado</p>
          <p>Tente buscar por outro termo ou selecione "Todos os produtos".</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map((c) => {
      const defaultIndex = c.tamanhos && c.tamanhos.length > 1 ? 1 : 0;
      const selectedIndex = this.selectedVariants.get(c.id) ?? defaultIndex;
      const isFav = favorites.isFavorite(c.id);
      const activeVariant = (c.tamanhos && c.tamanhos[selectedIndex]) || (c.tamanhos && c.tamanhos[0]) || {
        tipo: 'Padrão',
        peso: '',
        preco: c.preco || 0,
        imagem: c.imagem,
        queima: ''
      };
      const waUrl = buildDirectItemUrl(c.nome, `Tamanho ${activeVariant.tipo} ${activeVariant.peso}`.trim());
      const isEmBreve = Boolean(c.emBreve || (c.badge && c.badge.toLowerCase().includes('breve')));
      const isEsgotado = Boolean(c.esgotado || (c.badge && c.badge.toLowerCase().includes('esgotado')));
      const notifyWaUrl = `https://wa.me/5511963820374?text=Ol%C3%A1!%20Gostaria%20de%20ser%20avisado(a)%20quando%20o%20${encodeURIComponent(c.nome)}%20estiver%20dispon%C3%ADvel.`;
      const esgotadoWaUrl = `https://wa.me/5511963820374?text=Ol%C3%A1!%20Gostaria%20de%20saber%20a%20previs%C3%A3o%20de%20reposi%C3%A7%C3%A3o%20do%20produto%20${encodeURIComponent(c.nome)}.`;

      return `
        <article class="scent-card" data-card-id="${c.id}" style="--sc: ${c.cor};">
          <div class="band">
            <span class="candle-name">${c.nome}</span>
            ${c.badge ? `<span class="card-badge">${c.badge}</span>` : ''}
          </div>
          <div class="body">
            <div class="thumb-wrap" data-action="open-modal" data-id="${c.id}" title="Clique para ver detalhes">
              <img src="${activeVariant.imagem || c.imagem}" alt="${c.nome}" loading="lazy">
            </div>
            <p class="fam">${c.familia}</p>
            <div class="code"><span>${c.codigo || c.id}</span></div>
            <p class="note">${c.nota || c.descricao || ''}</p>
            
            <div class="variant-selector">
              ${(c.tamanhos || []).map((t, idx) => `
                <div class="variant-row ${idx === selectedIndex ? 'is-selected' : ''}" data-action="select-card-variant" data-id="${c.id}" data-index="${idx}">
                  <div class="variant-label">
                    <span>${t.tipo}${t.peso ? ` · ${t.peso}` : ''}</span>
                    <small>${t.queima || ''}</small>
                  </div>
                  <b class="variant-price">${formatCurrency(t.preco)}</b>
                </div>
              `).join('')}
            </div>

            <div class="card-actions">
              ${isEmBreve ? `
                <a class="btn btn-sm btn--gold" href="${notifyWaUrl}" target="_blank" rel="noopener" style="flex:1; text-align:center;">
                  Avise-me
                </a>
              ` : (isEsgotado ? `
                <a class="btn btn-sm btn--gold" href="${esgotadoWaUrl}" target="_blank" rel="noopener" style="flex:1; text-align:center;">
                  Consultar Reposição
                </a>
              ` : `
                <button type="button" class="btn btn-sm btn--gold" data-action="card-add-cart" data-id="${c.id}" style="flex:1;">
                  + Carrinho
                </button>
              `)}
              <button type="button" class="btn-fav ${isFav ? 'is-fav' : ''}" data-action="toggle-fav" data-id="${c.id}" data-name="${c.nome}" aria-label="Favoritar">
                <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="${isFav ? 'currentColor' : 'none'}"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </button>
            </div>

            ${isEmBreve ? `
              <a class="order-wa" href="${notifyWaUrl}" target="_blank" rel="noopener">Consultar previsão</a>
            ` : (isEsgotado ? `
              <a class="order-wa" href="${esgotadoWaUrl}" target="_blank" rel="noopener">Consultar reposição</a>
            ` : `
              <a class="order-wa" href="${waUrl}" target="_blank" rel="noopener">Pedir no WhatsApp</a>
            `)}
          </div>
        </article>
      `;
    }).join('');
  }

  renderComplementos() {
    const container = $('#complementos-lines');
    if (!container) return;

    const items = this.data.complementos || [];

    container.innerHTML = items.map((item) => `
      <div class="row">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <div class="row-actions">
          <span class="pr">${formatCurrency(item.preco)}</span>
          <button type="button" class="btn btn-sm btn--gold" data-action="add-compl-cart" data-id="${item.id}" style="padding:8px 14px; font-size:10px;">
            + Carrinho
          </button>
        </div>
      </div>
    `).join('');

    // Bind complementary add
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="add-compl-cart"]');
      if (btn) {
        e.preventDefault();
        const id = btn.dataset.id;
        const item = items.find((i) => i.id === id);
        if (item) {
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
    });
  }
}

// Start app
document.addEventListener('DOMContentLoaded', () => {
  window.__olivelasApp = new App();
});
