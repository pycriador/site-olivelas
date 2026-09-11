/**
 * OLIVELAS — Data Store & Catalog Loader (/novo)
 * Totalmente personalizável via produtos.json
 */

export const FALLBACK_DATA = {
  meta: {
    nome: "OLIVELAS",
    slogan: "Aromas que transformam ambientes em memórias",
    whatsapp: "5511963820374",
    instagram: "https://instagram.com/rosa_olivelas",
    endereco: "São Paulo, SP"
  },
  heroConfig: {
    chamadaPrincipal: "Aromas que transformam ambientes em memórias",
    descricao: "Feitas à mão, em pequenos lotes, em São Paulo. Fragrâncias autorais — cada uma com a sua cor e o seu símbolo exclusivo.",
    botaoColecao: "Ver a coleção",
    botaoPedido: "Fazer um pedido",
    prelaunch: "Cera 100% vegetal · Pavio de algodão · Queima limpa e duradoura"
  },
  pilares: [
    {
      icone: "feather",
      titulo: "Design Minimalista",
      descricao: "Sofisticação em cada detalhe para seu ambiente"
    },
    {
      icone: "palette",
      titulo: "Coleção Organizada",
      descricao: "Cores e códigos exclusivos para cada aroma"
    },
    {
      icone: "sparkle",
      titulo: "Experiência Sensorial",
      descricao: "Fragrâncias marcantes que acolhem e inspiram"
    },
    {
      icone: "shield",
      titulo: "Cera 100% Vegetal",
      descricao: "Produção artesanal com queima ecológica"
    }
  ],
  colecaoConfig: {
    eyebrow: "A coleção",
    titulo: "Nossos aromas, seus rituais",
    subtitulo: "Cada fragrância vem em dois tamanhos: Mini de 30 g, para experimentar, e Padrão de 130 g, em copo de vidro.",
    notaCatalogo: "Todas as velas acompanham instruções de primeiro uso para máxima durabilidade e difusão.",
    fineprint: "Preços válidos para pedidos combinados diretamente com o ateliê",
    colecoesDisponiveis: [
      { id: "todos", nome: "Todos os produtos", filtro: "todos" },
      { id: "velas", nome: "Velas Aromáticas", filtro: "velas" },
      { id: "kits", nome: "Kits", filtro: "kits" },
      { id: "aromatizadores", nome: "Aromatizadores", filtro: "aromatizadores" },
      { id: "acessorios", nome: "Acessórios", filtro: "acessorios" }
    ],
    velasAtivas: ["OV01", "OV02", "OV03", "OV04", "OV05", "OV06", "OV07", "OV08", "OV09"]
  },
  homeFeatured: [
    {
      id: "novidades",
      tag: "novidades",
      eyebrow: "Chegaram para ficar",
      titulo: "Novidades da casa"
    },
    {
      id: "mais-vendidos",
      tag: "mais-vendidos",
      eyebrow: "Escolhidos por vocês",
      titulo: "Os mais queridos"
    },
    {
      id: "rituais",
      tag: "rituais",
      eyebrow: "Para completar o ambiente",
      titulo: "Pequenos rituais"
    }
  ],
  complementosConfig: {
    eyebrow: "Para completar o ambiente",
    titulo: "Linhas complementares",
    subtitulo: "Aromatizadores, sachês e acessórios para o cuidado das suas velas."
  },
  atelie: {
    eyebrow: "O ateliê",
    titulo: "Feita à mão, em pequenos lotes",
    descricao: "A Olivelas nasce em São Paulo, com produção artesanal cuidadosa. Cada vela é derramada à mão, em pequenos lotes, com cera 100% vegetal, pavio de algodão puro e essências de alta performance que preenchem o ambiente com sutileza e requinte.",
    especificacoes: "130 g · copo de vidro com tampa dourada · cera vegetal · pavio de algodão",
    tagline: "A Olivelas transforma ambientes em momentos especiais através de aromas que acolhem e inspiram.",
    imagensAleatorias: [
      "../assets/images/products/verbena.webp",
      "../assets/images/products/blue-ocean.webp",
      "../assets/images/products/morango-champanhe.webp",
      "../assets/images/products/mistica.webp",
      "../assets/images/products/orquidea-negra.webp",
      "../assets/images/products/mamae-bebe.webp",
      "../assets/images/products/cravo-canela.webp",
      "../assets/images/products/lavanda.webp",
      "../assets/images/products/alfazema.webp"
    ]
  },
  comoPedir: {
    eyebrow: "Como pedir",
    titulo: "Pedidos direto com o ateliê",
    subtitulo: "Monte seu pedido pelo catálogo ou fale diretamente conosco pelo WhatsApp e Instagram — inclusive para lembrancinhas e eventos especiais.",
    linhas: [
      {
        titulo: "Velas da coleção",
        descricao: "Nossos aromas autorais em versões Mini (30 g) ou Padrão (130 g com tampa dourada)."
      },
      {
        titulo: "Lembrancinhas de eventos",
        descricao: "Batizados, casamentos, maternidade e eventos corporativos com rótulos personalizados sob encomenda."
      },
      {
        titulo: "Kits e presentes",
        descricao: "Combinações de velas, difusores e acessórios com embalagem estruturada para presentear."
      }
    ],
    botaoWhatsApp: "Falar no WhatsApp",
    botaoInstagram: "Instagram @rosa_olivelas",
    fineprint: "WhatsApp (11) 96382-0374 · Atendimento de Seg a Sáb das 9h às 18h"
  },
  velas: [
    {
      id: "OV01",
      nome: "Verbena",
      slug: "verbena",
      categoria: "velas",
      tags: ["mais-vendidos"],
      familia: "Frutal Verde",
      cor: "var(--verbena)",
      hexCor: "#8EA487",
      codigo: "OV01",
      badge: "Mais vendido",
      nota: "Folhas verdes e um fundo cítrico para as manhãs de casa aberta.",
      descricao: "Notas frescas e verdes que remetem a jardins ensolarados, com equilíbrio perfeito entre cítricos suaves e folhas frescas de verbena.",
      imagem: "../assets/images/products/verbena.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/verbena-mini.webp", uid: "OV01-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/verbena.webp", uid: "OV01-padrao" }
      ]
    },
    {
      id: "OV02",
      nome: "Blue Ocean",
      slug: "blue-ocean",
      categoria: "velas",
      tags: ["mais-vendidos"],
      familia: "Floral Frutal",
      cor: "var(--blue-ocean)",
      hexCor: "#6E8797",
      codigo: "OV02",
      badge: "",
      nota: "Brisa marinha limpa e suave, para desacelerar o ritmo do dia.",
      descricao: "Frescor aquático revigorante que evoca brisa marinha e amplitude. Florais delicados sobre um fundo leve, limpo e sofisticado.",
      imagem: "../assets/images/products/blue-ocean.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/blue-ocean-mini.webp", uid: "OV02-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/blue-ocean.webp", uid: "OV02-padrao" }
      ]
    },
    {
      id: "OV03",
      nome: "Morango & Champanhe",
      slug: "morango-champanhe",
      categoria: "velas",
      tags: ["novidades"],
      familia: "Oriental Gourmand",
      cor: "var(--morango)",
      hexCor: "#C49A90",
      codigo: "OV03",
      badge: "Novo",
      nota: "Frutas vermelhas e brinde festivo — o perfume dos encontros.",
      descricao: "Doçura frutada com um toque sofisticado e festivo. Morango maduro, efervescência de champanhe e um final delicadamente adocicado.",
      imagem: "../assets/images/products/morango-champanhe.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/morango-champanhe-mini.webp", uid: "OV03-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/morango-champanhe.webp", uid: "OV03-padrao" }
      ]
    },
    {
      id: "OV04",
      nome: "Mística",
      slug: "mistica",
      categoria: "velas",
      tags: ["mais-vendidos"],
      familia: "Amadeirada Especiada",
      cor: "var(--mistica)",
      hexCor: "#525C67",
      codigo: "OV04",
      badge: "Assinatura",
      nota: "Madeiras nobres e resinas que convidam ao silêncio e à leitura.",
      descricao: "Composição envolvente de madeiras nobres, especiarias orientais e resinas ricas. Cria um clima acolhedor, introspectivo e de pura sofisticação.",
      imagem: "../assets/images/products/mistica.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/mistica-mini.webp", uid: "OV04-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/mistica.webp", uid: "OV04-padrao" }
      ]
    },
    {
      id: "OV05",
      nome: "Orquídea Negra",
      slug: "orquidea-negra",
      categoria: "velas",
      tags: ["novidades"],
      familia: "Floral Oriental",
      cor: "var(--orquidea)",
      hexCor: "#5B3645",
      codigo: "OV05",
      badge: "",
      nota: "Floral aveludado e misterioso para acender ao cair da tarde.",
      descricao: "Fragrância intensa e magnética. Notas florais ricas de orquídea negra combinadas com acordes orientais aveludados e calorosos.",
      imagem: "../assets/images/products/orquidea-negra.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/orquidea-negra-mini.webp", uid: "OV05-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/orquidea-negra.webp", uid: "OV05-padrao" }
      ]
    },
    {
      id: "OV06",
      nome: "Mamãe & Bebê",
      slug: "mamae-bebe",
      categoria: "velas",
      tags: ["novidades"],
      familia: "Floral Amadeirada Musk",
      cor: "var(--mamae)",
      hexCor: "#BFC2BC",
      codigo: "OV06",
      badge: "Acolhedor",
      nota: "Algodão e um amadeirado macio, para o quarto e os primeiros dias.",
      descricao: "Aconchego e ternura em forma de perfume. Toque aveludado de algodão, lavanda suave e notas de fundo confortáveis e carinhosas.",
      imagem: "../assets/images/products/mamae-bebe.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/mamae-bebe-mini.webp", uid: "OV06-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/mamae-bebe.webp", uid: "OV06-padrao" }
      ]
    },
    {
      id: "OV07",
      nome: "Cravo & Canela",
      slug: "cravo-canela",
      categoria: "velas",
      tags: ["mais-vendidos"],
      familia: "Oriental Especiada",
      cor: "var(--cravo)",
      hexCor: "#A96F4E",
      codigo: "OV07",
      badge: "",
      nota: "Especiaria quente de cozinha em festa — o cheiro de casa cheia.",
      descricao: "Calor e energia acolhedora. O equilíbrio clássico entre a intensidade aromática do cravo e a doçura picante da canela em pau.",
      imagem: "../assets/images/products/cravo-canela.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/cravo-canela-mini.webp", uid: "OV07-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/cravo-canela.webp", uid: "OV07-padrao" }
      ]
    },
    {
      id: "OV08",
      nome: "Lavanda Francesa",
      slug: "lavanda",
      categoria: "velas",
      tags: ["mais-vendidos"],
      familia: "Floral Aromática",
      cor: "var(--lavanda)",
      hexCor: "#8A7F9D",
      codigo: "OV08",
      badge: "Relaxante",
      nota: "Campos de lavanda em flor para rituais de descanso e bem-estar.",
      descricao: "Clássica e calmante, a lavanda francesa purifica a mente e cria um ambiente de serenidade profunda.",
      imagem: "../assets/images/products/lavanda.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/lavanda-mini.webp", uid: "OV08-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/lavanda.webp", uid: "OV08-padrao" }
      ]
    },
    {
      id: "OV09",
      nome: "Alfazema Provençal",
      slug: "alfazema",
      categoria: "velas",
      tags: ["mais-vendidos"],
      familia: "Herbal Fresca",
      cor: "var(--alfazema)",
      hexCor: "#8FA2A6",
      codigo: "OV09",
      badge: "Frescor",
      nota: "Notas herbais e aromáticas para purificar e renovar as energias.",
      descricao: "Fragrância leve e fresca que promove harmonia e clareza, perfeita para salas de estar e varandas.",
      imagem: "../assets/images/products/alfazema.webp",
      tamanhos: [
        { tipo: "Mini", peso: "30 g", queima: "≈ 20 h", preco: 12.9, imagem: "../assets/images/products/alfazema-mini.webp", uid: "OV09-mini" },
        { tipo: "Padrão", peso: "130 g", queima: "≈ 50 h", preco: 69.9, imagem: "../assets/images/products/alfazema.webp", uid: "OV09-padrao" }
      ]
    }
  ],
  kits: [
    {
      id: "KIT01",
      nome: "Kit 3 Mini Velas",
      slug: "kit-3-mini-velas",
      categoria: "kits",
      tags: ["mais-vendidos", "novidades"],
      familia: "Trio Degustação · 3x 30 g",
      cor: "var(--lavanda)",
      hexCor: "#8A7F9D",
      codigo: "KIT01",
      badge: "Presenteável",
      nota: "Seleção com 3 fragrâncias de 30 g em caixa rígida para presente.",
      descricao: "Seleção com 3 fragrâncias autorais de 30 g em caixa rígida para presente. Ideal para experimentar diferentes rituais olfativos.",
      imagem: "../assets/images/products/lavanda-mini.webp",
      tamanhos: [
        { tipo: "Kit", peso: "3x 30 g", queima: "≈ 60 h total", preco: 119.9, imagem: "../assets/images/products/lavanda-mini.webp", uid: "KIT01-kit" }
      ]
    },
    {
      id: "KIT02",
      nome: "Kit 10 Mini Velas",
      slug: "kit-10-mini-velas",
      categoria: "kits",
      tags: ["novidades"],
      familia: "Lembrancinhas · 10x 30 g",
      cor: "var(--verbena)",
      hexCor: "#8EA487",
      codigo: "KIT02",
      badge: "Lembrancinhas",
      nota: "Conjunto de 10 mini velas artesanais de 30 g para presentear ou eventos.",
      descricao: "Conjunto de 10 mini velas artesanais de 30 g para presentear convidados especiais, padrinhos ou celebrações íntimas.",
      imagem: "../assets/images/products/verbena-mini.webp",
      tamanhos: [
        { tipo: "Kit", peso: "10x 30 g", queima: "≈ 200 h total", preco: 369.0, imagem: "../assets/images/products/verbena-mini.webp", uid: "KIT02-kit" }
      ]
    },
    {
      id: "KIT03",
      nome: "Kit 50 Mini Velas",
      slug: "kit-50-mini-velas",
      categoria: "kits",
      tags: ["novidades"],
      familia: "Eventos & Casamentos · 50x 30 g",
      cor: "var(--blue-ocean)",
      hexCor: "#6E8797",
      codigo: "KIT03",
      badge: "Eventos",
      nota: "Lote de 50 mini velas artesanais de 30 g para casamentos e festas.",
      descricao: "Lote de 50 mini velas artesanais de 30 g para casamentos, festas e celebrações corporativas com rótulo personalizado.",
      imagem: "../assets/images/products/alfazema-mini.webp",
      tamanhos: [
        { tipo: "Kit", peso: "50x 30 g", queima: "≈ 1000 h total", preco: 1690.0, imagem: "../assets/images/products/alfazema-mini.webp", uid: "KIT03-kit" }
      ]
    }
  ],
  aromatizadores: [
    {
      id: "ARO1",
      nome: "Difusor de Varetas Alfazema",
      slug: "difusor-alfazema",
      categoria: "aromatizadores",
      tags: ["rituais"],
      familia: "Herbal Fresco · 100 ml",
      cor: "var(--alfazema)",
      hexCor: "#8FA2A6",
      codigo: "ARO1",
      badge: "Em breve",
      emBreve: true,
      nota: "Frasco âmbar e varetas de bambu para difusão contínua por até 60 dias.",
      descricao: "Vidro âmbar e varetas de bambu, ~60 dias de difusão contínua com notas de Alfazema.",
      imagem: "../assets/images/products/difusor-alfazema.webp",
      tamanhos: [
        { tipo: "Único", peso: "100 ml", queima: "≈ 60 dias", preco: 89.9, imagem: "../assets/images/products/difusor-alfazema.webp", uid: "ARO1-padrao" }
      ]
    },
    {
      id: "ARO2",
      nome: "Difusor de Varetas Lavanda",
      slug: "difusor-lavanda",
      categoria: "aromatizadores",
      tags: ["rituais"],
      familia: "Herbal Floral · 100 ml",
      cor: "var(--lavanda)",
      hexCor: "#8A7F9D",
      codigo: "ARO2",
      badge: "Em breve",
      emBreve: true,
      nota: "Lavanda francesa em versão difusor contínuo por até 60 dias.",
      descricao: "Vidro âmbar e varetas de bambu, ~60 dias de perfume relaxante de Lavanda.",
      imagem: "../assets/images/products/difusor-lavanda.webp",
      tamanhos: [
        { tipo: "Único", peso: "100 ml", queima: "≈ 60 dias", preco: 89.9, imagem: "../assets/images/products/difusor-lavanda.webp", uid: "ARO2-padrao" }
      ]
    },
    {
      id: "ARO3",
      nome: "Sachê para Gavetas & Armários",
      slug: "sache-guarda-roupa",
      categoria: "aromatizadores",
      tags: ["rituais"],
      familia: "Floral Amadeirado",
      cor: "var(--mamae)",
      hexCor: "#BFC2BC",
      codigo: "ARO3",
      badge: "Em breve",
      emBreve: true,
      nota: "Par de sachês de algodão para perfumar roupas e lençóis por até 90 dias.",
      descricao: "Par de sachês de algodão com essência concentrada para perfumar gavetas, closets e malas.",
      imagem: "../assets/images/products/sache-guarda-roupa.webp",
      tamanhos: [
        { tipo: "Dupla", peso: "30 g cada", queima: "≈ 90 dias", preco: 24.9, imagem: "../assets/images/products/sache-guarda-roupa.webp", uid: "ARO3-padrao" }
      ]
    }
  ],
  acessorios: [
    {
      id: "ACC2",
      nome: "Cortador de Pavio em Aço Dourado",
      slug: "cortador-pavio",
      categoria: "acessorios",
      tags: ["rituais"],
      familia: "Cuidados da Vela",
      cor: "var(--gold)",
      hexCor: "#B79C6B",
      codigo: "ACC2",
      badge: "Em breve",
      emBreve: true,
      nota: "Cortador em aço inoxidável com acabamento dourado fosco para chama limpa.",
      descricao: "Cortador em aço com acabamento dourado fosco com coletor para manter a chama no tamanho ideal e a queima perfeita.",
      imagem: "../assets/images/products/cortador-pavio.webp",
      tamanhos: [
        { tipo: "Único", peso: "60 g", queima: "—", preco: 16.9, imagem: "../assets/images/products/cortador-pavio.webp", uid: "ACC2-padrao" }
      ]
    },
    {
      id: "ACC1",
      nome: "Kit Fósforos Longos Decorativos",
      slug: "kit-fosforos",
      categoria: "acessorios",
      tags: ["rituais"],
      familia: "Ritual & Decoração",
      cor: "var(--cravo)",
      hexCor: "#A96F4E",
      codigo: "ACC1",
      badge: "Em breve",
      emBreve: true,
      nota: "Fósforos longos com cabeça colorida em elegante frasco com riscador.",
      descricao: "Fósforos em madeira reflorestada de haste longa em garrafa decorativa de vidro com riscador integrado.",
      imagem: "../assets/images/products/kit-fosforos.webp",
      tamanhos: [
        { tipo: "Único", peso: "45 g", queima: "60 palitos", preco: 18.9, imagem: "../assets/images/products/kit-fosforos.webp", uid: "ACC1-padrao" }
      ]
    }
  ],
  complementos: [
    {
      id: "ARO1",
      uid: "ARO1-padrao",
      nome: "Difusor de Varetas Alfazema",
      descricao: "Vidro âmbar e varetas de rattan, ~60 dias de difusão contínua com notas de Alfazema.",
      preco: 89.9,
      imagem: "../assets/images/products/difusor-alfazema.webp"
    },
    {
      id: "ARO2",
      uid: "ARO2-padrao",
      nome: "Difusor de Varetas Lavanda",
      descricao: "Vidro âmbar e varetas de rattan, ~60 dias de perfume relaxante de Lavanda.",
      preco: 89.9,
      imagem: "../assets/images/products/difusor-lavanda.webp"
    },
    {
      id: "ARO3",
      uid: "ARO3-padrao",
      nome: "Sachê para Gavetas & Armários",
      descricao: "Par de sachês de algodão com essência concentrada para perfumar roupas e lençóis.",
      preco: 24.9,
      imagem: "../assets/images/products/sache-guarda-roupa.webp"
    },
    {
      id: "ACC1",
      uid: "ACC1-padrao",
      nome: "Kit Fósforos Longos Decorativos",
      descricao: "Fósforos longos com cabeça colorida em elegante frasco de vidro com lixa acendedora.",
      preco: 18.9,
      imagem: "../assets/images/products/kit-fosforos.webp"
    },
    {
      id: "ACC2",
      uid: "ACC2-padrao",
      nome: "Cortador de Pavio em Aço Dourado",
      descricao: "Cortador em aço com acabamento dourado fosco para manter a chama limpa e a queima perfeita.",
      preco: 16.9,
      imagem: "../assets/images/products/cortador-pavio.webp"
    }
  ]
};

