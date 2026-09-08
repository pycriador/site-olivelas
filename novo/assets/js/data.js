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
    subtitulo: "Cada fragrância vem em dois tamanhos: Mini de 40 g, para experimentar, e Padrão de 230 g, em copo de vidro.",
    notaCatalogo: "Todas as velas acompanham instruções de primeiro uso para máxima durabilidade e difusão.",
    fineprint: "Preços válidos para pedidos combinados diretamente com o ateliê",
    colecoesDisponiveis: [
      { id: "todas", nome: "Todos os aromas", filtro: "todos" },
      { id: "frutal", nome: "Frutais", filtro: "Frutal" },
      { id: "floral", nome: "Florais", filtro: "Floral" },
      { id: "amadeirada", nome: "Amadeirados", filtro: "Amadeirada" },
      { id: "oriental", nome: "Orientais", filtro: "Oriental" },
      { id: "herbal", nome: "Herbais", filtro: "Herbal" }
    ],
    velasAtivas: ["OV01", "OV02", "OV03", "OV04", "OV05", "OV06", "OV07", "OV08", "OV09"]
  },
  complementosConfig: {
    eyebrow: "Para completar o ambiente",
    titulo: "Linhas complementares",
    subtitulo: "Aromatizadores, sachês e acessórios para o cuidado das suas velas."
  },
  atelie: {
    eyebrow: "O ateliê",
    titulo: "Feita à mão, em pequenos lotes",
    descricao: "A Olivelas nasce em São Paulo, com produção artesanal cuidadosa. Cada vela é derramada à mão, em pequenos lotes, com cera 100% vegetal, pavio de algodão puro e essências de alta performance que preenchem o ambiente com sutileza e requinte.",
    especificacoes: "230 g · copo de vidro com tampa dourada · cera vegetal · pavio de algodão",
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
        descricao: "Nossos aromas autorais em versões Mini (40 g) ou Padrão (230 g com tampa dourada)."
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
      familia: "Frutal Verde",
      cor: "var(--verbena)",
      hexCor: "#8EA487",
      codigo: "OV01",
      badge: "Mais vendido",
      nota: "Folhas verdes e um fundo cítrico para as manhãs de casa aberta.",
      descricao: "Notas frescas e verdes que remetem a jardins ensolarados, com equilíbrio perfeito entre cítricos suaves e folhas frescas de verbena.",
      imagem: "../assets/images/products/verbena.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 42.9, imagem: "../assets/images/products/verbena-mini.webp", uid: "OV01-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 92.9, imagem: "../assets/images/products/verbena.webp", uid: "OV01-padrao" }
      ]
    },
    {
      id: "OV02",
      nome: "Blue Ocean",
      slug: "blue-ocean",
      familia: "Floral Frutal",
      cor: "var(--blue-ocean)",
      hexCor: "#6E8797",
      codigo: "OV02",
      badge: "",
      nota: "Brisa marinha limpa e suave, para desacelerar o ritmo do dia.",
      descricao: "Frescor aquático revigorante que evoca brisa marinha e amplitude. Florais delicados sobre um fundo leve, limpo e sofisticado.",
      imagem: "../assets/images/products/blue-ocean.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 44.9, imagem: "../assets/images/products/blue-ocean-mini.webp", uid: "OV02-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 95.9, imagem: "../assets/images/products/blue-ocean.webp", uid: "OV02-padrao" }
      ]
    },
    {
      id: "OV03",
      nome: "Morango & Champanhe",
      slug: "morango-champanhe",
      familia: "Oriental Gourmand",
      cor: "var(--morango)",
      hexCor: "#C49A90",
      codigo: "OV03",
      badge: "Novo",
      nota: "Frutas vermelhas e brinde festivo — o perfume dos encontros.",
      descricao: "Doçura frutada com um toque sofisticado e festivo. Morango maduro, efervescência de champanhe e um final delicadamente adocicado.",
      imagem: "../assets/images/products/morango-champanhe.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 42.9, imagem: "../assets/images/products/morango-champanhe-mini.webp", uid: "OV03-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 93.9, imagem: "../assets/images/products/morango-champanhe.webp", uid: "OV03-padrao" }
      ]
    },
    {
      id: "OV04",
      nome: "Mística",
      slug: "mistica",
      familia: "Amadeirada Especiada",
      cor: "var(--mistica)",
      hexCor: "#525C67",
      codigo: "OV04",
      badge: "Assinatura",
      nota: "Madeiras nobres e resinas que convidam ao silêncio e à leitura.",
      descricao: "Composição envolvente de madeiras nobres, especiarias orientais e resinas ricas. Cria um clima acolhedor, introspectivo e de pura sofisticação.",
      imagem: "../assets/images/products/mistica.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 48.9, imagem: "../assets/images/products/mistica-mini.webp", uid: "OV04-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 98.9, imagem: "../assets/images/products/mistica.webp", uid: "OV04-padrao" }
      ]
    },
    {
      id: "OV05",
      nome: "Orquídea Negra",
      slug: "orquidea-negra",
      familia: "Floral Oriental",
      cor: "var(--orquidea)",
      hexCor: "#5B3645",
      codigo: "OV05",
      badge: "",
      nota: "Floral aveludado e misterioso para acender ao cair da tarde.",
      descricao: "Fragrância intensa e magnética. Notas florais ricas de orquídea negra combinadas com acordes orientais aveludados e calorosos.",
      imagem: "../assets/images/products/orquidea-negra.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 46.9, imagem: "../assets/images/products/orquidea-negra-mini.webp", uid: "OV05-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 99.9, imagem: "../assets/images/products/orquidea-negra.webp", uid: "OV05-padrao" }
      ]
    },
    {
      id: "OV06",
      nome: "Mamãe & Bebê",
      slug: "mamae-bebe",
      familia: "Floral Amadeirada Musk",
      cor: "var(--mamae)",
      hexCor: "#BFC2BC",
      codigo: "OV06",
      badge: "Acolhedor",
      nota: "Algodão e um amadeirado macio, para o quarto e os primeiros dias.",
      descricao: "Aconchego e ternura em forma de perfume. Toque aveludado de algodão, lavanda suave e notas de fundo confortáveis e carinhosas.",
      imagem: "../assets/images/products/mamae-bebe.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 41.9, imagem: "../assets/images/products/mamae-bebe-mini.webp", uid: "OV06-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 89.9, imagem: "../assets/images/products/mamae-bebe.webp", uid: "OV06-padrao" }
      ]
    },
    {
      id: "OV07",
      nome: "Cravo & Canela",
      slug: "cravo-canela",
      familia: "Oriental Especiada",
      cor: "var(--cravo)",
      hexCor: "#A96F4E",
      codigo: "OV07",
      badge: "",
      nota: "Especiaria quente de cozinha em festa — o cheiro de casa cheia.",
      descricao: "Calor e energia acolhedora. O equilíbrio clássico entre a intensidade aromática do cravo e a doçura picante da canela em pau.",
      imagem: "../assets/images/products/cravo-canela.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 42.9, imagem: "../assets/images/products/cravo-canela-mini.webp", uid: "OV07-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 91.9, imagem: "../assets/images/products/cravo-canela.webp", uid: "OV07-padrao" }
      ]
    },
    {
      id: "OV08",
      nome: "Lavanda Francesa",
      slug: "lavanda",
      familia: "Floral Aromática",
      cor: "var(--lavanda)",
      hexCor: "#8A7F9D",
      codigo: "OV08",
      badge: "Relaxante",
      nota: "Campos de lavanda em flor para rituais de descanso e bem-estar.",
      descricao: "Clássica e calmante, a lavanda francesa purifica a mente e cria um ambiente de serenidade profunda.",
      imagem: "../assets/images/products/lavanda.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 43.9, imagem: "../assets/images/products/lavanda-mini.webp", uid: "OV08-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 94.9, imagem: "../assets/images/products/lavanda.webp", uid: "OV08-padrao" }
      ]
    },
    {
      id: "OV09",
      nome: "Alfazema Provençal",
      slug: "alfazema",
      familia: "Herbal Fresca",
      cor: "var(--alfazema)",
      hexCor: "#8FA2A6",
      codigo: "OV09",
      badge: "Frescor",
      nota: "Notas herbais e aromáticas para purificar e renovar as energias.",
      descricao: "Fragrância leve e fresca que promove harmonia e clareza, perfeita para salas de estar e varandas.",
      imagem: "../assets/images/products/alfazema.webp",
      tamanhos: [
        { tipo: "Mini", peso: "40 g", queima: "≈ 20 h", preco: 42.9, imagem: "../assets/images/products/alfazema-mini.webp", uid: "OV09-mini" },
        { tipo: "Padrão", peso: "230 g", queima: "≈ 50 h", preco: 92.9, imagem: "../assets/images/products/alfazema.webp", uid: "OV09-padrao" }
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

export async function loadCatalog() {
  try {
    const res = await fetch('../assets/data/produtos.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const json = await res.json();
    return mergeCatalogData(json);
  } catch (err) {
    console.info('Using internal fallback catalog data:', err.message);
    return FALLBACK_DATA;
  }
}

function mergeCatalogData(json) {
  const data = { ...FALLBACK_DATA };

  if (json.meta) data.meta = { ...data.meta, ...json.meta };
  if (json.heroConfig) data.heroConfig = { ...data.heroConfig, ...json.heroConfig };
  if (json.pilares) data.pilares = json.pilares;
  if (json.colecaoConfig) data.colecaoConfig = { ...data.colecaoConfig, ...json.colecaoConfig };
  if (json.complementosConfig) data.complementosConfig = { ...data.complementosConfig, ...json.complementosConfig };
  if (json.atelie) {
    data.atelie = {
      ...data.atelie,
      ...json.atelie,
      imagensAleatorias: json.atelie.imagensAleatorias
        ? json.atelie.imagensAleatorias.map(img => img.startsWith('../') ? img : `../${img}`)
        : data.atelie.imagensAleatorias
    };
  }
  if (json.comoPedir) data.comoPedir = { ...data.comoPedir, ...json.comoPedir };

  // If categorias are defined in json, filter or map candles
  if (json.categorias && json.categorias.length > 0) {
    const velasCat = json.categorias.find(c => c.id === 'velas-aromaticas');
    if (velasCat && velasCat.produtos) {
      data.velas = velasCat.produtos.map(p => {
        const defaultCor = `var(--${p.slug || 'gold'})`;
        return {
          id: p.id,
          nome: p.nome,
          slug: p.slug,
          familia: p.familiaOlfativa || 'Fragrância Autoral',
          cor: p.corExclusiva || defaultCor,
          hexCor: p.corExclusiva || '#B79C6B',
          codigo: p.id,
          badge: p.badge || '',
          nota: p.descricao ? p.descricao.split('.')[0] + '.' : '',
          descricao: p.descricao || '',
          imagem: p.imagem.startsWith('../') ? p.imagem : `../${p.imagem}`,
          tamanhos: (p.tamanhos || []).map(t => ({
            tipo: t.tipo,
            peso: t.peso,
            queima: t.queima ? `≈ ${t.queima}` : '',
            preco: t.preco,
            imagem: t.imagem ? (t.imagem.startsWith('../') ? t.imagem : `../${t.imagem}`) : p.imagem,
            uid: `${p.id}-${t.tipo.toLowerCase()}`
          }))
        };
      });
    }
  }

  return data;
}
