# grid-tabler-visual — Tasks

## 1. Setup

- [x] 1.1 Criar `src/css/grid.css` com o escopo base de estilização sob `.grid-container` e importá-lo em `src/css/main.css`

## 2. Scaffold e Perfil

- [x] 2.1 Atualizar `templates/grid.raw`: envolver `.grid-container` com a estrutura de card do Tabler (toolbar `.card-body` com "Show N entries" e "Search:", `.table-responsive`, `.card-footer` com contagem + paginação), sem `.card-header` com título
- [x] 2.2 Atualizar `tabulator.defaults.js`: adicionar `pagination: true` e `paginationSize: 8` em `GRID_DEFAULTS` e incluir `pagination` em `SYSTEM_OWNED_KEYS`

## 3. Wiring no GridTemplate

- [x] 3.1 Bindar o input "Show entries" ao `setPageSize` do Tabulator (aceitar apenas inteiros positivos; inválido restaura o valor atual)
- [x] 3.2 Bindar o input "Search" a um filtro global case-insensitive (`setFilter` com função sobre todos os campos; termo vazio → `removeFilter`)
- [x] 3.3 Renderizar o footer: texto `Showing X to Y of Z entries` e paginação numerada (prev/next + páginas, `.active` na página atual, desabilitados nos extremos) ligada ao `setPage`
- [x] 3.4 Recalcular footer e paginação nos eventos do Tabulator (`pageLoaded`, `dataFiltered`, `dataLoaded`)

## 4. CSS de Paridade Visual

- [x] 4.1 Estilizar o header do Tabulator como o cabeçalho do `card-table` do Tabler (tipografia secundária menor, caixa alta, alinhamento)
- [x] 4.2 Estilizar as linhas do Tabulator como o `card-table` do Tabler (separadores inferiores, sem bordas verticais, densidade da captura, hover sutil, conteúdo centralizado)
- [x] 4.3 Estilizar toolbar e footer (inputs `form-control-sm`, paginação com `page-item`/`page-link` do Tabler)

## 5. Testes e QA Visual

- [x] 5.1 `npm run build` e `node --check` nos arquivos alterados
- [x] 5.2 QA visual: card envolve toolbar + tabela + footer; sem card-header; título apenas no page-header
- [x] 5.3 QA visual: "Show entries" altera tamanho da página e recalcula paginação/contagem
- [x] 5.4 QA visual: "Search" filtra (case-insensitive) e esvaziar restaura; footer recalcula
- [x] 5.5 QA visual: paginação navega, página ativa destacada, prev/next desabilitados nos extremos
- [x] 5.6 QA visual: comparação lado a lado com a captura Tabler (header, linhas, densidade, toolbar, footer) e regressão do Dashboard (PageTemplate)
