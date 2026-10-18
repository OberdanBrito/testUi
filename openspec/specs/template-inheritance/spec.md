# Capability: template-inheritance

## Purpose

Define a herança de templates estilo Flutter: classe base abstrata `MainTemplate` com contrato comum (`render`, `mount`, `setContent`, `findSlot`, `renderContent`), templates concretos que estendem a base e definem seu próprio scaffold, e comportamento padronizado de montagem e injeção de conteúdo.

## Requirements

### Requirement: Deve existir uma classe base abstrata para templates
O sistema MUST prover uma classe `MainTemplate` em `src/js/components/templates/` que define a interface comum para todos os templates. A classe SHALL definir métodos `render()`, `mount(container, route)`, `setContent(html)`, `findSlot()`, `renderHeader()`, `setHeaderContent(html)`, e `renderContent()` como parte do contrato, mas SHALL implementar apenas `mount()`, `setContent()`, `setHeaderContent()` e `renderHeader()` (devolvendo `''` por padrão). Os métodos `render()`, `findSlot()`, e `renderContent()` SHALL lançar erro se chamados diretamente em `MainTemplate`, forçando subclasses a implementá-los.

#### Scenario: Criação de template base
- **WHEN** uma classe estende `MainTemplate` e implementa os métodos abstratos
- **THEN** a classe pode ser instanciada e usada como template válido

#### Scenario: Tentativa de usar MainTemplate diretamente
- **WHEN** código tenta instanciar `MainTemplate` diretamente e chamar `render()`
- **THEN** um erro é lançado indicando que o método deve ser implementado pela subclasse

### Requirement: Templates concretos devem estender a classe base
Todo template concreto (ex: `PageTemplate`, `FullWidthTemplate`) MUST estender `MainTemplate` e implementar os métodos abstratos `render()`, `findSlot()`, e opcionalmente sobrescrever `renderContent()`. O template SHALL definir seu próprio scaffold HTML via markup em arquivo `.raw` importado via satélite.

#### Scenario: PageTemplate estende MainTemplate
- **WHEN** `PageTemplate` estende `MainTemplate` e implementa `render()` com o scaffold de página
- **THEN** instâncias de `PageTemplate` renderizam o layout de página padrão com header (zona identidade + zona ações) e slot de conteúdo

#### Scenario: Template com scaffold diferente
- **WHEN** um novo template (ex: `FullWidthTemplate`) estende `MainTemplate` e implementa `render()` com scaffold full-width
- **THEN** instâncias desse template renderizam o layout alternativo especificado

### Requirement: O método mount deve ser padronizado na classe base
O método `mount(container, route)` SHALL ser implementado em `MainTemplate` e SHALL: (1) guardar o route em `this.route`, (2) injetar o HTML de `render()` no container via `innerHTML`, (3) guardar referência ao container em `this.root`, (4) instanciar `PageHeader(route)` e guardar em `this.header`, (5) chamar `findSlot()` para localizar o slot de conteúdo e guardar em `this.slot`, (6) chamar `setHeaderContent(this.renderHeader())` para preencher a zona ações, (7) chamar `renderContent()` e injetar o resultado no slot via `setContent()`. Subclasses podem sobrescrever `mount()` se necessário, mas SHALL seguir essa sequência por padrão.

#### Scenario: Montagem de template com route e header
- **WHEN** `mount(container, route)` é chamado em uma feature que estende um template
- **THEN** o scaffold é injetado, `this.route` e `this.header` estão disponíveis, a zona identidade do header está preenchida, e o conteúdo de `renderContent()` aparece no slot

#### Scenario: Route disponível para a feature
- **WHEN** `renderContent()` ou `renderHeader()` é chamado durante o mount
- **THEN** `this.route` está acessível na instância da feature (guardado pelo MainTemplate antes da chamada)

#### Scenario: RenderContent vazio
- **WHEN** `renderContent()` devolve string vazia ou não é implementado
- **THEN** o slot de conteúdo permanece vazio sem erro (comportamento definido pela implementação)

### Requirement: O método setContent deve injetar HTML no slot
O método `setContent(html)` SHALL ser implementado em `MainTemplate` e SHALL injetar o HTML recebido no elemento guardado em `this.slot` via `innerHTML`. Se `this.slot` for null, o método SHALL não fazer nada (comportamento atual).

#### Scenario: Injeção de conteúdo válido
- **WHEN** `setContent('<div>conteúdo</div>')` é chamado após mount
- **THEN** o slot de conteúdo contém exatamente o HTML informado

#### Scenario: Injeção de conteúdo com marcadores de interpolação
- **WHEN** o conteúdo contém a sequência `{{qualquer}}`
- **THEN** essa sequência aparece literalmente no slot, sem ser interpretada pelo motor `Template`

### Requirement: O método setHeaderContent deve injetar HTML na zona ações do header
O método `setHeaderContent(html)` SHALL ser implementado em `MainTemplate` e SHALL injetar o HTML recebido na zona ações do `PageHeader` (via `this.header.setActions(html)`). Se `this.header` for null, o método SHALL não fazer nada. O `renderHeader()` padrão em `MainTemplate` SHALL devolver string vazia.

#### Scenario: Zona ações preenchida
- **WHEN** uma feature implementa `renderHeader()` e `mount` executa `setHeaderContent(renderHeader())`
- **THEN** a zona ações do header contém o HTML devolvido pela feature

#### Scenario: Feature sem renderHeader
- **WHEN** uma feature não implementa `renderHeader()`
- **THEN** `renderHeader()` (herdado do MainTemplate) devolve `''` e a zona ações permanece vazia sem erro
