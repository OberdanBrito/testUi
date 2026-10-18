# Capability: page-header

## Purpose

Define o objeto `PageHeader`: uma classe criada pelo `MainTemplate` durante o `mount()`, com uma zona identidade (breadcrumb, pretitle, título, subtítulo, ícone) preenchida automaticamente a partir do route e uma zona ações comandada pela feature via `renderHeader()`. A feature não tem responsabilidade sobre o PageHeader.

## Requirements

### Requirement: PageHeader é um objeto criado durante o mount com duas zonas
O sistema MUST prover uma classe `PageHeader` em `src/js/components/templates/PageHeader.js` que é instanciada pelo `MainTemplate` durante o `mount()`. O objeto SHALL conter uma **zona identidade** (breadcrumb, pretitle, título, subtítulo, ícone) preenchida a partir do route, e uma **zona ações** (slot vazio) que a feature preenche. O `PageHeader` SHALL ser criado pelo template, nunca pela feature.

#### Scenario: PageHeader criado no mount
- **WHEN** `MainTemplate.mount(container, route)` é executado
- **THEN** uma instância de `PageHeader` é criada com o route, a zona identidade é preenchida, e a instância é exposta em `this.header` do template

#### Scenario: Feature não instancia PageHeader
- **WHEN** uma feature é renderizada
- **THEN** a feature não cria nem recebe PageHeader via injeção — acessa `this.header` (já populado) apenas se precisar

### Requirement: A zona identidade deve ser preenchida a partir do route
A zona identidade do `PageHeader` MUST ser preenchida automaticamente a partir dos dados do route (resolvido de `sidebar.items.js`), sem intervenção da feature. O título SHALL vir de `route.label`, o subtítulo de `route.subtitle`, e o ícone de `route.icon`.

#### Scenario: Identidade preenchida do route
- **WHEN** o route tem `label: 'Inventory'`, `subtitle: 'Stock levels'`, `icon: 'inventory'`
- **THEN** a zona identidade exibe 'Inventory' como título, 'Stock levels' como subtítulo, e o ícone 'inventory'

#### Scenario: Identidade independente da feature
- **WHEN** a feature não define título nem subtítulo em nenhum lugar
- **THEN** a zona identidade ainda é preenchida corretamente a partir do route

### Requirement: O breadcrumb deve ser derivado da hierarquia de rotas
O `PageHeader` SHALL derivar o breadcrumb a partir do `parent_id` do route em `sidebar.items.js`. Para rotas com pai, o breadcrumb SHALL conter o `label` do pai seguido do `label` do item atual. Para rotas raiz (`parent_id: null`), o breadcrumb SHALL ser omitido.

#### Scenario: Rota com pai
- **WHEN** o route tem `path: '/products/inventory'`, `parent_id: 8` (que aponta para item com `label: 'Products'`)
- **THEN** o breadcrumb exibe "Products > Inventory"

#### Scenario: Rota raiz
- **WHEN** o route tem `parent_id: null`
- **THEN** nenhum breadcrumb é renderizado

### Requirement: O pretitle deve ser o label do item pai
O pretitle da zona identidade SHALL ser o `label` do item pai (via `parent_id`). Para rotas raiz, o pretitle SHALL ser omitido (elemento vazio ou ausente).

#### Scenario: Sub-rota com pretitle
- **WHEN** o route é `/products/inventory` com pai `label: 'Products'`
- **THEN** o pretitle exibe "Products"

#### Scenario: Rota raiz sem pretitle
- **WHEN** o route é `/dashboard` com `parent_id: null`
- **THEN** nenhum pretitle é renderizado

### Requirement: A zona ações é um slot comandado pela feature
A zona ações do `PageHeader` MUST ser um slot DOM vazio no scaffold. O `MainTemplate` SHALL injetar o retorno de `renderHeader()` da feature nessa zona via `setActions(html)`. Se a feature não implementar `renderHeader()`, a zona ações SHALL permanecer vazia sem erro.

#### Scenario: Feature com ações
- **WHEN** uma feature implementa `renderHeader()` devolvendo `<button>New</button>`
- **THEN** a zona ações contém o botão renderizado

#### Scenario: Feature sem ações
- **WHEN** uma feature não implementa `renderHeader()`
- **THEN** a zona ações permanece vazia e nenhum erro é lançado

### Requirement: A feature não tem responsabilidade sobre o PageHeader
A feature MUST não instanciar, configurar ou gerenciar o `PageHeader`. A feature SHALL apenas devolver HTML quando chamada (`renderHeader()` para zona ações, `renderContent()` para corpo). O `MainTemplate` é o único responsável por orquestrar o `PageHeader` e injetar conteúdo nos lugares corretos.

#### Scenario: Feature retorna HTML puro
- **WHEN** `renderHeader()` é chamado na feature
- **THEN** a feature devolve uma string HTML sem referenciar PageHeader, sem acessar slots, sem manipular DOM do header

#### Scenario: Composição de features
- **WHEN** uma feature instancia outra feature internamente (ex: widget)
- **THEN** a sub-feature funciona normalmente pois seu constructor não depende de route nem de PageHeader
