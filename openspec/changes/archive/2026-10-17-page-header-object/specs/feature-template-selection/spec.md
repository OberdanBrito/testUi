## MODIFIED Requirements

### Requirement: Features devem estender um template base
Toda feature associada a uma rota MUST ser uma classe JavaScript que estende um template base (ex: `PageTemplate`, `FullWidthTemplate`). A feature SHALL implementar o método `renderContent()` devolvendo o HTML do conteúdo específico daquela feature. O constructor da feature SHALL ser apenas `super()` — wiring puro, sem lógica e sem definição de título/subtítulo.

#### Scenario: Feature estendendo PageTemplate
- **WHEN** `DashboardFeature` estende `PageTemplate` e implementa `renderContent()`
- **THEN** instâncias de `DashboardFeature` renderizam o scaffold de página com o conteúdo específico do dashboard

#### Scenario: Feature estendendo template alternativo
- **WHEN** `AnalyticsFeature` estende `FullWidthTemplate` e implementa `renderContent()`
- **THEN** instâncias de `AnalyticsFeature` renderizam o scaffold full-width com o conteúdo específico de analytics

#### Scenario: Constructor de feature é só wiring
- **WHEN** o constructor da feature contém apenas `super()`
- **THEN** a feature é instanciada sem efeitos colaterais, permitindo que outra feature a instancie internamente (composição)

### Requirement: Título e subtítulo vêm do route, não do constructor da feature
O título e o subtítulo da tela MUST vir do route (`label`, `subtitle`) resolvido pelo Router a partir de `sidebar.items.js`. A feature SHALL NÃO passar título/subtítulo via `super({ title, subtitle })`. A identidade da rota é responsabilidade do registro de rotas e do `PageHeader`, não da feature.

#### Scenario: Feature sem título no constructor
- **WHEN** `DashboardFeature` é criada com `super()` sem argumentos de título/subtítulo
- **THEN** a tela renderizada exibe o título e subtítulo vindos de `sidebar.items.js` via route

#### Scenario: sidebar.items.js como fonte de identidade
- **WHEN** `sidebar.items.js` define `label: 'Dashboard'` e `subtitle: 'Overview of your activity at a glance'`
- **THEN** a tela exibe exatamente esses valores, sem divergência com a feature

### Requirement: O Router deve instanciar features e chamar mount com route
O `Router.renderRoute` MUST instanciar a feature apontada por `route.component` e chamar `mount(this.container, route)`. O Router SHALL repassar o route completo (resolvido de `sidebar.items.js`) como segundo argumento do `mount`. O Router SHALL não instanciar templates diretamente nem injetar conteúdo manualmente.

#### Scenario: Rota com feature válida
- **WHEN** o Router navega para uma rota com `route.component` apontando para uma classe de feature
- **THEN** o Router instancia a feature, chama `mount(container, route)`, e a tela exibe o scaffold do template com o conteúdo da feature

#### Scenario: Route repassado ao mount
- **WHEN** `renderRoute(route)` executa
- **THEN** `route` (com `label`, `subtitle`, `icon`, `path`, `parent_id`) é passado como segundo argumento de `mount`

#### Scenario: Rota sem feature
- **WHEN** o Router navega para uma rota sem `route.component` definido
- **THEN** o Router exibe um placeholder simples (sem scaffold de template) ou trata como rota inválida (comportamento a definir na implementação)

### Requirement: A feature pode implementar renderHeader opcionalmente
A feature PODE implementar o método `renderHeader()` devolvendo o HTML da zona de ações do header (botões, controles). Se implementado, o `MainTemplate` injeta o retorno na zona ações do `PageHeader` durante o `mount`. Se não implementado, a zona ações permanece vazia sem erro. A feature SHALL NÃO acessar nem manipular o `PageHeader` diretamente — apenas devolver HTML.

#### Scenario: Feature com renderHeader
- **WHEN** a feature implementa `renderHeader()` devolvendo `<button class="btn btn-primary">New</button>`
- **THEN** o botão aparece na zona ações do header, à direita do título

#### Scenario: Feature sem renderHeader
- **WHEN** a feature não implementa `renderHeader()`
- **THEN** a zona ações fica vazia e nenhum erro é lançado

#### Scenario: renderHeader retorna HTML sem referenciar PageHeader
- **WHEN** `renderHeader()` é avaliado
- **THEN** o método devolve apenas uma string HTML, sem referenciar `this.header`, sem chamar `setActions`, sem manipular DOM do header

### Requirement: Features devem poder estender diferentes templates
O sistema SHALL permitir que diferentes features estendam diferentes templates base. Não SHALL haver restrição que force todas as features a estender o mesmo template. O `sidebar.items.js` não precisa declarar qual template a feature usa — isso é implícito na definição da classe da feature.

#### Scenario: Duas features com templates diferentes
- **WHEN** `DashboardFeature` estende `PageTemplate` e `AnalyticsFeature` estende `FullWidthTemplate`
- **THEN** ambas podem ser usadas no app, cada uma renderizando seu layout específico

#### Scenario: Adição de novo template
- **WHEN** um novo template `ModalTemplate` é criado e uma feature `SettingsFeature` o estende
- **THEN** o Router funciona sem mudanças, instanciando `SettingsFeature` normalmente
