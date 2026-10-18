# custom-tabulator Delta Specification

## MODIFIED Requirements

### Requirement: O perfil global GRID_DEFAULTS deve existir num satélite importável
O sistema MUST prover `src/js/components/tabulator/tabulator.defaults.js` exportando o objeto `GRID_DEFAULTS` e o array `SYSTEM_OWNED_KEYS`. `GRID_DEFAULTS` SHALL conter as chaves `layout`, `rowHeight`, `responsiveLayout`, `placeholder`, `pagination`, `paginationSize` e `columnDefaults`. `columnDefaults` SHALL conter `headerHozAlign` e `vertAlign`. `SYSTEM_OWNED_KEYS` SHALL conter exatamente as chaves estruturais `layout`, `rowHeight`, `responsiveLayout` e `pagination`.

#### Scenario: Perfil global exposto
- **WHEN** `GRID_DEFAULTS` é importado
- **THEN** contém `layout`, `rowHeight`, `responsiveLayout`, `placeholder`, `pagination`, `paginationSize` e `columnDefaults`

#### Scenario: Chaves de propriedade do sistema expostas
- **WHEN** `SYSTEM_OWNED_KEYS` é importado
- **THEN** contém `layout`, `rowHeight`, `responsiveLayout` e `pagination`

### Requirement: As chaves estruturais são de propriedade do sistema
A resolução das opções SHALL tratar as chaves de `SYSTEM_OWNED_KEYS` como de propriedade do sistema: o valor de `GRID_DEFAULTS` SHALL prevalecer sobre qualquer valor enviado pela feature. As demais chaves de `GRID_DEFAULTS` (`placeholder`, `columnDefaults`, `paginationSize`) SHALL funcionar como baseline, podendo ser ajustadas pela feature. Chaves exclusivas da feature (`data`, `columns`) SHALL ser preservadas.

#### Scenario: Feature não sobrescreve chave estrutural
- **WHEN** a feature envia `layout: 'fitColumns'` em `renderGridConfig()`
- **THEN** a tabela usa o `layout` de `GRID_DEFAULTS`, ignorando o valor da feature

#### Scenario: Feature não desliga a paginação
- **WHEN** a feature envia `pagination: false` em `renderGridConfig()`
- **THEN** a tabela mantém a paginação ativa do `GRID_DEFAULTS`, ignorando o valor da feature

#### Scenario: Feature fornece dados e colunas
- **WHEN** a feature envia `{ columns, data }` em `renderGridConfig()`
- **THEN** a tabela renderiza com as colunas e os dados da feature

#### Scenario: Feature ajusta baseline extensível
- **WHEN** a feature envia `placeholder: 'Nenhum registro'`
- **THEN** a tabela usa o `placeholder` da feature em vez do baseline
