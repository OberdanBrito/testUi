## Why

A zona superior da tela (breadcrumb, pretitle, título, subtítulo, ícone) hoje é hardcoded no constructor de cada feature via `super({ title, subtitle })`, duplicando dados que já existem em `sidebar.items.js` — e divergindo (ex: subtitle do sidebar é "Overview of your activity at a glance" mas a feature escreve "Overview and insights"). Além disso, a zona superior precisa no futuro acomodar botões à direita (padrão tabler.io), e essa é responsabilidade da feature — não do registro de rotas. A separação de responsabilidades está errada: identidade da página vive em `sidebar.items.js`, ações da página são da feature, e nenhum dos dois deveria estar no constructor.

## What Changes

- **BREAKING**: `MainTemplate.mount(container)` passa a ser `mount(container, route)` — o route (resolvido pelo Router a partir de `sidebar.items.js`) é repassado na montagem.
- **BREAKING**: título e subtítulo deixam de ser definidos no constructor da feature via `super({ title, subtitle })` e passam a vir do route (`label`, `subtitle` de `sidebar.items.js`).
- Novo objeto `PageHeader`, criado durante o `mount()` pelo `MainTemplate`, com duas zonas: **zona identidade** (breadcrumb, pretitle, título, subtítulo, ícone — preenchida automaticamente a partir do route) e **zona ações** (slot vazio que a feature preenche).
- `MainTemplate` passa a expor `this.route` e `this.header` na instância — tudo disponível quando a feature é chamada para renderizar, sem injeção de dependência.
- Nova opcional `renderHeader()` na feature — devolve HTML para a zona de ações. Se não implementada, zona de ações fica vazia.
- O constructor da feature passa a ser apenas `super()` — wiring puro, sem lógica, permitindo composição (feature instanciando feature) sem conflito de contexto.
- `Router.renderRoute` passa a chamar `mount(this.container, route)`.

## Capabilities

### New Capabilities
- `page-header`: objeto PageHeader com zona identidade (derivada do route/sidebar.items.js) e zona ações (comandada pela feature), criado no mount e exposto via `this.header`.

### Modified Capabilities
- `page-rendering`: título/subtítulo vêm do route, não do constructor da feature; `mount` recebe route.
- `template-inheritance`: `mount(container, route)` na classe base; `MainTemplate` cria e gerencia o `PageHeader`; expõe `this.route` e `this.header`.
- `feature-template-selection`: constructor da feature é apenas `super()`; `renderHeader()` é opcional; Router chama `mount(container, route)`.

## Impact

- `src/js/components/templates/MainTemplate.js` — assinatura de `mount`, criação do PageHeader, expõe route/header.
- `src/js/components/templates/PageTemplate.js` — `render()` usa route em vez de `this.title/this.subtitle`; implementa `findHeaderSlot()`.
- `src/js/components/templates/PageHeader.js` — novo arquivo.
- `src/js/components/templates/page.raw` — scaffold ganha estrutura de zona identidade + zona ações.
- `src/js/router.js` — `renderRoute` repassa `route` para `mount`.
- `src/js/features/**` — constructors simplificados para `super()`; remoção de `title/subtitle` hardcoded; adição opcional de `renderHeader()`.
- `src/js/components/sidebar/sidebar.items.js` — vira fonte definitiva de título/subtítulo (sem mudança de estrutura).
- Specs: `page-rendering`, `template-inheritance`, `feature-template-selection` (delta); novo `page-header`.
