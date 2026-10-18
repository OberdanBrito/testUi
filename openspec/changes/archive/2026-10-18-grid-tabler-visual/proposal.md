# grid-tabler-visual

## Why

O grid (GridTemplate + CustomTabulator) renderiza a tabela "crua", sem o chrome visual do Tabler.io: a captura de referência (Tabler UI Kit — Invoices) mostra a tabela dentro de um card com toolbar (Show N entries / Search), tabela com estilo `card-table` e footer com contagem de registros e paginação. Sem isso o widget não entrega o visual esperado do design system adotado (`@tabler/core`).

## What Changes

- `templates/grid.raw` passa a envolver o container do Tabulator com a estrutura de card do Tabler: área de toolbar (`.card-body` com "Show N entries" à esquerda e "Search:" à direita), área de tabela (`.table-responsive` contendo o slot `.grid-container`) e `.card-footer` com "Showing X to Y of Z entries" + paginação numerada (prev/next + páginas).
- **Sem card-header com título**: o `page-header` existente continua sendo o único título da página (decisão do dono).
- Toolbar funcional: o input "Show entries" ajusta o `pageSize` do Tabulator; o input "Search" aplica filtro global (`setFilter`).
- Footer funcional: o texto de contagem é calculado a partir do estado do Tabulator (página atual × tamanho × total); a paginação numerada navega via `setPage`, com página ativa destacada e prev/next desabilitados nos extremos.
- O visual da tabela renderizada pelo Tabulator passa a replicar o estilo da tabela do Tabler (`card-table`): cabeçalho com tipografia menor/caixa alta, separadores de linha, densidade, hover e alinhamentos conforme a captura.
- Perfil global do grid passa a incluir paginação (`pagination`, `paginationSize`) como propriedade estrutural do sistema (não pode ser desligada pela feature, senão o footer quebra).
- **FORA DE ESCOPO** (decisão do dono): colunas/formatadores do exemplo (checkbox de seleção, badges de status com ponto, bandeiras, dropdown "Actions") — continuam por conta das features.

## Capabilities

### New Capabilities
- `grid-tabler-visual`: chrome de card do Tabler em torno do grid (toolbar, área de tabela, footer), controles funcionais ligados ao Tabulator e paridade visual com a tabela do Tabler.

### Modified Capabilities
- `grid-template`: o scaffold de `templates/grid.raw` passa a conter a estrutura de card (toolbar + `.table-responsive` + footer) em volta do container `.grid-container`; o `GridTemplate` passa a wirear toolbar e footer à instância do Tabulator.
- `custom-tabulator`: `GRID_DEFAULTS` passa a conter `pagination` e `paginationSize`; `SYSTEM_OWNED_KEYS` passa a incluir `pagination`.

## Impact

- `templates/grid.raw` (markup do scaffold)
- `src/js/components/templates/GridTemplate.js` (wiring toolbar/footer ↔ Tabulator)
- `src/js/components/tabulator/tabulator.defaults.js` (perfil de paginação)
- `src/css/` (CSS de paridade visual do Tabulator com o card-table do Tabler)
- `src/js/features/customers/CustomersFeature.js` (apenas se necessário para o QA visual de demo)
- Sem mudanças de dependência (`@tabler/core` e `tabulator-tables` já presentes)
