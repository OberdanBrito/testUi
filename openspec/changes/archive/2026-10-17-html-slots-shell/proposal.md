# Proposal: html-slots-shell

## Why

Hoje o shell da aplicação (header + sidebar + container de rota) é **composto via
string** pelo `App` e injetado num único `#app` vazio pelo `Renderer` (`innerHTML`).
Isso faz o browser re-parsear o shell inteiro numa montagem que acontece uma única
vez, obriga o markup a viver em templates `.raw` concatenados em JS, e cria um
modelo de injeção (objeto → string → `innerHTML` → DOM novo sem vínculo) que se
provei problemático: o `Sidebar` re-renderiza o menu inteiro a cada navegação
(perdendo estado de submenu aberto) e setores futuros com comportamento próprio
não teriam como sobreviver à injeção. A composição do shell é trabalho do parser
do browser no `index.html`, não de JS — e o único ponto que precisa trocar em
tempo de execução é o container da página.

## What Changes

- `index.html` passa a declarar os **slots fixos** do shell: `#header`,
  `#sidebar` e `#content` (substituindo o `#app` vazio). O browser parseia essa
  estrutura na carga — composição do shell sem JS.
- **BREAKING**: classe `App` é removida — a orquestração de composição do shell
  via concatenação de templates não existe mais.
- **BREAKING**: classe `Renderer` é removida — não há mais injeção de shell via
  `innerHTML` num elemento raiz.
- `src/main.js` vira o bootstrap direto: instancia `Header`, `Sidebar` e
  `Router` apontando para `#content`.
- `Header` vira uma classe de **comportamento puro**: o markup do header passa a
  viver direto no `index.html` e a classe só amarra eventos (theme toggle,
  sidebar toggle, busca). Os arquivos `templates/header.raw` e
  `src/js/components/app/` são removidos.
- `Sidebar` monta seu menu (data-driven a partir de `sidebar.items.js`,
  mantido como fonte única das rotas) no slot `#sidebar`; `setActiveItem(id)`
  passa a ser **toggle de classe nos nós existentes** — sem re-render do menu,
  eliminando o colapso do submenu aberto após navegação.
- `Router` passa a montar features em `#content` (antes `#route-container`) e
  a chamar `feature?.destruir?.()` (opt-in, sem framework de lifecycle) na
  troca de rota, antes de montar a nova feature.

## Capabilities

### New Capabilities
- `html-slots`: o shell da aplicação é declarado como slots fixos no
  `index.html` e composto pelo parser do browser na carga; cada setor do shell
  é uma classe que preenche ou amarra comportamento ao seu slot; o container de
  conteúdo é o único slot trocado em runtime.

### Modified Capabilities
- `app-rendering`: os requisitos que definem `Renderer` como classe de
  injeção, `App` como compositor/orquestrador e os imports `?raw` de templates
  do shell centralizados em satélite são substituídos pelo modelo de slots em
  `index.html` com bootstrap direto no entrypoint.

## Impact

- Novos: slots `#header`, `#sidebar`, `#content` em `index.html`; markup do
  header estático no HTML; classe `Header` de comportamento.
- Alterados: `src/main.js` (bootstrap), `src/js/components/sidebar/sidebar.js`
  (mount no slot, `setActiveItem` via toggle de classe), `src/js/router.js`
  (container `#content`, `destruir()` opt-in).
- Removidos: `src/js/components/app/` (`app.js`, `renderer.js`,
  `app.templates.js`), `templates/header.raw`, e o `card.raw` (importado e
  nunca usado — resíduo).
- Mantidos: `sidebar.items.js` (fonte única das rotas e do menu),
  `MainTemplate`/`PageTemplate`/features (change `flutter-style-templates`,
  pré-requisito), motor `Template` para interpolação de conteúdo.
- **BREAKING**: `App` e `Renderer` deixam de existir; qualquer import delas
  quebra.
- Pré-requisito de sequência: change `flutter-style-templates` deve estar
  concluída e arquivada antes da implementação desta.
