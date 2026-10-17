# Delta: html-slots

## ADDED Requirements

### Requirement: O shell deve ser declarado como slots no index.html
O `index.html` MUST declarar a estrutura fixa do shell da aplicação contendo os
slots `#header`, `#sidebar` e `#content`, e essa estrutura SHALL ser composta
pelo parser do browser na carga da página. O sistema SHALL não compor o shell
via concatenação de templates nem injetá-lo via `innerHTML` em um elemento raiz
genérico.

#### Scenario: Estrutura do shell no index.html
- **WHEN** o `index.html` é inspecionado
- **THEN** ele contém os slots `#header`, `#sidebar` e `#content` dentro do
  container de layout da aplicação, e nenhum JS compõe essa estrutura em
  tempo de execução

#### Scenario: Container de conteúdo único
- **WHEN** a aplicação está em execução
- **THEN** `#content` é o único slot cujo conteúdo muda em runtime (a cada
  navegação); `#header` e `#sidebar` permanecem montados continuamente

### Requirement: O header deve ter markup estático e classe só de comportamento
O markup do header MUST viver diretamente no `index.html` dentro do slot
`#header`. A classe `Header` SHALL existir apenas para amarração de
comportamento (theme toggle, sidebar toggle, busca) nos elementos já
presentes no DOM, e SHALL não injetar HTML no slot.

#### Scenario: Markup do header no HTML
- **WHEN** o `index.html` é inspecionado
- **THEN** o markup da navbar (toggle do sidebar, brand, busca, theme toggle)
  está presente dentro de `#header` como HTML estático

#### Scenario: Classe Header amarra comportamento
- **WHEN** a aplicação inicia e o `Header` é inicializado
- **THEN** o botão de tema alterna light/dark e o toggle do sidebar colapsa o
  menu, sem nenhuma injeção de HTML pelo `Header`

### Requirement: O menu do sidebar deve ser data-driven e montado uma única vez
O `Sidebar` MUST montar o menu a partir de `sidebar.items.js` (mantido como
fonte única de rotas e do menu) injetando-o no slot `#sidebar`, em uma única
montagem durante a inicialização. O markup do menu SHALL não viver no
`index.html` nem em template `.raw` de shell.

#### Scenario: Montagem única do menu
- **WHEN** a aplicação inicia
- **THEN** o menu é renderizado uma única vez no slot `#sidebar` a partir de
  `sidebar.items.js`, com categorias e itens-folha corretos

#### Scenario: sidebar.items.js como fonte única
- **WHEN** o registro de rotas é inspecionado
- **THEN** `sidebar.items.js` alimenta tanto a renderização do menu quanto a
  resolução de rotas do `Router`

### Requirement: A ativação de item do menu deve ser toggle de classe
`setActiveItem(id)` do `Sidebar` MUST alterar a classe `active` diretamente
nos nós de menu existentes, sem re-renderizar o menu. O estado visual de
itens abertos (ex.: submenu expandido) SHALL ser preservado entre
navegações.

#### Scenario: Navegação preserva submenu aberto
- **WHEN** o usuário expande um submenu, navega para um item desse submenu, e
  a rota é resolvida
- **THEN** o item correspondente ganha `active`, os demais perdem, e o
  submenu permanece expandido

#### Scenario: Troca de item ativo
- **WHEN** a navegação muda de uma rota para outra
- **THEN** apenas as classes `active` dos itens são atualizadas, sem
  reconstrução de nós do menu

### Requirement: O Router deve montar o conteúdo em #content com destruição opt-in
O `Router` MUST montar a feature de cada rota no slot `#content`. Na troca de
rota, o `Router` SHALL chamar `destruir()` na feature atual quando esse
método existir (opt-in), antes de montar a nova feature.

#### Scenario: Navegação entre rotas
- **WHEN** o Router navega de uma rota com feature para outra
- **THEN** `destruir()` é chamado na feature atual (se implementado), a nova
  feature é montada em `#content`, e nada mais do shell é re-renderizado

#### Scenario: Feature sem destruir
- **WHEN** a feature atual não implementa `destruir()`
- **THEN** a navegação prossegue normalmente, montando a nova feature em
  `#content`

### Requirement: O bootstrap deve inicializar os setores do shell diretamente
O entrypoint `src/main.js` MUST inicializar a aplicação instanciando
`Header`, `Sidebar` e `Router` (apontando para `#content`) diretamente, sem
classe orquestradora de composição. O entrypoint SHALL não importar templates
`.raw`.

#### Scenario: Bootstrap da aplicação
- **WHEN** `src/main.js` é inspecionado
- **THEN** ele importa CSS e instancia os setores do shell e o `Router`, sem
  imports de templates `.raw` e sem classes orquestradoras de composição do
  shell

#### Scenario: Rota inicial sincroniza o menu
- **WHEN** a aplicação é carregada diretamente em uma rota do menu
- **THEN** o `Sidebar` é conectado ao `Router` antes de `router.init()`, de
  modo que a navegação inicial já destaca o item correspondente
