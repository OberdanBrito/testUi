# app-rendering

## Purpose

Controlar a bootstrap e a renderização da aplicação em JS puro + Vite: o shell é
declarado como slots fixos no `index.html` e composto pelo parser do browser na
carga; o entrypoint `src/main.js` instancia os setores do shell (`Header`,
`Sidebar`) e o `Router` diretamente, sem classe orquestradora de composição. Os
templates `.raw` de componente vivem em satélites da pasta do próprio componente.

## Requirements

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
