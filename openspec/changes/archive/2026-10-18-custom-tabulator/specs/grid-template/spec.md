## MODIFIED Requirements

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