// Compute flat list of all products
FALLBACK_DATA.produtos = [
  ...FALLBACK_DATA.velas,
  ...FALLBACK_DATA.kits,
  ...FALLBACK_DATA.aromatizadores,
  ...FALLBACK_DATA.acessorios
];

export function resolveImagePath(p) {
  if (!p) return p;
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) return p;
  return p.replace(/^(\.\.\/)+/, '').replace(/^(\.\/)+/, '');
}

export async function loadCatalog() {
  const possiblePaths = ['./assets/data/produtos.json', '../assets/data/produtos.json', 'assets/data/produtos.json'];
  for (const p of possiblePaths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        const json = await res.json();
        return mergeCatalogData(json);
      }
    } catch (_) {}
  }
  return FALLBACK_DATA;
}

function normalizeCategoryProducts(catProducts, categoryKey) {
  if (!Array.isArray(catProducts)) return [];
  return catProducts.map(p => {
    const defaultCor = `var(--${p.slug || 'gold'})`;
    return {
      id: p.id,
      nome: p.nome,
      slug: p.slug,
      categoria: categoryKey,
      tags: Array.isArray(p.tags) ? p.tags : [],
      familia: p.familiaOlfativa || 'Fragrância Autoral',
      cor: p.corExclusiva || defaultCor,
      hexCor: p.corExclusiva || '#B79C6B',
      codigo: p.id,
      badge: p.badge || '',
      esgotado: Boolean(p.esgotado || (p.badge && p.badge.toLowerCase().includes('esgotado'))),
      emBreve: Boolean(p.emBreve || (p.badge && p.badge.toLowerCase().includes('breve'))),
      nota: p.descricao ? p.descricao.split('.')[0] + '.' : '',
      descricao: p.descricao || '',
      imagem: resolveImagePath(p.imagem),
      tamanhos: (p.tamanhos || []).map(t => ({
        tipo: t.tipo,
        peso: t.peso,
        queima: t.queima ? (t.queima.includes('≈') || t.queima === '—' ? t.queima : `≈ ${t.queima}`) : '',
        preco: t.preco,
        imagem: resolveImagePath(t.imagem || p.imagem),
        uid: `${p.id}-${(t.tipo || 'padrao').toLowerCase()}`
      }))
    };
  });
}

