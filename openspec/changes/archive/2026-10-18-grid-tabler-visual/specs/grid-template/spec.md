# grid-template Delta Specification

## MODIFIED Requirements

### Requirement: O scaffold de grid deve ter container e satélite próprios
O markup do `GridTemplate` SHALL morar em `templates/grid.raw`, importado via satélite `grid.imports.js` em `src/js/components/templates/` (mesmo padrão de `page.raw` / `page.imports.js`). O scaffold SHALL envolver o container `.grid-container` com a estrutura de card do Tabler: `.card` contendo a toolbar (`.card-body` com "Show N entries" e "Search"), a área de tabela (`.table-responsive`) com o `.grid-container` dentro — destino do conteúdo da feature, descoberto por `findSlot()` — e o `.card-footer` com contagem de registros e paginação. O scaffold SHALL NÃO conter `.card-header` com título.

#### Scenario: findSlot localiza o container de grid
- **WHEN** `GridTemplate.findSlot()` é executado após o mount
- **THEN** retorna o elemento `.grid-container` injetado no container

#### Scenario: Satélite grid.imports.js
- **WHEN** o `GridTemplate` é importado
- **THEN** o satélite `grid.imports.js` provê o markup de `templates/grid.raw` via import `?raw`

#### Scenario: Scaffold com chrome de card
- **WHEN** o `GridTemplate` é montado
- **THEN** o markup injetado contém `.card` com toolbar, `.table-responsive` envolvendo `.grid-container` e `.card-footer`, sem `.card-header` com título
