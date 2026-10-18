## 1. Setup

- [x] 1.1 Criar `src/js/components/tabulator/tabulator.defaults.js` exportando `GRID_DEFAULTS` (com `layout`, `rowHeight`, `responsiveLayout`, `placeholder`, `columnDefaults`) e `SYSTEM_OWNED_KEYS` (com `layout`, `rowHeight`, `responsiveLayout`)

## 2. Core Implementation

- [x] 2.1 Criar `src/js/components/tabulator/CustomTabulator.js` com `class CustomTabulator extends Tabulator`, constructor `(element, featureOptions = {})` que chama `super(element, resolvedOptions)`
- [x] 2.2 Implementar a resolução das opções: mesclar `{ ...GRID_DEFAULTS, ...featureOptions }` e reforçar as chaves de `SYSTEM_OWNED_KEYS` com o valor de `GRID_DEFAULTS` (precedência P2)
- [x] 2.3 Implementar deep-merge de `columnDefaults` (`{ ...GRID_DEFAULTS.columnDefaults, ...featureOptions.columnDefaults }`) sem descartar as chaves globais
- [x] 2.4 Alterar `GridTemplate.renderContent(slot)` para instanciar `new CustomTabulator(slot, this.renderGridConfig())` e importar `CustomTabulator` de `src/js/components/tabulator/CustomTabulator.js` (remover o import direto do `Tabulator`)
- [x] 2.5 Remover `layout: 'fitColumns'` de `CustomersFeature.renderGridConfig()` (layout passa a ser de propriedade do sistema)

## 3. Testes e QA Visual

[x] 3.1 QA visual: `CustomersFeature` renderiza dentro de `.grid-container` com o `layout` do perfil global (não mais `fitColumns`)
[x] 3.2 QA visual: grid respeita `rowHeight` e o alinhamento de `columnDefaults` (header à esquerda, célula verticalmente centralizada)
[x] 3.3 QA visual: precedência P2 — enviar `layout` pela feature não sobrescreve o valor do sistema
[x] 3.4 Regressão: `DashboardFeature` (PageTemplate) renderiza idêntico ao antes da mudança
[x] 3.5 Rodar `npm run build` e validar que o bundle compila com a pasta `tabulator/`
