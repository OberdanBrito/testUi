# grid-tabler-visual — Design

## Context

O projeto usa `@tabler/core` (CSS via `@import` em `src/css/main.css`) e `tabulator-tables` 6.6.1 (`CustomTabulator` + perfil `GRID_DEFAULTS` em `src/js/components/tabulator/`). Hoje o `GridTemplate` monta o Tabulator "cru" dentro de `.grid-container` (`templates/grid.raw`), sem o chrome de card do Tabler nem controles. A referência visual é a captura do Tabler UI Kit (card "Invoices"): toolbar com "Show N entries" / "Search:", tabela `card-table` e footer com contagem + paginação.

Estado atual relevante:
- `templates/grid.raw` — scaffold com `page-header` + `.page-body > .grid-container`.
- `GridTemplate.renderContent(slot)` — `this.tabulator = new CustomTabulator(slot, this.renderGridConfig())`.
- `tabulator.defaults.js` — `GRID_DEFAULTS` (layout, rowHeight, responsiveLayout, placeholder, columnDefaults) e `SYSTEM_OWNED_KEYS`.

## Goals / Non-Goals

**Goals:**
- Envolver o Tabulator com o card do Tabler (toolbar, `.table-responsive`, `.card-footer`) em `grid.raw`.
- Toolbar funcional: "Show entries" → `setPageSize`; "Search" → filtro global.
- Footer funcional: contagem `Showing X to Y of Z entries` + paginação numerada (prev/next, página ativa, desabilitados nos extremos).
- Paridade visual da tabela com o `card-table` do Tabler via CSS puro sobre as classes do Tabulator.

**Non-Goals:**
- Colunas/formatadores do exemplo (checkbox de seleção, badges de status, bandeiras, dropdown "Actions").
- `.card-header` com título (o `page-header` é o único título — decisão do dono).
- Alterar o DOM gerado pelo Tabulator ou trocar de widget.

## Decisions

1. **Chrome mora no scaffold (`grid.raw`), wiring mora no `GridTemplate`.** A estrutura de card é markup estático do Tabler (já disponível via `@tabler/core`); o `GridTemplate` é o dono de `this.tabulator`, então ele é quem binda toolbar/footer à instância. Alternativa (chrome montado pelo widget via JS) descartada: markup vivo no `.raw` é o padrão do projeto e é inspecionável/estilizável.
2. **`pagination` vira chave estrutural do sistema** (`SYSTEM_OWNED_KEYS` ganha `pagination`; `GRID_DEFAULTS` ganha `pagination: true` e `paginationSize: 8` como baseline). Motivo: o footer é chrome do sistema e depende da paginação ativa; feature não pode desligá-la sem quebrar o contrato visual. `paginationSize` continua baseline (o input "Show entries" o ajusta em runtime via `setPageSize`). Alternativa (forçar no `GridTemplate` depois do merge) descartada: duplicaria a lógica P2 já existente no widget.
3. **Filtro global via função de filtro do Tabulator** (`setFilter(fn)` case-insensitive sobre todos os campos das colunas), não header filters: a toolbar tem um único campo "Search" como na referência. Termo vazio → `removeFilter()`.
4. **Footer reativo aos eventos do Tabulator** (`pageLoaded`, `dataFiltered`, `dataLoaded`) para recalcular contagem e re-renderizar os itens de paginação (`getPage`, `getPageMax`, `getPageSize`, `getDataCount`), em vez de polling ou handlers manuais em cada ação.
5. **CSS de paridade em arquivo dedicado `src/css/grid.css`**, importado por `src/css/main.css` (padrão dos `@import` existentes). Seletores miram as classes do Tabulator (`.tabulator-table`, `.tabulator-header`, `.tabulator-row`, etc.) com especificidade localizada sob `.grid-container`, sem tocar no CSS global do Tabler. Alternativa (customizar `tabulator.min.css`) descartada: seria perdido no upgrade da dependência.
6. **Rótulos em inglês** ("Show", "entries", "Search:", "Showing X to Y of Z entries") fiéis à captura de referência e ao exemplo do Tabler.

## Decisões de execução (divergências/aprendizados do apply/QA)

1. **`rowHeight` do perfil: 48 → 64** — densidade da captura de referência (linhas ~64px). Valor do `GRID_DEFAULTS`, chave estrutural inalterada.
2. **`layout` do perfil: `fitDataTable` → `fitDataStretch`** — a captura exige colunas preenchendo a largura do card; `fitDataTable` estourava/comprimia e `fitColumns` gerou loop de redraw do Tabulator (página travava) no combo `fitColumns` + `responsiveLayout: 'collapse'` + altura fixa.
3. **`!important` pontual e escopado em `grid.css`** para `.tabulator-col-sorter`/`.tabulator-arrow`/`title-holder` — o `tabulator.min.css` é injetado por JS depois do `main.css` e usa cadeias de especificidade igual/maior (0,5,0–0,8,0); especificidade superior exigiria cadeias absurdas.
4. **Sort: chevron (SVG) só na coluna ordenada (`aria-sort`)**, inline após o título — paridade com "NO. ^" da captura; hover do header usa o hover sutil do Tabler (o padrão do Tabulator era `#cdcdcd`).
5. **`clearFilter()` em vez de `removeFilter()`** para limpar a busca — `removeFilter()` sem tipo não remove o filtro de função (só gerava "Filter Error - No matching filter type found").
6. **Footer assíncrono**: `dataFiltered` dispara antes dos dados assentarem (contagem atrasava uma ação) e `dataLoaded` pode disparar antes de `tableBuilt` (warnings "Table Not Initialized"). Solução: guard `this.gridReady` (setado em `tableBuilt`) + listener `renderComplete` para a leitura final do estado.
7. **Commit seletivo** (decisão do dono): outra sessão/concorrência editava o repo durante a execução (feature de formulário de cliente: `FormTemplate`, `CustomerFormFeature`, `controller/`, `style.css`, `sidebar.imports.js`, `CustomersFeature.js`) — só os arquivos desta change entram no commit.

## Risks / Trade-offs

- [CSS do Tabulator conflitar com o do Tabler] → escopo de seletores sob `.grid-container` e conferência lado a lado no QA visual; ajustar especificidade em vez de `!important` sempre que possível.
- [Filtro global em valores não-string (números/objetos)] → normalizar com `String(valor).toLowerCase()` na função de filtro.
- [Footer desatualizado se a feature trocar dados em runtime] → ouvir `dataLoaded`/`dataFiltered` (cobre replaceData/setFilter); cenário coberto no QA.
- [Input "Show entries" com valor inválido] → aceitar apenas inteiros positivos; valor inválido ignora a mudança e restaura o valor atual.

## Migration Plan

Mudança puramente visual/comportamental do grid, sem dados nem API. Rollback = reverter o commit. `CustomersFeature` de demo continua funcionando sem alterações de config.

## Open Questions

Nenhuma — escopo alinhado com o dono (título único no page-header; controles funcionais; sem colunas do exemplo).
