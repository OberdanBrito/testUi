## ADDED Requirements

### Requirement: A renderização do shell deve ser controlada por uma classe `Renderer`
O sistema MUST prover uma classe `Renderer` dedicada exclusivamente à mecânica de
renderização do shell da aplicação: receber HTML, injetá-lo no elemento raiz, re-renderizar e
desmontar. A classe SHALL não conhecer composição, templates, rotas nem estado da aplicação.

#### Scenario: Montagem do shell no elemento raiz
- **WHEN** `mount(html)` é chamado com um elemento raiz válido
- **THEN** o `innerHTML` do elemento raiz passa a ser exatamente o HTML informado e
  `isMounted()` retorna `true`

#### Scenario: Re-renderização
- **WHEN** `update(html)` é chamado após uma montagem
- **THEN** o conteúdo do elemento raiz é substituído pelo novo HTML, sem duplicar nós

#### Scenario: Desmontagem
- **WHEN** `unmount()` é chamado
- **THEN** o elemento raiz é esvaziado e `isMounted()` retorna `false`

### Requirement: O elemento raiz deve ser validado na construção
`Renderer` MUST falhar de forma explícita e acionável quando o seletor do elemento raiz não
encontrar um elemento no DOM, em vez de propagar `TypeError` durante a renderização.

#### Scenario: Seletor sem correspondência
- **WHEN** `Renderer` é construído com um seletor que não corresponde a nenhum elemento
- **THEN** é lançado um erro cuja mensagem identifica o seletor ausente

### Requirement: `App` deve compor o shell e orquestrar o ciclo de vida
A classe `App` MUST compor o HTML do shell (header + sidebar) a partir dos templates e
delegar a injeção no DOM ao `Renderer`. `App` SHALL expor `mount()` para iniciar e `destroy()`
para desmontar, e SHALL não reimplementar a escrita no DOM.

#### Scenario: Bootstrap da aplicação
- **WHEN** `mount()` é chamado com um elemento raiz válido
- **THEN** o shell (header com o título, sidebar e `#route-container`) é renderizado e
  `Router` e `Sidebar` são inicializados

#### Scenario: Desmontagem da aplicação
- **WHEN** `destroy()` é chamado após `mount()`
- **THEN** o DOM do elemento raiz é esvaziado e chamadas posteriores a `destroy()` não têm efeito

### Requirement: A rota inicial deve sincronizar o item ativo do menu
A inicialização MUST conectar o `Sidebar` ao `Router` **antes** de `router.init()`, de modo que
a navegação inicial já destaque no menu o item correspondente à rota carregada.

#### Scenario: Carga direta em uma rota do menu
- **WHEN** a aplicação é carregada com o navegador em `/products`
- **THEN** o conteúdo renderizado corresponde a `/products` e o item de menu correspondente
  está com a classe `active` — não o item padrão

#### Scenario: Carga em rota sem rota correspondente
- **WHEN** a aplicação é carregada em um caminho sem rota conhecida
- **THEN** o redirecionamento para a rota padrão acontece e o item correspondente à rota
  padrão é o destacado no menu

### Requirement: Os templates devem ser centralizados num satélite da pasta do app
Os imports `?raw` dos templates (`card`, `header`, `sidebar`) MUST viver num único módulo
satélite em `src/js/components/app/`, no padrão dos arquivos satélite de `components/sidebar/`.
O entrypoint (`src/main.js`) SHALL não importar templates.

#### Scenario: Entrypoint sem templates
- **WHEN** `src/main.js` é inspecionado
- **THEN** ele contém apenas imports de CSS e o bootstrap da aplicação, sem imports de
  templates `.raw`
