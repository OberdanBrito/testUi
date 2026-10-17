# Tasks: html-slots-shell

## 1. index.html: slots e markup do header

- [x] 1.1 Reestruturar `index.html`: substituir `<div id="app"></div>` pelos slots `#header`, `#sidebar` e `#content` dentro do container de layout, preservando as classes de layout Tabler esperadas pelo CSS
- [x] 1.2 Mover o markup estático do header (migrado fielmente de `templates/header.raw`) para dentro de `#header` no `index.html`

## 2. Header: classe de comportamento

- [x] 2.1 Criar `src/js/components/header/header.js` com a classe `Header`: `init()` amarra theme toggle, sidebar toggle (`.sidebar-toggle`), outside click e busca nos elementos já existentes no DOM
- [x] 2.2 Mover para `Header` a lógica de tema que hoje vive no `Sidebar` (`applySavedTheme`, `updateThemeIcon`, `bindThemeToggle`) quando referente ao header; `Sidebar` mantém o que for do menu
- [x] 2.3 Verificar que `Header` não injeta HTML em lugar nenhum (somente querySelector + addEventListener)

## 3. Sidebar: mount no slot e toggle de classe

- [x] 3.1 Adaptar `Sidebar` para montar no slot `#sidebar` (query do slot, sem depender da estrutura montada pelo `App`)
- [x] 3.2 Remover o uso de `templates/sidebar.raw`: o markup estrutural do sidebar passa a existir no `index.html` (fora do menu), e o menu (`.menu-list`) é preenchido pela classe
- [x] 3.3 Reescrever `setActiveItem(id)`/`clearActiveItems()` como toggle de classe `active` nos nós existentes (busca por `[data-id]`), sem chamar `renderMenu()`
- [x] 3.4 Garantir que `renderMenu()` roda uma única vez, no `mount()`/`init()`

## 4. Router: #content e destruição opt-in

- [x] 4.1 Alterar o seletor padrão/uso do `Router` para `#content` (troca de `#route-container`)
- [x] 4.2 Em `renderRoute`, antes de montar a nova feature, chamar `this.currentFeature?.destruir?.()` e guardar a feature atual montada
- [x] 4.3 Verificar que o placeholder de rota sem feature continua funcionando dentro de `#content`

## 5. Bootstrap

- [x] 5.1 Reescrever `src/main.js`: imports de CSS + instanciação direta de `new Header().init()`, `new Sidebar(sidebarItems)` com slot `#sidebar`, e `new Router('#content')`, conectando sidebar ao router antes de `router.init()`
- [x] 5.2 Garantir que a rota inicial destaca o item de menu correto (sincronização antes do `init`)

## 6. Remoção do modelo antigo

- [x] 6.1 Remover `src/js/components/app/` (`app.js`, `renderer.js`, `app.templates.js`)
- [x] 6.2 Remover `templates/header.raw`, `templates/sidebar.raw` e `templates/card.raw` (card sem uso)
- [x] 6.3 Remover a pasta `src/js/components/sidebar/sidebar.imports.js` se ficar sem imports
- [x] 6.4 Verificar que não restam imports quebrados de `App`/`Renderer`/templates removidos

## 7. Verificação

- [x] 7.1 Rodar `npm run build` sem erros
- [x] 7.2 QA visual no browser: header estático com tema e toggles funcionando; sidebar com menu completo; navegação entre rotas trocando só `#content`
- [x] 7.3 QA do bugfix: expandir submenu, navegar para item do submenu → submenu permanece expandido e item ativo
- [x] 7.4 QA dark mode: header e sidebar coerentes no tema escuro
- [x] 7.5 QA de carga direta em rota (refresh em `/products`): conteúdo e item de menu corretos
