/* Aplicação: boot, render do catálogo, eventos de UI, SEO e PWA.
   Nenhum produto vive no HTML — tudo nasce do JSON via catalog.js. */

import { $, $$, bus, debounce, formatCurrency, formatDate, scrollTop, webShare, copyToClipboard } from "./utils.js";
import { initTheme, applyBrand, icons } from "./theme.js";
import { loadStore, getItensFiltrados, getStore, setFiltro } from "./catalog.js";
import { initFilters } from "./filters.js";
import { initSearch } from "./search.js";
import { initModal, openModal, resolveHash } from "./modal.js";
import { initCart, addItem, openSidebar, getCount, getTotal } from "./cart.js";
import { initFavorites, toggleFav, isFav, getIds } from "./favorites.js";
import { waLink, mensagemGeral } from "./whatsapp.js";

const PLACEHOLDER = "assets/images/placeholder.webp";

/* Paginação: itens por página calculados pelas colunas da grade (padrão katia),
   página corrente + chave dos filtros ativos */
let page = 1;
let pageSize = 10;
let lastFilterKey = "";

async function init() {
  initTheme();
  bindStaticUi();
  initCartUI();
  initToasts();
  initFavorites();
  initFavSummary();
  initImageFallback();
  initPagination();

  try {
    await loadStore();
    const { meta } = getStore();
    applyBrand(meta);
    renderMeta(meta);
    renderHero(meta);
    renderAromaPalette();
    renderHomeSections();
    renderFooter();
    wireWhatsApp(meta);
    initFilters();
    initSearch();
    initModal();
    initGridEvents();
    bus.on("filtros:change", renderGrid);
    renderGrid();
    initReveal();
    registerSW();

    if (location.hash) resolveHash(location.hash);
  } catch (err) {
    console.error("[olivelas]", err);
    showError(err);
  }
}

