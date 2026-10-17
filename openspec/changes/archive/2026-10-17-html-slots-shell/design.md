# Design: html-slots-shell

## Context

A change `add-page-template` (concluída) e a `flutter-style-templates` (em
andamento) estabeleceram o padrão de página: `MainTemplate` → `PageTemplate` →
Feature, com `Router` instanciando a feature e montando no container de rota.
O shell da aplicação, porém, continua no modelo antigo: `index.html` tem um
`<div id="app"></div>` vazio, e a classe `App` compõe header + sidebar via
concatenação de templates `.raw`, injetando tudo com `innerHTML` pelo
`Renderer`. O `Sidebar` é classe própria, mas `setActiveItem` re-renderiza o
menu inteiro (`menuList.innerHTML = ...`) a cada navegação — destruindo o
estado de submenu aberto e refletindo o modelo de injeção problemático
(objeto → string → `innerHTML` → DOM sem vínculo com a instância).

Convenções vigentes: markup em `templates/*.raw` com imports `?raw` em
satélites; motor `Template` (interpolação `{{chave}}` em uma passada, sem
escape); `sidebar.items.js` como fonte única de rotas (alimenta menu e
Router); classes de componente com padrão instanciável.

## Goals / Non-Goals

**Goals:**
- `index.html` declara os slots fixos do shell (`#header`, `#sidebar`,
  `#content`); o browser compõe a estrutura na carga, sem JS de composição.
- `App` e `Renderer` removidos; bootstrap direto em `src/main.js`.
- `Header` como classe de comportamento puro sobre markup estático no HTML.
- `Sidebar` monta menu data-driven no slot `#sidebar`; `setActiveItem` vira
  toggle de classe, sem re-render.
- `Router` monta features em `#content` e chama `destruir()` opt-in na troca
  de rota.

**Non-Goals:**
- Lifecycle completo de features (destroy obrigatório, estado entre
  navegações) — apenas o hook opt-in `destruir()`.
- Reatividade / state management.
- Migrar o markup interno do menu para HTML estático (menu permanece
  data-driven).
- Alterar o contrato de features da `flutter-style-templates`
  (`renderContent()` segue valendo; mudança futura para setores-objeto fica
  para outra change).

## Decisions

1. **Slots fixos no `index.html`, sem `<template>` ni JS de composição** — a
   estrutura do shell (`#app > #header + #sidebar + #content`, com as classes
   de layout Tabler que o CSS espera) vive no HTML e é parseada uma única vez
   pelo browser. Alternativa (slots vazios com `<template>` e clone via JS)
   foi descartada: reintroduziria JS para uma composição que o próprio HTML
   já faz nativamente.

2. **Header com markup estático no HTML, classe só de comportamento** — o
   header não tem fonte de dados; seu markup (navbar, toggle, brand, search,
   theme toggle) é fixo e muda pouco. A classe `Header` apenas amarra eventos
   nos elementos existentes (theme toggle, sidebar toggle, busca). O
   `templates/header.raw` é removido. Alternativa (Header injeta markup no
   slot, como o Sidebar) foi descartada: simetria sem benefício — só
   adicionaria injeção onde não há necessidade de dados.

3. **Sidebar permanece data-driven, montando no slot `#sidebar`** —
   `sidebar.items.js` é confirmado como fonte única das rotas e do menu
   (alimenta `Router.resolveRoute` e a renderização do menu). O markup do
   menu NÃO vai para o `index.html` (evitaria duplicação da fonte de
   verdade). `sidebar.raw` é removido; o menu é montado pela classe no slot.

4. **`setActiveItem(id)` vira toggle de classe nos nós existentes** — em vez
   de `renderMenu()` completo, o Sidebar localiza o item atual e o novo pelos
   `data-id`, alterna `.active` diretamente. Elimina o bug do submenu aberto
   colapsando após navegação e remove um dos pontos de `innerHTML`. A
   renderização do menu acontece uma única vez, no `mount()`.

5. **`#content` substitui `#route-container`** — nome de slot coerente com o
   modelo (`#header`, `#sidebar`, `#content`); o `Router` recebe o seletor no
   construtor, então a troca é isolada ao bootstrap e ao próprio Router.

6. **`destruir()` opt-in via `feature?.destruir?.()`** — na troca de rota, o
   Router tenta chamar `destruir()` na feature atual antes de montar a nova.
   Sem contrato obrigatório, sem framework de lifecycle: features sem
   listeners/timers não implementam nada. Alternativa (destruir obrigatório
   com contrato explícito) foi descartada por ser overkill para o estágio
   atual — nenhuma feature tem estado a limpar hoje.

7. **`App` e `Renderer` removidos por completo** — não são repurposeados nem
   deixados como casca. O bootstrap em `main.js` instancia os setores
   diretamente. Alternativa (manter `App` só orquestrando instâncias) foi
   descartada: uma classe cujo único papel é `new Header(); new Sidebar()`
   é indireção sem valor.

8. **Remoção do `card.raw`** — importado em `app.templates.js` e nunca
   renderizado em lugar nenhum (resíduo). Com a remoção do satélite do app,
   o arquivo morre junto.

9. **Sequência: implementar após `flutter-style-templates`** — o bootstrap
   novo depende do contrato de feature (classe + `mount()`) que a
   `flutter-style-templates` estabelece. Ela deve ser concluída e arquivada
   antes desta change.

## Risks / Trade-offs

- [Markup do header/sidebar pode perder classes de layout ao ser migrado do
  `.raw` para o `index.html`/slot] → copiar o markup fielmente e validar
  visualmente (QA no browser, light e dark) antes de deletar os `.raw`.
- [Mudança breaking: imports de `App`/`Renderer` quebram] → o único
  importador é `src/main.js`; remoção é atomic change no mesmo commit.
- [`destruir()` opt-in pode ser esquecido quando uma feature ganhar
  listeners] → documentado no design; verificação manual no QA de
  navegação; contrato obrigatório fica para a futura change de setores.
- [Duas deltas para `app-rendering` em changes abertas (`flutter-style` e
  esta)] → a delta da `flutter-style` generaliza satélites; esta remove
  `Renderer`/`App` e o satélite do app. Os blocos se sobrevivem sem conflito
  de requisito, mas o archive deve ocorrer em ordem (flutter primeiro).
