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

/* Paginação: itens por página + página corrente + chave dos filtros ativos */
const PAGE_SIZES_BASE = [8, 16, 24, 32, 48, 64];
let page = 1;
let pageSize = 8;
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
    renderFooter();
    wireWhatsApp(meta);
    initFilters();
    initSearch();
    initModal();
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
  const total = store.itens.length;

  $("#catalog-title").textContent =
    store.filtros.categoria === "todos" ? "Todos os produtos" : currentCategoryName();

  $("#result-count").textContent = `${list.length} de ${total} produto${total === 1 ? "" : "s"}${
    store.filtros.query ? ` para “${store.filtros.query}”` : ""
  }`;

  $("#catalog-eyebrow").textContent = store.filtros.categoria === "todos" ? "Catálogo" : "Categoria";

  if (!list.length) {
    grid.innerHTML = "";
    const empty = $("#empty");
    empty.innerHTML = `
      ${icons.search}
      <h3>Nenhum produto encontrado</h3>
      <p>${store.filtros.query ? `Nada encontrado para “${store.filtros.query}”.` : "Ajuste os filtros ou limpe sua busca para ver mais produtos."}</p>
      <button type="button" class="btn btn-ghost" id="empty-reset">Limpar filtros</button>`;
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

  rebuildPageSize(list.length);
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  if (page > pages) page = pages;
  const visible = list.slice((page - 1) * pageSize, page * pageSize);

  grid.innerHTML = visible.map(cardTemplate).join("");
  grid.setAttribute("aria-busy", "false");
  paintFavorites();
  bindGridEvents(grid);
  renderPagination(list.length);
}

/* ---------- Paginação ---------- */
function paginationSizes(total) {
  const opts = PAGE_SIZES_BASE.filter((s) => s < total);
  if (!opts.length || opts[opts.length - 1] !== total) opts.push(total);
  return opts;
}

function rebuildPageSize(total) {
  const sel = $("#page-size");
  if (!sel) return;
  const opts = paginationSizes(total);
  if (!opts.includes(pageSize)) {
    pageSize = opts[0] || total;
    page = 1;
  }
  sel.innerHTML = opts.map((s) => `<option value="${s}">${s}</option>`).join("");
  sel.value = String(pageSize);
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

  nav.appendChild(makeBtn(icons.chevronLeft, { page: page - 1, disabled: page === 1, label: "Página anterior" }));
  pageSlots(pages).forEach((p) => {
    if (p === "…") {
      const s = document.createElement("span");
      s.className = "page-ellipsis";
      s.textContent = "…";
      nav.appendChild(s);
    } else {
      nav.appendChild(makeBtn(String(p), { page: p, active: p === page }));
    }
  });
  nav.appendChild(makeBtn(icons.chevronRight, { page: page + 1, disabled: page === pages, label: "Próxima página" }));
}

function pageSlots(pages) {
  const want = new Set([1, pages, page, page - 1, page + 1]);
  const sorted = [...want].filter((p) => p >= 1 && p <= pages).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  sorted.forEach((p) => {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  });
  return out;
}

function initPagination() {
  $("#page-size")?.addEventListener("change", (e) => {
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
  const thumb = item.imagemThumb || PLACEHOLDER;
  return `
  <article class="card" style="--i:${idx % 24}" data-uid="${item.uid}">
    <div class="card-media">
      ${item.badge ? `<span class="badge-chip card-badge">${item.badge}</span>` : ""}
      <img src="${thumb}" alt="${item.nome}" loading="lazy" decoding="async" width="480" height="480">
      <button type="button" class="card-open-zone" data-action="open" data-uid="${item.uid}"
        aria-label="Ver detalhes de ${item.nome} ${item.tamanho}"></button>
      <button type="button" class="card-fav" data-action="fav" data-id="${item.id}"
        aria-label="Favoritar ${item.nome}" aria-pressed="false">${icons.heart}</button>
      <button type="button" class="card-share" data-action="share" data-uid="${item.uid}"
        aria-label="Compartilhar ${item.nome}">${icons.share}</button>
      <span class="card-tamanho">${item.tamanho}</span>
    </div>
    <div class="card-body">
      ${item.familia ? `<span class="card-family">${item.familia}</span>` : ""}
      <button type="button" class="card-name" data-action="open" data-uid="${item.uid}">${item.nome}</button>
      <div class="card-meta">
        <span>Cód. ${item.id}</span>
        <span>${item.peso}</span>
        <span>${item.quantidade} por pacote</span>
      </div>
      <div class="card-price">
        <div>
          <strong>${formatCurrency(item.preco)}</strong>
          ${item.recipiente ? `<small>${item.recipiente}</small>` : ""}
        </div>
      </div>
      <div class="card-actions">
        <button type="button" class="btn btn-primary btn-block btn-sm" data-action="add" data-uid="${item.uid}">
          ${icons.cart} Comprar
        </button>
      </div>
    </div>
  </article>`;
}

function bindGridEvents(grid) {
  grid.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      const { action, uid, id } = actionEl.dataset;
      if (action === "open") openModal(uid);
      if (action === "add") {
        addItem(uid, 1);
        openSidebar();
        bus.emit("toast", { type: "success", text: "Produto adicionado ao carrinho" });
      }
      if (action === "fav") {
        toggleFav(id);
        actionEl.classList.toggle("is-active", isFav(id));
        actionEl.setAttribute("aria-pressed", String(isFav(id)));
        bus.emit("toast", { type: "info", text: isFav(id) ? "Adicionado aos favoritos" : "Removido dos favoritos" });
      }
      if (action === "share") shareProduct(uid);
      return;
    }
  });

  const reset = $("#empty-reset");
  reset?.addEventListener("click", () => {
    bus.emit("filtros:reset");
    setFiltro({ query: "", categoria: "todos", precoMin: getStore().limitesPreco.min, precoMax: getStore().limitesPreco.max, sort: "relevancia", favoritos: false });
  });
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
  });
}

/* ================= TOASTS ================= */
function initToasts() {
  bus.on("toast", ({ type = "info", text }) => {
    const wrap = $("#toasts");
    if (!wrap) return;
    const icon = type === "success" ? icons.check : type === "error" ? icons.alert : icons.info;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.innerHTML = `${icon}<span>${text}</span>`;
    wrap.appendChild(toast);
    while (wrap.children.length > 3) wrap.firstElementChild?.remove();

    const hide = () => {
      toast.classList.add("is-leaving");
      window.setTimeout(() => toast.remove(), 350);
    };
    const timer = window.setTimeout(hide, 2800);
    toast.addEventListener("click", () => {
      clearTimeout(timer);
      hide();
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
    const active = Boolean(getStore().filtros.favoritos);
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", String(active));
    btn.setAttribute("aria-label", active ? "Ocultar favoritos" : "Ver favoritos");
    paintFavorites();
    if (active) renderGrid();
  };

  btn.addEventListener("click", () => {
    setFiltro({ favoritos: !getStore().filtros.favoritos });
  });
  bus.on("fav:change", update);
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