## 1. Setup

- [x] 1.1 Adicionar `tabulator-tables` ao `package.json` e instalar (`npm install tabulator-tables`)
- [x] 1.2 Criar `templates/grid.raw` com scaffold espelhando `page.raw` (zona do header + `<div class="grid-container"></div>`)
- [x] 1.3 Criar satélite `src/js/components/templates/grid.imports.js` com import `?raw` de `../../../../templates/grid.raw` (padrão de `page.imports.js`)

## 2. Core Implementation

- [x] 2.1 Alterar `MainTemplate.renderContent()` para recber o slot: `renderContent(slot)` mantendo o `throw` do contrato abstrato
- [x] 2.2 Alterar o passo 7 do `MainTemplate.mount()`: `const content = this.renderContent(this.slot); if (content) { this.setContent(content); }` — guard obrigatório para não apagar widget montado no slot com `setContent('')`
- [x] 2.3 Criar `src/js/components/templates/GridTemplate.js` — `extends MainTemplate`, constructor com `super()` + `this.template = new Template(gridTemplates.grid)`, `render()` e `findSlot()` (`.grid-container`)
- [x] 2.4 Importar o CSS do Tabulator no build (import no entrypoint ou `<link>` no `index.html`, mantendo o padrão do main.css)

## 3. Testes e QA Visual

- [x] 3.1 Testar caminho HTML string: montar um GridTemplate com feature que devolve HTML string — conteúdo aparece dentro de `.grid-container` após o mount
- [x] 3.2 Testar caminho widget: montar um GridTemplate com feature que faz `new Tabulator(slot, { columns, data })` em `renderContent(slot)` — tabela renderiza dentro de `.grid-container` e `this.tabulator` fica guardada
- [x] 3.3 QA visual do scaffold puro: GridTemplate montado diretamente (sem feature) lança o erro de `renderContent()` do base
- [x] 3.4 QA visual do header herdado: GridTemplate montado com feature exibe breadcrumb, título do route e zona ações preenchida por `renderHeader()`
- [x] 3.5 Regressão: `DashboardFeature` (renderContent sem parâmetro `slot`) renderiza idêntico ao antes da mudança
- [x] 3.6 Rodar `npm run build` e validar que o bundle compila com a dependência Tabulator
