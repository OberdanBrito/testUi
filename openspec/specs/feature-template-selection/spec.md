# Capability: feature-template-selection

## Purpose

Define como features são selecionadas e associadas a rotas: toda feature associada a uma rota é uma classe que extende um template base, define título/subtítulo no constructor via `super()`, é instanciada diretamente pelo Router, e pode escolher livremente qual template estender.

## Requirements

### Requirement: Features devem extender um template base
Toda feature associada a uma rota MUST ser uma classe JavaScript que extende um template base (ex: `PageTemplate`, `FullWidthTemplate`). A feature SHALL implementar o método `renderContent()` devolvendo o HTML do conteúdo específico daquela feature. O constructor da feature SHALL chamar `super()` com os parâmetros necessários para o template (ex: `{ title, subtitle }`).

#### Scenario: Feature extendendo PageTemplate
- **WHEN** `DashboardFeature` extende `PageTemplate` e implementa `renderContent()`
- **THEN** instâncias de `DashboardFeature` renderizam o scaffold de página com o conteúdo específico do dashboard

#### Scenario: Feature extendendo template alternativo
- **WHEN** `AnalyticsFeature` extende `FullWidthTemplate` e implementa `renderContent()`
- **THEN** instâncias de `AnalyticsFeature` renderizam o scaffold full-width com o conteúdo específico de analytics

### Requirement: Features devem definir título e subtítulo no constructor
Cada feature MUST definir título e subtítulo da tela ao chamar `super({ title, subtitle })` no constructor. Os valores de título e subtítulo podem ser hardcoded na feature ou lidos de configuração, mas SHALL ser passados explicitamente para o template base. O `sidebar.items.js` pode continuar com campo `subtitle` para registro, mas a feature tem autonomia para definir seus próprios valores.

#### Scenario: Feature com título e subtítulo hardcoded
- **WHEN** `DashboardFeature` é criada com `super({ title: 'Dashboard', subtitle: 'Overview' })`
- **THEN** a tela renderizada exibe "Dashboard" como título e "Overview" como subtítulo

#### Scenario: Feature sem subtítulo
- **WHEN** `DashboardFeature` é criada com `super({ title: 'Dashboard', subtitle: '' })`
- **THEN** a tela renderizada exibe apenas o título, sem elemento de subtítulo vazio (comportamento do template)

### Requirement: O Router deve instanciar features diretamente
O `Router.renderRoute` MUST instanciar a feature apontada por `route.component` e chamar `mount(this.container)`. O Router SHALL não instanciar templates diretamente nem injetar conteúdo manualmente. A feature, via herança de template, já sabe como renderizar seu scaffold e injetar conteúdo.

#### Scenario: Rota com feature válida
- **WHEN** o Router navega para uma rota com `route.component` apontando para uma classe de feature
- **THEN** o Router instancia a feature, chama `mount(container)`, e a tela exibe o scaffold do template com o conteúdo da feature

#### Scenario: Rota sem feature
- **WHEN** o Router navega para uma rota sem `route.component` definido
- **THEN** o Router exibe um placeholder simples (sem scaffold de template) ou trata como rota inválida (comportamento a definir na implementação)

### Requirement: Features devem poder escolher diferentes templates
O sistema SHALL permitir que diferentes features extendam diferentes templates base. Não SHALL haver restrição que force todas as features a extender o mesmo template. O `sidebar.items.js` não precisa declarar qual template a feature usa — isso é implícito na definição da classe da feature.

#### Scenario: Duas features com templates diferentes
- **WHEN** `DashboardFeature` extende `PageTemplate` e `AnalyticsFeature` extende `FullWidthTemplate`
- **THEN** ambas podem ser usadas no app, cada uma renderizando seu layout específico

#### Scenario: Adição de novo template
- **WHEN** um novo template `ModalTemplate` é criado e uma feature `SettingsFeature` o extende
- **THEN** o Router funciona sem mudanças, instanciando `SettingsFeature` normalmente
