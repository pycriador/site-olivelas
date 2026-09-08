# 6. Design System, Temas e Arquitetura CSS

[Anterior: Carrinho & Favoritos](cart-and-favorites.md) | [Voltar ao Índice](README.md) | [Próximo: Modal & Deep Linking](modal-and-routing.md)

---

## 6.1. Objetivo
Documentar a arquitetura CSS modular, a estratégia de tokens em dois níveis (`--brand-*` vs `--color-*`), o chaveamento limpo de tema claro/escuro e os padrões de componentes de interface.

---

## 6.2. Estrutura Modular dos Arquivos CSS

```
assets/css/
├── variables.css   # Tokens de marca, escala espacial, tipografia e paletas
├── style.css       # Reset CSS moderno, acessibilidade e classes utilitárias
├── layout.css      # Grid principal, header sticky, glassmorphism e footer
├── components.css  # Botões, cards, modal, badges, inputs e toasts
└── responsive.css  # Media queries e adaptações para mobile/tablet
```

---

## 6.3. Arquitetura de Tokens em Dois Níveis

O sistema separa estritamente os **Tokens de Marca** (injetados dinamicamente via JavaScript a partir de `produtos.json`) dos **Tokens Semânticos de Interface**:

```mermaid
graph TD
    JSON[produtos.json] -->|Injeta no :root| BRAND[--brand-ink: #1B1B1B<br/>--brand-accent: #B79C6B<br/>--brand-paper: #F7F4EF<br/>--brand-mist: #D8CCBC]
    
    BRAND --> LIGHT[:root[data-theme='light']]
    BRAND --> DARK[:root[data-theme='dark']]
    
    LIGHT -->|--color-bg: var(--brand-paper)| UI_LIGHT[Interface Clara]
    LIGHT -->|--color-surface: #FFFFFF| UI_LIGHT
    LIGHT -->|--color-text: var(--brand-ink)| UI_LIGHT
    
    DARK -->|--color-bg: #141311| UI_DARK[Interface Escura]
    DARK -->|--color-surface: #201E1A| UI_DARK
    DARK -->|--color-text: #F5F1E6| UI_DARK
```

---

## 6.4. Sistema de Logotipos Adaptativos por Tema

No HTML, ambos os logos convivem lado a lado, sendo controlados com especificidade zero-JS via CSS:

```html
<img class="brand-logo logo-light" src="assets/images/logo-light.svg" alt="OLIVELAS">
<img class="brand-logo logo-dark" src="assets/images/logo-dark.svg" alt="OLIVELAS">
```

```css
[data-theme="light"] .logo-dark { display: none !important; }
[data-theme="light"] .logo-light { display: inline-block !important; }

[data-theme="dark"] .logo-light { display: none !important; }
[data-theme="dark"] .logo-dark { display: inline-block !important; }
```

---

[Avançar para: 7. Modal & Deep Linking](modal-and-routing.md)
