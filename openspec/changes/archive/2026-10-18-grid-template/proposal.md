## Why

Telas de dados em tabela (com Tabulator) não podem ser construídas dentro do contrato atual de templates: `renderContent()` só devolve uma string HTML, e o Tabulator é um widget que precisa de um elemento DOM vivo para se montar. O `GridTemplate` é o segundo template concreto do sistema — o primeiro teste real do modelo de herança — e ao mesmo tempo a oportunidade de evoluir o contrato de renderizado para suportar os dois caminhos: features simples devolvem HTML, features com widget recebem o container de destino.

## What Changes

- Novo `GridTemplate` em `src/js/components/templates/`: estende `MainTemplate`, implementa `render()` (scaffold com container `.grid-container`) e `findSlot()`. Não implementa `renderContent()` — cada feature escolhe o caminho.
- Novo template `templates/grid.raw` + satélite `grid.imports.js` (mesmo padrão de `page.imports.js`).
- **BREAKING** (contrato da base, retrocompatível em runtime): `MainTemplate.renderContent()` passa a receber o slot como argumento (`renderContent(slot)`). Features existentes não declaram o parâmetro e continuam funcionando — JavaScript ignora argumentos extras. A partir daí uma feature pode: (a) devolver string HTML (comportamento atual, ignorando o slot) ou (b) usar o slot recebido para montar um widget (Tabulator), não devolvendo nada.
- Nova dependência `tabulator-tables` no `package.json` (hoje o projeto só tem `@tabler/core`).
- `PageHeader` e todo o `mount()` herdados inalterados — o `GridTemplate` ganha header automático (breadcrumb, título do route, zona ações).
- Sem feature de exemplo: o escopo é a infraestrutura. Validade via montagem do scaffold + QA visual (slot presente, header herdado, zona ações funcionando).

## Capabilities

### New Capabilities
- `grid-template`: scaffold de tela de dados em Grid (container `.grid-container`) via `GridTemplate`, e o contrato de renderizado de dois caminhos (`renderContent` devolve HTML ou recebe o slot para montar widgets como Tabulator).

### Modified Capabilities
- `template-inheritance`: o contrato da base muda — `renderContent()` abstrato passa a receber o slot de destino; o `mount()` repassa `this.slot` na chamada; documentação dos dois caminhos de renderização na hierarquia.
- `page-rendering`: a exigência "feature implementa `renderContent()` devolvendo HTML" passa a admitir o segundo caminho — a feature pode receber o slot e montar um widget no lugar de devolver string.
- `feature-template-selection`: a exigência "feature implementa `renderContent()` devolvendo o HTML do conteúdo" passa a refletir o contrato de dois caminhos (HTML string via `renderContent()`, ou container via slot recebido).

## Impact

- `src/js/components/templates/MainTemplate.js` — `renderContent(slot)` + `mount()` repassa `this.slot`
- `src/js/components/templates/GridTemplate.js` — novo
- `src/js/components/templates/grid.imports.js` — novo (import `?raw` do `grid.raw`)
- `templates/grid.raw` — novo scaffold (mesma estrutura de `page.raw`: header zone + `.grid-container`)
- `package.json` — dependência `tabulator-tables`
- `src/js/features/dashboard/DashboardFeature.js` — inalterada (retrocompatível)
- Estilos do container de grid no `main.css` (ou `grid.css` importado)
- Lifecycle: instância de Tabulator criada via slot deve ser guardada (`this.tabulator`) para destruição futura — fora do escopo deste change (sem feature de exemplo usando Tabulator ainda)
