# Delta: page-rendering

## MODIFIED Requirements

### Requirement: As telas de recurso devem usar o template de tela principal
O sistema MUST renderizar toda rota-folha dentro de um template de tela principal. A escolha do template específico (PageTemplate, FullWidthTemplate, etc.) SHALL ser feita pela feature via herança de classe, não pelo Router. Cada feature extende um template base que define o scaffold (container, título, subtítulo, slot), e o template deve replicar o padrão de design visual do app, de modo que a experiência seja padronizada entre as telas que usam o mesmo template.

#### Scenario: Renderização de uma rota com feature
- **WHEN** o `Router` navega para uma rota-folha com feature associada
- **THEN** o Router instancia a feature, chama `mount(container)`, e a feature (via herança de template) renderiza o scaffold com título e subtítulo definidos no constructor da feature e o conteúdo devolvido por `renderContent()` no slot

#### Scenario: Renderização de uma rota sem feature
- **WHEN** o `Router` navega para uma rota-folha sem feature associada
- **THEN** o Router exibe um placeholder simples sem scaffold de template (comportamento a definir na implementação)

### Requirement: O título e o subtítulo devem vir do constructor da feature
O título e o subtítulo da tela principal MUST ser definidos no constructor da feature ao chamar `super({ title, subtitle })`. O `sidebar.items.js` pode manter campo `subtitle` para registro, mas a fonte definitiva de título/subtítulo é a própria feature, que tem autonomia para definir seus valores. Features SHALL não depender de `sidebar.items.js` para obter título/subtítulo em runtime.

#### Scenario: Feature com título e subtítulo no constructor
- **WHEN** a feature é criada com `super({ title: 'Dashboard', subtitle: 'Overview' })`
- **THEN** a tela principal exibe esses valores independentemente do que está em `sidebar.items.js`

#### Scenario: Item de rota com subtítulo em sidebar.items.js
- **WHEN** a rota resolvida tem `subtitle` preenchido em `sidebar.items.js`
- **THEN** esse valor é ignorado pela feature se ela definir seu próprio subtítulo no constructor (o valor em sidebar.items.js é apenas para registro)

### Requirement: O objeto da tela principal deve morar na pasta de templates
Os templates base (MainTemplate, PageTemplate, etc.) MUST existir como classes em `src/js/components/templates/` com markup em arquivos `.raw` importados via satélite. O Page existente em `src/js/components/page/` SHALL ser refactorado para `PageTemplate` que extende `MainTemplate`. A montagem do DOM SHALL ser feita pelo método `mount()` herdado de `MainTemplate`, e o conteúdo SHALL ser injetado via DOM no slot, sem passar pelo motor de interpolação.

#### Scenario: Instanciação de PageTemplate
- **WHEN** uma feature extende `PageTemplate` e é instanciada com `{ title, subtitle }`
- **THEN** o HTML resultante contém o scaffold de página com título e subtítulo interpolados e um slot de conteúdo preenchido por `renderContent()`

#### Scenario: Injeção de conteúdo com marcadores de interpolação
- **WHEN** o conteúdo devolvido por `renderContent()` contém a sequência `{{qualquer}}`
- **THEN** essa sequência aparece literalmente no slot, sem ser interpretada pelo motor `Template`

### Requirement: O contrato de recurso deve ser classe que extende template
Toda feature associada a uma rota MUST ser uma classe JavaScript que extende um template base (ex: `PageTemplate`) e implementa `renderContent()` devolvendo o HTML do conteúdo da tela. O `Router` SHALL instanciar a feature e chamar `mount(container)`, deixando a feature carregar seu template via herança. O contrato anterior de `render(route) → string HTML` é substituído por este novo contrato.

#### Scenario: Feature válida com herança de template
- **WHEN** a rota tem `feature` apontando para uma classe que extende `PageTemplate` e implementa `renderContent()`
- **THEN** o Router instancia a feature, chama `mount()`, e a tela exibe o scaffold do template com o conteúdo de `renderContent()`

#### Scenario: Feature sem renderContent
- **WHEN** a rota tem `feature` apontando para uma classe que extende template mas não implementa `renderContent()`
- **THEN** o template base lança erro ou renderiza slot vazio (comportamento definido em `MainTemplate`)
