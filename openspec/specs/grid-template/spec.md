# grid-template Specification

## Purpose
TBD - created by archiving change grid-template. Update Purpose after archive.
## Requirements
### Requirement: Deve existir o GridTemplate estendendo MainTemplate
O sistema MUST prover uma classe `GridTemplate` em `src/js/components/templates/` que estende `MainTemplate` e implementa `render()` (scaffold com container `.grid-container`) e `findSlot()` (retorna o elemento `.grid-container`). O `GridTemplate` SHALL implementar `renderContent(slot)` montando o widget do grid e delegando a configuração ao método abstrato `renderGridConfig()` da feature. O `GridTemplate` SHALL herdar automaticamente o `PageHeader` (zona identidade + zona ações) criado pelo `MainTemplate.mount()`, como qualquer template concreto.

#### Scenario: GridTemplate renderiza scaffold de grid
- **WHEN** `GridTemplate` estende `MainTemplate` e implementa `render()` com o markup de grid
- **THEN** instâncias montadas exibem o scaffold com header (zona identidade preenchida do route + zona ações) e o container `.grid-container` vazio

#### Scenario: Montagem de GridTemplate puro
- **WHEN** `GridTemplate` é montado diretamente sem uma feature que implemente `renderGridConfig()`
- **THEN** o erro do `GridTemplate` é lançado indicando que `renderGridConfig()` deve ser implementado pela subclasse

#### Scenario: Zona ações disponível para features de grid
- **WHEN** uma feature estende `GridTemplate` e implementa `renderHeader()`
- **THEN** o HTML devolvido aparece na zona ações do header, como em qualquer outro template

### Requirement: O scaffold de grid deve ter container e satélite próprios
O markup do `GridTemplate` SHALL morar em `templates/grid.raw`, importado via satélite `grid.imports.js` em `src/js/components/templates/` (mesmo padrão de `page.raw` / `page.imports.js`). O scaffold SHALL conter o container `.grid-container` como destino do conteúdo da feature, descoberto por `findSlot()`.

#### Scenario: findSlot localiza o container de grid
- **WHEN** `GridTemplate.findSlot()` é executado após o mount
- **THEN** retorna o elemento `.grid-container` injetado no container

#### Scenario: Satélite grid.imports.js
- **WHEN** o `GridTemplate` é importado
- **THEN** o satélite `grid.imports.js` provê o markup de `templates/grid.raw` via import `?raw`

### Requirement: O projeto deve incluir a dependência Tabulator
O sistema SHALL adicionar a dependência `tabulator-tables` ao `package.json`. O CSS do Tabulator SHALL ser importado no build (via import no entrypoint ou link no `index.html`).

#### Scenario: Dependência Tabulator presente
- **WHEN** o `package.json` é inspecionado
- **THEN** contém `tabulator-tables` como dependência

### Requirement: O GridTemplate deve possuir o Tabulator e a feature fornecer a configuração
O `GridTemplate` SHALL implementar `renderContent(slot)` instanciando `new CustomTabulator(slot, config)`, onde `config` vem de `this.renderGridConfig()`, e SHALL guardar a instância em `this.tabulator`. O `GridTemplate` SHALL importar `CustomTabulator` de `src/js/components/tabulator/CustomTabulator.js` e SHALL NÃO instanciar o `Tabulator` cru diretamente. O `GridTemplate` SHALL declarar `renderGridConfig()` como método abstrato que lança erro se não implementado pela feature. Uma feature que estende `GridTemplate` SHALL implementar `renderGridConfig()` devolvendo um objeto com `columns` e `data` (dados e colunas do grid) — as propriedades estruturais do grid (layout, densidade, alinhamento) vêm do perfil global injetado pelo `CustomTabulator`. A feature NÃO SHALL instanciar o Tabulator nem manipular o slot diretamente.

#### Scenario: GridTemplate cria o CustomTabulator internamente
- **WHEN** uma feature de grid é montada e `GridTemplate.renderContent(slot)` executa
- **THEN** um `CustomTabulator` é instanciado dentro de `.grid-container` usando `this.renderGridConfig()`, e a instância fica guardada em `this.tabulator`

#### Scenario: Feature fornece a configuração do grid
- **WHEN** uma feature estende `GridTemplate` e implementa `renderGridConfig()` devolvendo `{ columns, data }`
- **THEN** a tabela Tabulator renderiza dentro de `.grid-container` com as colunas e os dados informados

#### Scenario: Feature de grid sem renderGridConfig
- **WHEN** uma feature estende `GridTemplate` mas não implementa `renderGridConfig()`
- **THEN** o erro do `GridTemplate` é lançado indicando que `renderGridConfig()` deve ser implementado pela subclasse