function mergeCatalogData(json) {
  const data = { ...FALLBACK_DATA };

  if (json.meta) data.meta = { ...data.meta, ...json.meta };
  if (json.heroConfig) data.heroConfig = { ...data.heroConfig, ...json.heroConfig };
  if (json.pilares) data.pilares = json.pilares;
  if (json.homeFeatured) data.homeFeatured = json.homeFeatured;
  if (json.colecaoConfig) data.colecaoConfig = { ...data.colecaoConfig, ...json.colecaoConfig };
  if (json.complementosConfig) data.complementosConfig = { ...data.complementosConfig, ...json.complementosConfig };
  if (json.atelie) {
    data.atelie = {
      ...data.atelie,
      ...json.atelie,
      imagensAleatorias: json.atelie.imagensAleatorias
        ? json.atelie.imagensAleatorias.map(img => resolveImagePath(img))
        : data.atelie.imagensAleatorias
    };
  }
  if (json.comoPedir) data.comoPedir = { ...data.comoPedir, ...json.comoPedir };

  // If categorias are defined in json, map each category
  if (json.categorias && json.categorias.length > 0) {
    const velasCat = json.categorias.find(c => c.id === 'velas-aromaticas' || c.id === 'velas');
    if (velasCat && velasCat.produtos) {
      data.velas = normalizeCategoryProducts(velasCat.produtos, 'velas');
    }

    const kitsCat = json.categorias.find(c => c.id === 'kits');
    if (kitsCat && kitsCat.produtos) {
      data.kits = normalizeCategoryProducts(kitsCat.produtos, 'kits');
    }

    const aroCat = json.categorias.find(c => c.id === 'aromatizadores');
    if (aroCat && aroCat.produtos) {
      data.aromatizadores = normalizeCategoryProducts(aroCat.produtos, 'aromatizadores');
    }

    const accCat = json.categorias.find(c => c.id === 'acessorios');
    if (accCat && accCat.produtos) {
      data.acessorios = normalizeCategoryProducts(accCat.produtos, 'acessorios');
    }

    data.produtos = [
      ...(data.velas || []),
      ...(data.kits || []),
      ...(data.aromatizadores || []),
      ...(data.acessorios || [])
    ];
  }

  return data;
}
