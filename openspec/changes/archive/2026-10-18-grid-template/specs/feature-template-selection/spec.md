# Capability: feature-template-selection (delta)

## MODIFIED Requirements

### Requirement: Features devem estender um template base
Toda feature associada a uma rota MUST ser uma classe JavaScript que estende um template base (ex: `PageTemplate`, `GridTemplate`, `FullWidthTemplate`). A feature SHALL implementar o método `renderContent()` — devolvendo o HTML do conteúdo específico daquela feature (caminho HTML string) ou recebendo o slot de destino para montar widgets como Tabulator (caminho widget, ver contrato em `template-inheritance`). O constructor da feature SHALL ser apenas `super()` — wiring puro, sem lógica e sem definição de título/subtítulo.

#### Scenario: Feature estendendo PageTemplate
- **WHEN** `DashboardFeature` estende `PageTemplate` e implementa `renderContent()`
- **THEN** instâncias de `DashboardFeature` renderizam o scaffold de página com o conteúdo específico do dashboard

#### Scenario: Feature estendendo GridTemplate
- **WHEN** uma feature estende `GridTemplate` e implementa `renderGridConfig()` devolvendo `{ columns, data }`
- **THEN** instâncias dessa feature renderizam o scaffold de grid com a tabela Tabulator (criada pelo GridTemplate) dentro do container `.grid-container`

#### Scenario: Feature estendendo template alternativo
- **WHEN** `AnalyticsFeature` estende `FullWidthTemplate` e implementa `renderContent()`
- **THEN** instâncias de `AnalyticsFeature` renderizam o scaffold full-width com o conteúdo específico de analytics

#### Scenario: Constructor de feature é só wiring
- **WHEN** o constructor da feature contém apenas `super()`
- **THEN** a feature é instanciada sem efeitos colaterais, permitindo que outra feature a instancie internamente (composição)
