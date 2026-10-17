# Delta: app-rendering

## REMOVED Requirements

### Requirement: A renderização do shell deve ser controlada por uma classe `Renderer`
**Reason**: O shell não é mais composto nem injetado via JS. A estrutura
(header, sidebar, container de conteúdo) é declarada como slots no
`index.html` e composta pelo parser do browser na carga; não há injeção de
shell via `innerHTML` em um elemento raiz.
**Migration**: Remover `src/js/components/app/renderer.js`. A montagem do
shell passa a ser responsabilidade do `index.html`; a única troca de DOM em
runtime acontece no slot `#content`, feita pelo `Router` via
`mount()`/`replaceChildren` das features.

### Requirement: O elemento raiz deve ser validado na construção
**Reason**: A classe `Renderer` foi removida; não existe mais construção de
renderizador com seletor de elemento raiz a validar.
**Migration**: Não aplicável — sem substituto. Slots ausentes no `index.html`
falham visivelmente no QA visual.

### Requirement: `App` deve compor o shell e orquestrar o ciclo de vida
**Reason**: A composição do shell via concatenação de templates `.raw` e
inyeção pelo `Renderer` foi substituída por slots estáticos no `index.html`.
A orquestração passa a ser o bootstrap direto em `src/main.js`, que instancia
`Header`, `Sidebar` e `Router`.
**Migration**: Remover `src/js/components/app/` (`app.js`, `renderer.js`,
`app.templates.js`) e `templates/header.raw`. O bootstrap em `src/main.js`
instancia os setores do shell diretamente (ver capability `html-slots`).

## MODIFIED Requirements

### Requirement: Os templates devem ser centralizados num satélite da pasta do app
Os imports `?raw` dos templates MUST viver em módulos satélite no padrão dos
arquivos satélite de `components/sidebar/`: os templates de componente na
própria pasta do componente (ex.: `src/js/components/templates/page.imports.js`).
Os templates de shell (`header`, `sidebar`) SHALL não existir: o markup do
header vive estático no `index.html` e o menu do sidebar é montado pelo
`Sidebar` a partir de `sidebar.items.js`, sem template `.raw`. O entrypoint
(`src/main.js`) SHALL não importar templates.

#### Scenario: Entrypoint sem templates
- **WHEN** `src/main.js` é inspecionado
- **THEN** ele contém apenas imports de CSS e o bootstrap da aplicação, sem
  imports de templates `.raw`

#### Scenario: Template de componente importado pelo próprio componente
- **WHEN** o template `page.raw` é inspecionado
- **THEN** seu import `?raw` vive em
  `src/js/components/templates/page.imports.js` e não em um satélite do app

#### Scenario: Sem templates de shell
- **WHEN** o repositório é inspecionado
- **THEN** não existem `templates/header.raw`, `templates/sidebar.raw` nem
  módulo satélite de imports na pasta `components/app/`
