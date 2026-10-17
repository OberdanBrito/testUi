# Delta: page-rendering

## ADDED Requirements

### Requirement: As telas de recurso devem usar o template de tela principal
O sistema MUST renderizar toda rota-folha dentro de um template de tela
principal composto por container principal, título, subtítulo e um slot de
conteúdo do recurso. O template SHALL replicar o padrão de design visual do
app, de modo que a experiência seja padronizada entre as telas.

#### Scenario: Renderização de uma rota com feature
- **WHEN** o `Router` navega para uma rota-folha com feature associada
- **THEN** a tela renderiza o container principal com título e subtítulo
  provenientes do registro de rotas e o conteúdo devolvido por
  `feature.render(route)` no slot de conteúdo

#### Scenario: Renderização de uma rota sem feature
- **WHEN** o `Router` navega para uma rota-folha sem feature associada
- **THEN** a tela renderiza o mesmo container principal com título e subtítulo,
  com o slot de conteúdo exibindo o placeholder de "feature em desenvolvimento"

### Requirement: O título e o subtítulo devem vir do registro de rotas
O título e o subtítulo da tela principal MUST ser lidos de `sidebar.items.js`
(fonte única de verdade das rotas), a partir do item correspondente à rota. As
features SHALL não definir título ou subtítulo de tela.

#### Scenario: Item de rota com subtítulo
- **WHEN** a rota resolvida tem `subtitle` preenchido em `sidebar.items.js`
- **THEN** a tela principal exibe esse subtítulo abaixo do título

#### Scenario: Item de rota sem subtítulo
- **WHEN** a rota resolvida tem `subtitle` vazio ou ausente em `sidebar.items.js`
- **THEN** a tela principal exibe apenas o título, sem elemento de subtítulo
  vazio ou resíduo visível na tela

### Requirement: O objeto da tela principal deve morar na pasta de componentes
O template de tela principal MUST existir como markup em `templates/` e como
objeto instanciável em `src/js/components/page/`, no padrão de componente com
arquivos satélite do projeto. A montagem do DOM da página SHALL ser feita por
esse objeto, e o conteúdo do recurso SHALL ser injetado via DOM no slot, sem
passar pelo motor de interpolação.

#### Scenario: Instanciação da página
- **WHEN** a página é criada com `{ title, subtitle }` e renderizada
- **THEN** o HTML resultante contém o container principal com título e
  subtítulo interpolados e um slot de conteúdo vazio

#### Scenario: Injeção de conteúdo com marcadores de interpolação
- **WHEN** o conteúdo devolvido pela feature contém a sequência `{{qualquer}}`
- **THEN** essa sequência aparece literalmente no slot, sem ser interpretada
  pelo motor `Template`

### Requirement: O contrato de recurso deve ser `render(route)`
Toda feature associada a uma rota MUST expor `render(route)` devolvendo o HTML
do conteúdo da tela. O `Router` SHALL montar a página principal e injetar o
resultado de `render(route)` no slot de conteúdo.

#### Scenario: Feature sem `render`
- **WHEN** a rota tem `feature` associada que não expõe `render`
- **THEN** o `Router` trata a rota como sem feature e exibe o placeholder de
  conteúdo, mantendo título e subtítulo da página
