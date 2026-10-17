# Capability: template-inheritance

## Purpose

Define a herança de templates estilo Flutter: classe base abstrata `MainTemplate` com contrato comum (`render`, `mount`, `setContent`, `findSlot`, `renderContent`), templates concretos que estendem a base e definem seu próprio scaffold, e comportamento padronizado de montagem e injeção de conteúdo.

## Requirements

### Requirement: Deve existir uma classe base abstrata para templates
O sistema MUST prover uma classe `MainTemplate` em `src/js/components/templates/` que define a interface comum para todos os templates. A classe SHALL definir métodos `render()`, `mount(container)`, `setContent(html)`, `findSlot()`, e `renderContent()` como parte do contrato, mas SHALL implementar apenas `mount()` e `setContent()`. Os métodos `render()`, `findSlot()`, e `renderContent()` SHALL lançar erro se chamados diretamente em `MainTemplate`, forçando subclasses a implementá-los.

#### Scenario: Criação de template base
- **WHEN** uma classe extende `MainTemplate` e implementa os métodos abstratos
- **THEN** a classe pode ser instanciada e usada como template válido

#### Scenario: Tentativa de usar MainTemplate diretamente
- **WHEN** código tenta instanciar `MainTemplate` diretamente e chamar `render()`
- **THEN** um erro é lançado indicando que o método deve ser implementado pela subclasse

### Requirement: Templates concretos devem extender a classe base
Todo template concreto (ex: `PageTemplate`, `FullWidthTemplate`) MUST extender `MainTemplate` e implementar os métodos abstratos `render()`, `findSlot()`, e opcionalmente sobrescrever `renderContent()`. O template SHALL definir seu próprio scaffold HTML via markup em arquivo `.raw` importado via satélite.

#### Scenario: PageTemplate extende MainTemplate
- **WHEN** `PageTemplate` extende `MainTemplate` e implementa `render()` com o scaffold de página
- **THEN** instâncias de `PageTemplate` renderizam o layout de página padrão com título, subtítulo e slot

#### Scenario: Template com scaffold diferente
- **WHEN** um novo template (ex: `FullWidthTemplate`) extende `MainTemplate` e implementa `render()` com scaffold full-width
- **THEN** instâncias desse template renderizam o layout alternativo especificado

### Requirement: O método mount deve ser padronizado na classe base
O método `mount(container)` SHALL ser implementado em `MainTemplate` e SHALL: (1) injetar o HTML de `render()` no container via `innerHTML`, (2) guardar referência ao container em `this.root`, (3) chamar `findSlot()` para localizar o slot de conteúdo e guardar em `this.slot`, (4) chamar `renderContent()` e injetar o resultado no slot via `setContent()`. Subclasses podem sobrescrever `mount()` se necessário, mas SHALL seguir essa sequência por padrão.

#### Scenario: Montagem de template com conteúdo
- **WHEN** `mount(container)` é chamado em uma feature que extende um template
- **THEN** o scaffold do template é injetado no container e o conteúdo de `renderContent()` aparece no slot

#### Scenario: RenderContent vazio
- **WHEN** `renderContent()` devolve string vazia ou não é implementado
- **THEN** o slot de conteúdo permanece vazio sem erro (comportamento definido pela implementação)

### Requirement: O método setContent deve injetar HTML no slot
O método `setContent(html)` SHALL ser implementado em `MainTemplate` e SHALL injetar o HTML recebido no elemento guardado em `this.slot` via `innerHTML`. Se `this.slot` for null, o método SHALL não fazer nada ou lançar erro (decisão de implementação).

#### Scenario: Injeção de conteúdo válido
- **WHEN** `setContent('<div>conteúdo</div>')` é chamado após mount
- **THEN** o slot de conteúdo contém exatamente o HTML informado

#### Scenario: Injeção de conteúdo com marcadores de interpolação
- **WHEN** o conteúdo contém a sequência `{{qualquer}}`
- **THEN** essa sequência aparece literalmente no slot, sem ser interpretada pelo motor `Template`
