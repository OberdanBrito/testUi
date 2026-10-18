# custom-tabulator Specification

## Purpose
Define a classe `CustomTabulator` (extensão do `Tabulator` que injeta um perfil global de grid) e o perfil `GRID_DEFAULTS`, estabelecendo quais propriedades são de propriedade do sistema e como a configuração da feature se combina com o perfil.

## Requirements

### Requirement: Deve existir a classe CustomTabulator estendendo Tabulator
O sistema MUST prover uma classe `CustomTabulator` em `src/js/components/tabulator/CustomTabulator.js` que estende `Tabulator` (de `tabulator-tables`). O constructor SHALL receber `(element, featureOptions = {})` e SHALL chamar `super(element, resolvedOptions)` com as opções resolvidas pela combinação do perfil global e das opções da feature. Uma instância de `CustomTabulator` SHALL ser também instância de `Tabulator` (`instanceof Tabulator` verdadeiro). A classe SHALL receber o perfil de `src/js/components/tabulator/tabulator.defaults.js`.

#### Scenario: Instanciação de CustomTabulator
- **WHEN** `new CustomTabulator(element, { columns, data })` é executado com um elemento DOM válido
- **THEN** uma tabela Tabulator é montada no elemento e a instância satisfaz `instanceof CustomTabulator` e `instanceof Tabulator`

#### Scenario: CustomTabulator sem opções de feature
- **WHEN** `new CustomTabulator(element)` é executado sem opções
- **THEN** a tabela é montada usando apenas o perfil global, sem erro

### Requirement: O perfil global GRID_DEFAULTS deve existir num satélite importável
O sistema MUST prover `src/js/components/tabulator/tabulator.defaults.js` exportando o objeto `GRID_DEFAULTS` e o array `SYSTEM_OWNED_KEYS`. `GRID_DEFAULTS` SHALL conter as chaves `layout`, `rowHeight`, `responsiveLayout`, `placeholder` e `columnDefaults`. `columnDefaults` SHALL conter `headerHozAlign` e `vertAlign`. `SYSTEM_OWNED_KEYS` SHALL conter exatamente as chaves estruturais `layout`, `rowHeight` e `responsiveLayout`.

#### Scenario: Perfil global exposto
- **WHEN** `GRID_DEFAULTS` é importado
- **THEN** contém `layout`, `rowHeight`, `responsiveLayout`, `placeholder` e `columnDefaults`

#### Scenario: Chaves de propriedade do sistema expostas
- **WHEN** `SYSTEM_OWNED_KEYS` é importado
- **THEN** contém `layout`, `rowHeight` e `responsiveLayout`

### Requirement: As chaves estruturais são de propriedade do sistema
A resolução das opções SHALL tratar as chaves de `SYSTEM_OWNED_KEYS` como de propriedade do sistema: o valor de `GRID_DEFAULTS` SHALL prevalecer sobre qualquer valor enviado pela feature. As demais chaves de `GRID_DEFAULTS` (`placeholder`, `columnDefaults`) SHALL funcionar como baseline, podendo ser ajustadas pela feature. Chaves exclusivas da feature (`data`, `columns`) SHALL ser preservadas.

#### Scenario: Feature não sobrescreve chave estrutural
- **WHEN** a feature envia `layout: 'fitColumns'` em `renderGridConfig()`
- **THEN** a tabela usa o `layout` de `GRID_DEFAULTS`, ignorando o valor da feature

#### Scenario: Feature fornece dados e colunas
- **WHEN** a feature envia `{ columns, data }` em `renderGridConfig()`
- **THEN** a tabela renderiza com as colunas e os dados da feature

#### Scenario: Feature ajusta baseline extensível
- **WHEN** a feature envia `placeholder: 'Nenhum registro'`
- **THEN** a tabela usa o `placeholder` da feature em vez do baseline

### Requirement: columnDefaults deve ser mesclado em profundidade
A resolução das opções SHALL fazer deep-merge de `columnDefaults`: o resultado SHALL conter as chaves de `GRID_DEFAULTS.columnDefaults` combinadas com as chaves enviadas pela feature, sem descartar as globais quando a feature envia o seu próprio `columnDefaults`.

#### Scenario: Deep-merge preserva alinhamento global
- **WHEN** a feature envia `columnDefaults: { width: 100 }`
- **THEN** o `columnDefaults` resultante contém `headerHozAlign` e `vertAlign` do perfil global e `width` da feature

#### Scenario: Perfil global aplicado sem columnDefaults da feature
- **WHEN** a feature não envia `columnDefaults`
- **THEN** o `columnDefaults` resultante é exatamente o de `GRID_DEFAULTS`

### Requirement: O GridTemplate deve instanciar CustomTabulator
O `GridTemplate` SHALL implementar `renderContent(slot)` instanciando `new CustomTabulator(slot, this.renderGridConfig())` e SHALL guardar a instância em `this.tabulator`. O `GridTemplate` SHALL importar `CustomTabulator` de `src/js/components/tabulator/CustomTabulator.js` e SHALL NÃO instanciar o `Tabulator` cru diretamente.

#### Scenario: GridTemplate cria o CustomTabulator internamente
- **WHEN** uma feature de grid é montada e `GridTemplate.renderContent(slot)` executa
- **THEN** um `CustomTabulator` é instanciado dentro de `.grid-container` usando `this.renderGridConfig()`, e `this.tabulator` é uma instância de `CustomTabulator`

#### Scenario: GridTemplate não instancia Tabulator cru
- **WHEN** o `GridTemplate` é inspecionado
- **THEN** a instanciação do widget usa `CustomTabulator`, não o `Tabulator` cru
