# grid-tabler-visual Specification

## Purpose
Define o chrome de card do Tabler em torno do grid (toolbar, área de tabela e footer), os controles funcionais ligados ao Tabulator e a paridade visual da tabela com o `.table.card-table` do Tabler.

## Requirements

### Requirement: O grid deve ser envolvido pela estrutura de card do Tabler
O scaffold do grid SHALL envolver o container do Tabulator com a estrutura de card do Tabler: um `.card` contendo (a) uma área de toolbar (`.card-body` com borda inferior) com o controle "Show N entries" à esquerda e o controle "Search:" à direita; (b) uma área de tabela (`.table-responsive`) que contém o container `.grid-container` onde o Tabulator é montado; (c) um `.card-footer` com o texto de contagem de registros e a paginação. O scaffold SHALL NÃO incluir `.card-header` com título — o `page-header` existente permanece como único título da página.

#### Scenario: Scaffold renderiza o card em volta do slot
- **WHEN** uma feature de grid é montada
- **THEN** o DOM exibe `.grid-container` dentro de `.table-responsive` dentro de `.card`, com a toolbar antes e o `.card-footer` depois da tabela

#### Scenario: Título único da página
- **WHEN** a página de grid renderiza
- **THEN** o título aparece somente no `page-header`, sem `.card-header` com título duplicado

### Requirement: A toolbar deve controlar tamanho de página e filtro global
A toolbar SHALL ser funcional e ligada à tabela: o input "Show entries" SHALL ajustar o tamanho de página da tabela (paginação recalculada); o input "Search" SHALL aplicar filtro global sobre as linhas (correspondência case-insensitive em qualquer coluna) e SHALL restaurar todas as linhas quando esvaziado. Os controles SHALL usar os componentes de formulário do Tabler (`form-control form-control-sm`).

#### Scenario: Show entries altera o tamanho da página
- **WHEN** o usuário informa um número inteiro positivo no input "Show entries"
- **THEN** a tabela passa a exibir no máximo esse número de linhas por página e a paginação do footer é recalculada

#### Scenario: Search filtra a tabela
- **WHEN** o usuário digita um termo no input "Search"
- **THEN** a tabela exibe apenas as linhas que correspondem ao termo em qualquer coluna e o footer recalcula contagem e paginação

#### Scenario: Search esvaziado restaura as linhas
- **WHEN** o input "Search" é esvaziado
- **THEN** a tabela volta a exibir todas as linhas

### Requirement: O footer deve exibir contagem de registros e paginação funcionais
O `.card-footer` SHALL exibir o texto de contagem no formato `Showing X to Y of Z entries` (X = primeira linha da página atual, Y = última linha da página atual, Z = total de linhas após filtro), recalculado a cada mudança de página, filtro ou tamanho de página. O footer SHALL exibir paginação com botão anterior, numeração de páginas e botão próximo, ligada à paginação da tabela: clicar num número SHALL navegar para a página correspondente; a página atual SHALL aparecer destacada (`.active`); anterior/próximo SHALL ficarem desabilitados nos extremos. Quando houver uma única página, a paginação SHALL permanecer exibida com anterior/próximo desabilitados.

#### Scenario: Contagem de registros correta
- **WHEN** o grid renderiza, muda de página, filtra ou muda o tamanho de página
- **THEN** o texto do footer reflete os valores corretos de X, Y e Z do estado atual da tabela

#### Scenario: Navegação por página
- **WHEN** o usuário clica num número de página
- **THEN** a tabela exibe a página correspondente e o número fica destacado como página ativa

#### Scenario: Extremos da paginação
- **WHEN** a tabela está na primeira página ou na última página
- **THEN** o botão anterior ou o botão próximo, respectivamente, fica desabilitado

### Requirement: A tabela deve replicar o visual card-table do Tabler
A tabela renderizada pelo Tabulator SHALL replicar o visual da tabela do Tabler (`.table.card-table`): cabeçalho com tipografia secundária menor em caixa alta, separadores horizontais entre linhas sem bordas verticais, densidade de linha coerente com a captura de referência, hover sutil nas linhas e conteúdo verticalmente centralizado. O estilo SHALL ser aplicado via CSS sobre as classes do Tabulator, sem alterar o DOM gerado pelo widget.

#### Scenario: Paridade visual do cabeçalho
- **WHEN** a tabela renderiza
- **THEN** o cabeçalho usa tipografia do Tabler (texto secundário, menor, caixa alta) alinhado à esquerda

#### Scenario: Paridade visual das linhas
- **WHEN** a tabela renderiza linhas
- **THEN** as linhas exibem separador inferior, densidade igual à captura de referência e hover sutil
