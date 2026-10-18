# Capability: page-rendering (delta)

## MODIFIED Requirements

### Requirement: As telas de recurso devem usar o template de tela principal
O sistema MUST renderizar toda rota-folha dentro de um template de tela principal. A escolha do template específico (PageTemplate, GridTemplate, FullWidthTemplate, etc.) SHALL ser feita pela feature via herança de classe, não pelo Router. Cada feature extende um template base que define o scaffold (container, header com zona identidade e zona ações, slot de conteúdo), e o template deve replicar o padrão de design visual do app, de modo que a experiência seja padronizada entre as telas que usam o mesmo template.

#### Scenario: Renderização de uma rota com feature
- **WHEN** o `Router` navega para uma rota-folha com feature associada
- **THEN** o Router instancia a feature, chama `mount(container, route)`, e a feature (via herança de template) renderiza o scaffold com a zona identidade preenchida a partir do route e o conteúdo da feature (HTML devolvido por `renderContent()` ou widget montado no slot) no corpo da tela

#### Scenario: Renderização de uma rota sem feature
- **WHEN** o `Router` navega para uma rota-folha sem feature associada
- **THEN** o Router exibe um placeholder simples sem scaffold de template (comportamento a definir na implementação)

### Requirement: O título e o subtítulo devem vir do route (sidebar.items.js)
O título e o subtítulo da tela principal MUST vir do route resolvido pelo Router a partir de `sidebar.items.js` (`label` e `subtitle`). A feature SHALL NÃO definir título/subtítulo no constructor. `sidebar.items.js` é a fonte definitiva de identidade da rota. O `PageHeader` (criado no mount) SHALL preencher a zona identidade a partir do route, sem intervenção da feature.

#### Scenario: Título e subtítulo do route
- **WHEN** o route tem `label: 'Dashboard'` e `subtitle: 'Overview of your activity at a glance'`
- **THEN** a tela principal exibe esses valores, vindos de `sidebar.items.js`

#### Scenario: Feature sem título hardcoded
- **WHEN** uma feature é criada com `super()` sem argumentos
- **THEN** a tela ainda renderiza título e subtítulo corretamente, pois vêm do route

### Requirement: O objeto da tela principal deve morar na pasta de templates
Os templates base (MainTemplate, PageTemplate, GridTemplate, etc.) MUST existir como classes em `src/js/components/templates/` com markup em arquivos `.raw` importados via satélite. O `PageHeader` SHALL existir como classe em `src/js/components/templates/PageHeader.js`. O Page existente em `src/js/components/page/` SHALL ser refactorado para `PageTemplate` que estende `MainTemplate`. A montagem do DOM SHALL ser feita pelo método `mount()` herdado de `MainTemplate`, e o conteúdo SHALL ser injetado via DOM no slot, sem passar pelo motor de interpolação. O `GridTemplate` SHALL ter seu markup em `templates/grid.raw` importado via satélite `grid.imports.js` na mesma pasta.

#### Scenario: Instanciação de PageTemplate
- **WHEN** uma feature extende `PageTemplate` e é montada com `mount(container, route)`
- **THEN** o HTML resultante contém o scaffold de página com a zona identidade preenchida pelo PageHeader e um slot de conteúdo preenchido por `renderContent()`

#### Scenario: Instanciação de GridTemplate
- **WHEN** uma feature extende `GridTemplate` e é montada com `mount(container, route)`
- **THEN** o HTML resultante contém o scaffold de grid com a zona identidade preenchida pelo PageHeader e o container `.grid-container` presente

#### Scenario: Injeção de conteúdo com marcadores de interpolação
- **WHEN** o conteúdo devolvido por `renderContent()` contém a sequência `{{qualquer}}`
- **THEN** essa sequência aparece literalmente no slot, sem ser interpretada pelo motor `Template`

### Requirement: O contrato de recurso deve ser classe que extende template
Toda feature associada a uma rota MUST ser uma classe JavaScript que extende um template base (ex: `PageTemplate`, `GridTemplate`) e implementa `renderContent()` — devolvendo o HTML do conteúdo da tela (caminho HTML string) ou recebendo o slot para montar widgets (caminho widget). O constructor da feature SHALL ser apenas `super()` — wiring puro, sem lógica, sem definição de título/subtítulo. A feature PODE implementar `renderHeader()` opcionalmente para preencher a zona ações do header. O `Router` SHALL instanciar a feature e chamar `mount(container, route)`, deixando a feature carregar seu template via herança.

#### Scenario: Feature válida com herança de template
- **WHEN** uma rota tem `feature` apontando para uma classe que estende `PageTemplate` e implementa `renderContent()`
- **THEN** o Router instancia a feature, chama `mount(container, route)`, e a tela exibe o scaffold do template com o conteúdo de `renderContent()`

#### Scenario: Feature de grid montando widget
- **WHEN** uma rota tem `feature` apontando para uma classe que estende `GridTemplate` e implementa `renderGridConfig()`
- **THEN** o `GridTemplate` instancia o Tabulator internamente usando a configuração da feature, e a tabela aparece dentro do container `.grid-container` com o header do route visível

#### Scenario: Feature sem renderContent
- **WHEN** uma rota tem `feature` apontando para uma classe que estende template mas não implementa `renderContent()`
- **THEN** o template base lança erro ou renderiza slot vazio (comportamento definido em `MainTemplate`)

#### Scenario: Feature com constructor limpo
- **WHEN** a feature tem `constructor() { super(); }` sem lógica adicional
- **THEN** a feature é instanciada normalmente e toda identidade vem do route via mount