/* ================= HEADER / BOTÕES FIXOS ================= */
function bindStaticUi() {
  $("#theme-toggle")?.addEventListener("click", () => bus.emit("theme:toggle"));
  $("#cart-open")?.addEventListener("click", openSidebar);
  $("#back-top")?.addEventListener("click", scrollTop);

  const heroCta = $("#hero-cta");
  heroCta?.addEventListener("click", (e) => {
    e.preventDefault();
    $("#produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  window.addEventListener(
    "scroll",
    debounce(() => {
      const edge = window.scrollY > 24;
      $("#back-top")?.classList.toggle("is-visible", window.scrollY > 640);
      $(".site-header")?.classList.toggle("is-scrolled", edge);
    }, 60),
    { passive: true }
  );
}

function initCartUI() {
  initCart();
  bus.on("store:ready", () => {
    bus.emit("cart:change", { count: getCount(), total: getTotal() });
  });
}

function wireWhatsApp(meta) {
  const chat = waLink(meta.whatsapp, mensagemGeral(meta));
  $("#wa-top")?.setAttribute("href", chat);
  $("#wa-float")?.setAttribute("href", chat);
}

/* ================= HERO / FOOTER / SEO ================= */
function renderHero(meta) {
  const hero = $("#hero");
  const title = $("#hero-title");
  const chip = $("#hero-date");
  const sub = $("#hero-sub");
  const bg = $("#hero-bg");

  const store = getStore();
  if (title) title.innerHTML = store.hero?.titulo || meta.nome;
  if (sub) sub.textContent = store.hero?.subtitulo || meta.slogan;
  if (chip) {
    const d = meta.vigencia
      ? `Tabela válida até <strong>${formatDate(meta.vigencia, meta.locale || "pt-BR")}</strong>`
      : "";
    chip.innerHTML = `${icons.calendar}<span>${d}</span>`;
  }
  if (bg && store.hero?.imagem) bg.src = store.hero.imagem;
  hero?.classList.add("is-loaded");
}

function renderHomeSections() {
  const { categorias, itens } = getStore();
  const categories = $("#home-categories");
  const featured = $("#home-featured");
  if (!categories || !featured) return;

  categories.innerHTML = categorias.map((category, index) => {
    const source = itens.find((item) => item.categoriaId === category.id && (item.imagemThumb || item.imagem)) || itens.find((item) => item.categoriaId === category.id);
    const image = source?.imagemThumb || source?.imagem || PLACEHOLDER;
    return `<a class="category-tile category-tile-${index + 1}" style="--tile-tone:${source?.cor || "var(--brand-mist)"}" href="#produtos" data-home-category="${category.id}">
      <img src="${image}" alt="" loading="lazy" width="720" height="520">
      <span class="category-tile-shade"></span>
      <span class="category-tile-content"><strong>${category.nome}</strong><small>${category.descricao}</small><em>Explorar <span aria-hidden="true">&rarr;</span></em></span>
    </a>`;
  }).join("");

  const unique = (list) => [...new Map(list.map((item) => [item.id, item])).values()];
  const complete = (primary, fallback) => unique([...primary, ...fallback]).slice(0, 4);
  const newItems = complete(itens.filter((item) => ["Novo", "Premium"].includes(item.badge)), itens);
  const popularItems = complete(itens.filter((item) => item.badge === "Mais vendido"), itens);
  const ritualItems = complete(itens.filter((item) => ["aromatizadores", "acessorios"].includes(item.categoriaId)), itens.slice().reverse());

  featured.innerHTML = [
    homeSectionTemplate("novidades", "Chegaram para ficar", "Novidades da casa", newItems),
    homeSectionTemplate("mais-vendidos", "Escolhidos por vocês", "Os mais queridos", popularItems),
    homeSectionTemplate("rituais", "Para completar o ambiente", "Pequenos rituais", ritualItems),
  ].join("");

  categories.addEventListener("click", (event) => {
    const link = event.target.closest("[data-home-category]");
    if (!link) return;
    event.preventDefault();
    const catId = link.dataset.homeCategory;
    const searchInput = $("#search");
    if (searchInput) searchInput.value = "";
    $("#search-clear")?.classList.remove("is-visible");
    bus.emit("categoria:select", catId);
    $("#produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  bindHomeProductEvents(featured);
}

function renderAromaPalette() {
  const container = $("#aroma-palette");
  if (!container) return;
  const { itens } = getStore();
  // Pegar itens únicos de velas para exibir o sistema de cores da marca
  const velas = itens.filter((i) => i.categoriaId === "velas-aromaticas" && i.tamanho === "Padrão");
  const list = velas.length ? velas : itens.filter((i) => i.categoriaId === "velas-aromaticas");
  const unique = [...new Map(list.map((i) => [i.id, i])).values()];

  container.innerHTML = unique
    .map((v) => {
      return `
      <button type="button" class="aroma-swatch-card" style="--aroma-color:${v.cor || 'var(--brand-accent)'}" data-action="filter-aroma" data-query="${v.nome}" data-uid="${v.uid}">
        <span class="aroma-swatch-head">
          <span class="aroma-code">${v.id}</span>
          <span class="aroma-icon" aria-hidden="true">
            <img class="aroma-icon-img" src="assets/images/icons/aromas/${v.slug}.webp" alt="${v.nome}" width="24" height="24">
          </span>
        </span>
        <span class="aroma-swatch-circle" style="background:${v.cor}"></span>
        <strong class="aroma-name">${v.nome}</strong>
        <span class="aroma-family">${v.familia || 'Fragrância Autoral'}</span>
      </button>`;
    })
    .join("");

  container.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action='filter-aroma']");
    if (!btn) return;
    const { query } = btn.dataset;
    const searchInput = $("#search");
    if (searchInput) searchInput.value = query;
    $("#search-clear")?.classList.add("is-visible");
    setFiltro({ query, categoria: "todos", favoritos: false });
    bus.emit("toast", { type: "info", text: `Exibindo produtos do aroma ${query}` });
    $("#produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function homeSectionTemplate(id, eyebrow, title, items) {
  return `<section class="featured-section" id="home-${id}" aria-labelledby="home-${id}-title" data-reveal>
    <div class="section-heading"><div><p class="overline">${eyebrow}</p><h2 id="home-${id}-title">${title}</h2></div><a class="text-link" href="#produtos">Ver todos <span aria-hidden="true">&rarr;</span></a></div>
    <div class="home-product-rail">${items.map(homeProductTemplate).join("")}</div>
  </section>`;
}

function homeProductTemplate(item) {
  const image = item.imagemThumb || item.imagem || PLACEHOLDER;
  const iconHtml = item.categoriaId === "velas-aromaticas"
    ? `<img class="aroma-icon-img" src="assets/images/icons/aromas/${item.slug}.webp" alt="" width="20" height="20">`
    : (icons[item.icone] || "");
  return `<article class="home-product-card" style="--product-accent:${item.cor || 'var(--brand-accent)'}" data-uid="${item.uid}">
    <div class="home-product-media">
      ${item.badge ? `<span class="badge-chip">${item.badge}</span>` : ""}
      <img src="${image}" alt="${item.nome}" loading="lazy" width="480" height="480">
      <button type="button" class="card-fav" data-action="fav" data-id="${item.id}" aria-label="Favoritar ${item.nome}" aria-pressed="false">${icons.heart}</button>
      <button type="button" class="home-product-open" data-action="open" data-uid="${item.uid}" aria-label="Ver detalhes de ${item.nome}"></button>
    </div>
    <div class="home-product-body">
      <div class="card-family-row">
        ${item.cor ? `<span class="card-color-dot" style="background:${item.cor}"></span>` : ""}
        <span>${item.familia || item.categoriaNome}</span>
      </div>
      <button type="button" class="home-product-name" data-action="open" data-uid="${item.uid}">
        <span>${item.nome}</span>
        <span class="card-aroma-icon" aria-hidden="true">${iconHtml}</span>
      </button>
      <strong>${formatCurrency(item.preco)}</strong>
      <button type="button" class="btn btn-primary btn-sm" data-action="add" data-uid="${item.uid}">${icons.cart} Comprar</button>
    </div>
  </article>`;
}

function bindHomeProductEvents(container) {
  container.addEventListener("click", (event) => {
    const actionEl = event.target.closest("[data-action]");
    if (actionEl) handleProductAction(actionEl, event);
  });
}

function renderFooter() {
  const { meta, categorias } = getStore();
  const fill = (id, texto) => {
    const el = $(id);
    if (el && texto) el.textContent = texto;
  };
  fill("#footer-brand-name", meta.nome);
  fill("#footer-slogan", meta.slogan);
  fill("#footer-address", meta.endereco);
  fill("#footer-wa", `WhatsApp: ${formatPhone(meta.whatsapp)}`);
  $("#footer-wa")?.setAttribute("href", waLink(meta.whatsapp, mensagemGeral(meta)));
  fill("#footer-email", meta.email);
  $("#footer-email")?.setAttribute("href", `mailto:${meta.email}`);
  fill("#footer-schedule", meta.horario);
  fill("#footer-copy", `${meta.nome} © ${new Date().getFullYear()} — Preços sujeitos a alteração.`);
  fill("#footer-vigencia", meta.vigencia ? `Vigência da tabela: ${formatDate(meta.vigencia, meta.locale || "pt-BR")}` : "");

  const list = $("#footer-cats");
  if (list) {
    list.innerHTML = categorias
      .map((c) => `<li><a href="#produtos" data-action="footer-cat" data-value="${c.id}">${c.nome}</a></li>`)
      .join("");
    list.addEventListener("click", (e) => {
      const a = e.target.closest("[data-action='footer-cat']");
      if (a) bus.emit("categoria:select", a.dataset.value);
    });
  }
  const insta = $("#footer-insta");
  if (insta && meta.instagram) insta.href = meta.instagram;
}

function renderMeta(meta) {
  document.title = `${meta.nome} — ${meta.slogan}`;
  const setter = (sel, attr, value) => {
    const el = $(sel);
    if (el && value) el.setAttribute(attr, value);
  };
  setter('meta[name="description"]', "content", meta.descricao);
  setter('meta[property="og:title"]', "content", `${meta.nome} — ${meta.slogan}`);
  setter('meta[property="og:description"]', "content", meta.descricao);
  setter('meta[name="twitter:description"]', "content", meta.descricao);
  setter('meta[property="og:url"]', "content", canonicalUrl());
  setter('link[rel="canonical"]', "href", canonicalUrl());

  const ogImg = $('meta[property="og:image"]');
  if (ogImg && meta.site) ogImg.setAttribute("content", `${meta.site}/assets/images/og-cover.webp`);

  injectJsonLd(meta);
  bus.on("theme:changed", (mode) =>
    setter('meta[name="theme-color"]', "content", mode === "dark" ? "#141311" : "#1b1b1b")
  );
}

function canonicalUrl() {
  const { meta } = getStore();
  return (meta.site || `${location.origin}${location.pathname}`).replace(/\/$/, "");
}

const formatPhone = (raw = "") =>
  raw ? raw.replace(/^(\d{2})(\d{2})(\d{5})(\d{4}).*$/, "+$1 $2 $3-$4") : "";

function injectJsonLd(meta) {
  const { categorias } = getStore();
  const products = categorias.flatMap((c) =>
    (c.produtos?.length ? c.produtos : []).map((p) => ({
      "@type": "Product",
      name: p.nome,
      image: adaptiveImg(p.imagem),
      sku: p.id,
      description: p.descricao || undefined,
      category: c.nome,
      offers: Array.isArray(p.tamanhos)
        ? p.tamanhos.map((t) => ({
            "@type": "Offer",
            priceCurrency: meta.moeda || "BRL",
            price: t.preco,
            itemCondition: "https://schema.org/NewCondition",
            availability: "https://schema.org/InStock",
          }))
        : undefined,
    }))
  );

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: meta.nome,
      url: canonicalUrl(),
      logo: `${canonicalUrl()}/assets/images/logo.png`,
      slogan: meta.slogan,
      description: meta.descricao,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: `+${meta.whatsapp}`,
        contactType: "sales",
        availableLanguage: "pt-BR",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${meta.nome} — Catálogo de Produtos`,
      itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: p })),
    },
  ];

  const script = $("#jsonld");
  if (script) script.textContent = JSON.stringify(ld);
}

function adaptiveImg(src) {
  if (!src) return `${canonicalUrl()}/assets/images/placeholder.webp`;
  return src.startsWith("http") ? src : `${canonicalUrl()}/${src}`;
}

/* ================= GRADE DE PRODUTOS ================= */
function renderGrid() {
  const store = getStore();
  if (!store.meta) return;
  const grid = $("#grid");
  if (!grid) return;

  const list = getItensFiltrados();

  if (store.filtros.query) {
    $("#catalog-title").textContent = `Fragrância “${store.filtros.query}”`;
    $("#catalog-eyebrow").textContent = "Código Olfativo";
  } else if (store.filtros.favoritos) {
    $("#catalog-title").textContent = "Meus Favoritos";
    $("#catalog-eyebrow").textContent = "Coleção Pessoal";
  } else {
    $("#catalog-title").textContent =
      store.filtros.categoria === "todos" ? "Todos os produtos" : currentCategoryName();
    $("#catalog-eyebrow").textContent = store.filtros.categoria === "todos" ? "Catálogo" : "Categoria";
  }

  if (!list.length) {
    page = 1;
    $("#page-size-select").innerHTML = "";
    $("#pagination").innerHTML = "";
    grid.innerHTML = "";
    const empty = $("#empty");
    const isFavView = Boolean(store.filtros.favoritos);
    const msg = isFavView
      ? "Você ainda não favoritou nenhum produto. Toque no coração de qualquer produto para salvá-lo aqui."
      : store.filtros.query
      ? `Nada encontrado para “${store.filtros.query}”.`
      : "Ajuste os filtros ou limpe sua busca para ver mais produtos.";
    empty.innerHTML = `
      ${isFavView ? icons.heart : icons.search}
      <h3>${isFavView ? "Sua lista de favoritos está vazia" : "Nenhum produto encontrado"}</h3>
      <p>${msg}</p>
      <button type="button" class="btn btn-ghost" id="empty-reset">${isFavView ? "Explorar todos os produtos" : "Limpar filtros"}</button>`;
    empty.classList.add("is-visible");
    grid.setAttribute("aria-busy", "false");
    return;
  }

  $("#empty")?.classList.remove("is-visible");
  const fkey = JSON.stringify([
    store.filtros.query,
    store.filtros.categoria,
    store.filtros.precoMin,
    store.filtros.precoMax,
    store.filtros.sort,
    store.filtros.favoritos,
  ]);
  if (fkey !== lastFilterKey) {
    lastFilterKey = fkey;
    page = 1;
  }

  rebuildPageSizeOptions(list.length);
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  if (page > pages) page = pages;
  const visible = list.slice((page - 1) * pageSize, page * pageSize);

  grid.innerHTML = visible.map(cardTemplate).join("");
  grid.setAttribute("aria-busy", "false");
  paintFavorites();
  renderPagination(list.length);
}

/* ---------- Paginação (padrão katia-produtos) ---------- */
function measureColumns() {
  const grid = $("#grid");
  if (!grid) return 4;
  const computed = getComputedStyle(grid).gridTemplateColumns;
  const cols = computed ? computed.split(" ").filter((t) => t && t !== "none").length : 0;
  return cols > 0 ? cols : 4;
}

function sizesFor(cols, total) {
  const step = cols * 2;
  if (!step || step < 1 || total < 1) return [Math.max(1, total)];
  const opts = [];
  for (let s = step; s <= total; s += step) opts.push(s);
  if (opts[opts.length - 1] !== total) opts.push(total);
  return opts;
}

function rebuildPageSizeOptions(total) {
  const select = $("#page-size-select");
  if (!select) return;
  const options = sizesFor(measureColumns(), Math.max(1, total));
  if (!options.includes(pageSize)) {
    pageSize = options[0] || Math.max(1, total);
    page = 1;
  }
  select.innerHTML = options.map((s) => `<option value="${s}">${s}</option>`).join("");
  select.value = String(pageSize);
}

function renderPagination(total) {
  const nav = $("#pagination");
  if (!nav) return;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  nav.innerHTML = "";
  if (total === 0 || pages <= 1) return;

  const makeBtn = (inner, opts = {}) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `page-btn${opts.active ? " active" : ""}`;
    if (opts.disabled) b.disabled = true;
    if (opts.label) b.setAttribute("aria-label", opts.label);
    b.innerHTML = inner;
    if (!opts.disabled) {
      b.addEventListener("click", () => {
        page = opts.page;
        renderGrid();
        $("#produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    return b;
  };

  nav.appendChild(makeBtn(icons.chevronLeft, { page: page - 1, disabled: page <= 1, label: "Página anterior" }));

  const slots = paginationSlots(page, pages);
  slots.forEach((s) => {
    if (s === "...") {
      const span = document.createElement("span");
      span.className = "page-ellipsis";
      span.textContent = "…";
      nav.appendChild(span);
    } else {
      nav.appendChild(makeBtn(String(s), { page: s, active: s === page, label: `Página ${s}` }));
    }
  });

  nav.appendChild(makeBtn(icons.chevronRight, { page: page + 1, disabled: page >= pages, label: "Próxima página" }));
}

function paginationSlots(curr, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, curr, curr - 1, curr + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  sorted.forEach((p) => {
    if (prev && p - prev > 1) out.push("...");
    out.push(p);
    prev = p;
  });
  return out;
}

function initPagination() {
  $("#page-size-select")?.addEventListener("change", (e) => {
    pageSize = Number(e.target.value);
    page = 1;
    renderGrid();
  });
  window.addEventListener("resize", debounce(() => renderGrid(), 200));
}

function currentCategoryName() {
  return getStore().categorias.find((c) => c.id === getStore().filtros.categoria)?.nome || "Produtos";
}

function cardTemplate(item, idx) {
  const thumb = item.imagemThumb || item.imagem || PLACEHOLDER;
  const iconHtml = item.categoriaId === "velas-aromaticas"
    ? `<img class="aroma-icon-img" src="assets/images/icons/aromas/${item.slug}.webp" alt="" width="20" height="20">`
    : (icons[item.icone] || "");
  return `
  <article class="card" style="--i:${idx % 24}; --product-accent:${item.cor || 'var(--brand-accent)'}" data-uid="${item.uid}">
    <div class="card-media">
      ${item.badge ? `<span class="badge-chip card-badge">${item.badge}</span>` : ""}
      <img src="${thumb}" alt="${item.nome}" loading="lazy" decoding="async" width="480" height="480">
      <button type="button" class="card-open-zone" data-action="open" data-uid="${item.uid}"
        aria-label="Ver detalhes de ${item.nome} ${item.tamanho}"></button>
      <button type="button" class="card-fav" data-action="fav" data-id="${item.id}"
        aria-label="Favoritar ${item.nome}" aria-pressed="false">${icons.heart}</button>
      <button type="button" class="card-share" data-action="share" data-uid="${item.uid}"
        aria-label="Compartilhar ${item.nome}">${icons.share}</button>
      <span class="card-tamanho">${item.tamanho} · ${item.peso}</span>
    </div>
    <div class="card-body">
      <div class="card-family-row">
        ${item.cor ? `<span class="card-color-dot" style="background:${item.cor}"></span>` : ""}
        ${item.familia ? `<span class="card-family">${item.familia}</span>` : `<span class="card-family">${item.categoriaNome}</span>`}
      </div>
      <button type="button" class="card-name" data-action="open" data-uid="${item.uid}">
        <span class="card-name-text">${item.nome}</span>
        <span class="card-aroma-icon" aria-hidden="true">${iconHtml}</span>
      </button>
      <div class="card-meta">
        ${item.recipiente ? `<span>${item.recipiente}</span>` : ""}
        ${item.queima ? `<span>🔥 ${item.queima}</span>` : ""}
      </div>
      <div class="card-price">
        <div>
          <strong>${formatCurrency(item.preco)}</strong>
          ${item.recipiente ? `<small>${item.recipiente}</small>` : ""}
        </div>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-primary btn-block btn-sm" data-action="add" data-uid="${item.uid}">
          ${icons.cart} Adicionar
        </button>
      </div>
    </div>
  </article>`;
}

function initGridEvents() {
  const grid = $("#grid");
  const empty = $("#empty");

  grid?.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) handleProductAction(actionEl, e);
  });

  empty?.addEventListener("click", (e) => {
    const reset = e.target.closest("#empty-reset");
    if (reset) {
      bus.emit("filtros:reset");
      setFiltro({
        query: "",
        categoria: "todos",
        precoMin: getStore().limitesPreco.min,
        precoMax: getStore().limitesPreco.max,
        sort: "relevancia",
        favoritos: false,
      });
    }
  });
}

function handleProductAction(actionEl, e) {
  if (e?.stopPropagation) e.stopPropagation();
  const { action, uid, id } = actionEl.dataset;
  if (action === "open") openModal(uid);
  if (action === "add") {
    addItem(uid, 1);
    openSidebar();
    bus.emit("toast", { type: "success", text: "Produto adicionado ao carrinho" });
  }
  if (action === "fav") {
    toggleFav(id);
    const favNow = isFav(id);
    bus.emit("toast", { type: "info", text: favNow ? "Adicionado aos favoritos" : "Removido dos favoritos" });
  }
  if (action === "share") shareProduct(uid);
}

async function shareProduct(uid) {
  const item = getStore().itens.find((i) => i.uid === uid);
  if (!item) return;
  const url = productUrl(item);
  const shared = await webShare({ title: `${item.nome} — OLIVELAS`, text: item.descricao || item.nome, url });
  if (!shared) {
    const copied = await copyToClipboard(url);
    bus.emit("toast", { type: copied ? "success" : "error", text: copied ? "Link copiado" : "Não foi possível copiar" });
  }
}

function productUrl(item) {
  const site = (getStore().meta.site || `${location.origin}${location.pathname}`).replace(/\/$/, "");
  return `${site}/#produto-${item.uid}`;
}

function paintFavorites() {
  $$("[data-action='fav']").forEach((el) => {
    const active = isFav(el.dataset.id);
    el.classList.toggle("is-active", active);
    el.setAttribute("aria-pressed", String(active));
    el.setAttribute("aria-label", active ? "Remover dos favoritos" : "Adicionar aos favoritos");
  });
}

/* ================= TOASTS (Notificações Elegantes com Antiduplicação) ================= */
let lastToastKey = "";
let lastToastTime = 0;

function initToasts() {
  bus.on("toast", ({ type = "info", text }) => {
    const wrap = $("#toasts");
    if (!wrap || !text) return;

    const now = Date.now();
    const key = `${type}:${text}`;
    if (key === lastToastKey && now - lastToastTime < 750) {
      return; // Previne emissões repetidas acidentais
    }
    lastToastKey = key;
    lastToastTime = now;

    let icon = icons.info;
    let toastType = type;
    const lower = text.toLowerCase();

    if (lower.includes("favorito")) {
      icon = icons.heart;
      toastType = "fav";
    } else if (type === "success" || lower.includes("adicionado ao carrinho")) {
      icon = icons.check;
      toastType = "success";
    } else if (type === "error" || lower.includes("erro") || lower.includes("não foi possível")) {
      icon = icons.alert;
      toastType = "error";
    } else if (lower.includes("aroma") || lower.includes("fragrância")) {
      icon = icons.flame;
      toastType = "info";
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${toastType}`;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <span class="toast-msg">${text}</span>
      <button type="button" class="toast-close" aria-label="Fechar notificação">${icons.close}</button>
    `;

    wrap.appendChild(toast);
    while (wrap.children.length > 2) wrap.firstElementChild?.remove();

    let removed = false;
    const dismiss = () => {
      if (removed) return;
      removed = true;
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 280);
    };

    const timer = window.setTimeout(dismiss, 3200);

    toast.querySelector(".toast-close")?.addEventListener("click", (e) => {
      e.stopPropagation();
      clearTimeout(timer);
      dismiss();
    });
  });
}

/* ================= FAVORITOS: ACESSO RÁPIDO ================= */
function initFavSummary() {
  const btn = $("#fav-open");
  const badge = $("#fav-count");
  if (!btn) return;

  const update = () => {
    const n = getIds().size;
    if (badge) {
      badge.textContent = String(n);
      badge.classList.toggle("is-visible", n > 0);
    }
    const isFiltered = Boolean(getStore().filtros.favoritos);
    btn.classList.toggle("is-active", isFiltered);
    btn.setAttribute("aria-pressed", String(isFiltered));
    btn.setAttribute("aria-label", isFiltered ? "Exibindo favoritos" : "Ver favoritos");
    paintFavorites();
  };

  btn.addEventListener("click", () => {
    const willBeActive = !getStore().filtros.favoritos;
    const searchInput = $("#search");
    if (searchInput) searchInput.value = "";
    $("#search-clear")?.classList.remove("is-visible");

    setFiltro({
      favoritos: willBeActive,
      categoria: "todos",
      query: "",
    });

    if (willBeActive) {
      bus.emit("toast", { type: "info", text: "Exibindo seus produtos favoritos" });
    }
    $("#produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  bus.on("fav:change", update);
  bus.on("filtros:change", update);
  update();
}

/* ================= ANIMAÇÕES / REVEAL ================= */
function initReveal() {
  $("#loader")?.classList.add("is-hidden");
  const targets = $$("[data-reveal]");
  if (!targets.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((el) => io.observe(el));
}

/* ================= FALLBACK DE IMAGEM ================= */
function initImageFallback() {
  window.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (img instanceof HTMLImageElement && !img.dataset.fallback) {
        img.dataset.fallback = "1";
        img.src = PLACEHOLDER;
      }
    },
    true
  );
}

/* ================= ESTADO DE ERRO ================= */
function showError(err) {
  $("#loader")?.classList.add("is-hidden");
  const view = $("#app-error");
  const grid = $("#grid");
  if (grid) grid.innerHTML = "";
  if (view) view.hidden = false;
  $("#empty")?.classList.remove("is-visible");

  const detail = $("#error-detail");
  if (!detail) return;
  if (location.protocol === "file:") {
    detail.textContent =
      "Você abriu o arquivo direto do disco. Use um servidor local para ver o catálogo: `node test/serve.mjs` ou `python -m http.server`.";
    return;
  }
  if (!navigator.onLine) {
    detail.textContent = "Você está offline agora. A versão salva será usada assim que a conexão voltar.";
    return;
  }
  const msg = err && err.message ? String(err.message) : "";
  if (msg.startsWith("HTTP")) detail.textContent = `O servidor respondeu: ${msg}.`;
  else detail.textContent = `Falha de rede ao buscar o catálogo (${(err && err.url) || "assets/data/produtos.json"}).`;
}

/* ================= PWA ================= */
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js");
      if (!navigator.serviceWorker.controller) return;

      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!reloaded) {
          reloaded = true;
          location.reload();
        }
      });

      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        if (sw) {
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed") sw.postMessage("SKIP_WAITING");
          });
        }
      });
    } catch (err) {
      console.warn("[olivelas] SW:", err);
    }
  });
}

/* ================= BOOT ================= */
init();