## Why

Hoje o `GridTemplate` instancia o `Tabulator` cru (`new Tabulator(slot, this.renderGridConfig())`) e cada feature carrega no `renderGridConfig()` tanto o que é dela (`data`, `columns`) quanto o que deveria ser decisão do sistema (`layout`, `rowHeight`, densidade). Isso espalha o perfil visual/estrutural do grid por feature e impede padronizá-lo. A customização pede uma classe `CustomTabulator` que carrega um perfil global (`GRID_DEFAULTS`) e é instanciada pelo `GridTemplate`, deixando a feature responsável apenas pelos dados e colunas.

## What Changes

- Nova pasta `src/js/components/tabulator/` com:
  - `CustomTabulator.js` — classe que estende `Tabulator` e injeta o perfil global na construção.
  - `tabulator.defaults.js` — o perfil global `GRID_DEFAULTS` e o conjunto `SYSTEM_OWNED_KEYS` (chaves de propriedade do sistema).
- `CustomTabulator` mescla o perfil com a config da feature usando precedência **P2**: as chaves globais de propriedade do sistema (`layout`, `rowHeight`, `responsiveLayout`) **sempre vencem** a config da feature.
- `columnDefaults` entra no perfil com **deep-merge** — um spread raso substituiria o objeto inteiro e perderia o alinhamento global.
- `GridTemplate.renderContent(slot)` passa a instanciar `new CustomTabulator(slot, this.renderGridConfig())`.
- **BREAKING** (nível de spec, retrocompatível em runtime): a requirement existente que manda instanciar `Tabulator` passa a mandar instanciar `CustomTabulator`. Como `CustomTabulator extends Tabulator`, `instanceof Tabulator` e todo o resto continuam válidos.
- `CustomersFeature` deixa de declarar `layout` no `renderGridConfig()` — passa a ser de propriedade do sistema.
- Sem novos métodos no `CustomTabulator` neste change (opção A: perfil de configuração; a classe fica como ponto de extensão para o futuro).

## Capabilities

### New Capabilities
- `custom-tabulator`: classe `CustomTabulator` estendendo `Tabulator`, o perfil global `GRID_DEFAULTS` (layout, densidade, `columnDefaults`), a precedência de chaves (P2) e o deep-merge; e a regra de que o `GridTemplate` instancia essa classe em vez do `Tabulator` cru.

### Modified Capabilities
- `grid-template`: a requirement "O GridTemplate deve possuir o Tabulator e a feature fornecer a configuração" muda — a instância passa a ser `CustomTabulator` (que injeta o perfil global), e o `renderGridConfig()` da feature passa a devolver apenas o que é dela (`data`/`columns`).
- `template-inheritance`: o cenário do caminho widget referencia `new Tabulator(slot, this.renderGridConfig())`; passa a referenciar `new CustomTabulator(slot, this.renderGridConfig())`.

## Impact

- `src/js/components/tabulator/CustomTabulator.js` — novo
- `src/js/components/tabulator/tabulator.defaults.js` — novo
- `src/js/components/templates/GridTemplate.js` — troca `Tabulator` por `CustomTabulator`
- `src/js/features/customers/CustomersFeature.js` — remove `layout` do `renderGridConfig()`
- `package.json` — inalterado (`tabulator-tables` já é dependência)
- API pública: nenhuma mudança além da classe de instanciação; retrocompatível em runtime
- Efeito em cascata: o perfil global passa a valer para **todas** as grids (incluindo a visual da `CustomersFeature`)
