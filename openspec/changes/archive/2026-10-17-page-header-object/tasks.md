## 1. PageHeader (classe + scaffold)

- [x] 1.1 Criar `src/js/components/templates/PageHeader.js` com constructor que recebe `route` e monta `this.identity = { breadcrumb, pretitle, title, subtitle, icon }` derivados do route (label, subtitle, icon, parent_id)
- [x] 1.2 Implementar em `PageHeader` a resolução de breadcrumb via `parent_id` recursivo no `sidebar.items.js` (omitiro para `parent_id: null`)
- [x] 1.3 Implementar em `PageHeader` o método `mount()` que preenche a zona identidade no DOM (breadcrumb, pretitle, title, subtitle) a partir de `this.identity`
- [x] 1.4 Implementar em `PageHeader` o método `setActions(html)` que injeta HTML na zona `.page-header-actions` via `innerHTML`
- [x] 1.5 Reescrever `templates/page.raw` com estrutura de duas zonas: `.page-header-identity` (breadcrumb, pretitle, title, subtitle) e `.page-header-actions` (slot vazio); remover interpolação `{{title}}`/`{{subtitle}}`

## 2. MainTemplate (mount com route + orquestração do header)

- [x] 2.1 Alterar assinatura de `mount(container)` para `mount(container, route)` em `src/js/components/templates/MainTemplate.js`
- [x] 2.2 Em `mount()`: guardar `this.route = route` antes do render
- [x] 2.3 Em `mount()`: instanciar `this.header = new PageHeader(route)` após injetar scaffold e chamar `this.header.mount()` para preencher zona identidade
- [x] 2.4 Adicionar em `MainTemplate` o método `renderHeader()` padrão que devolve `''`
- [x] 2.5 Adicionar em `MainTemplate` o método `setHeaderContent(html)` que delega para `this.header.setActions(html)` (com guard `if (this.header)`)
- [x] 2.6 Em `mount()`: chamar `this.setHeaderContent(this.renderHeader())` antes de `this.setContent(this.renderContent())`
- [x] 2.7 Remover `this.title` e `this.subtitle` do constructor de `MainTemplate` (identidade agora vive no route/PageHeader)

## 3. PageTemplate (adaptar ao route)

- [x] 3.1 Alterar `PageTemplate.render()` para usar `this.route.label` e `this.route.subtitle` em vez de `this.title`/`this.subtitle` (ou remover interpolação e deixar o PageHeader preencher via DOM)
- [x] 3.2 Simplificar constructor de `PageTemplate`: manter apenas `super()` e `this.template = new Template(pageTemplates.page)`
- [x] 3.3 Verificar se `findSlot()` continua retornando `.page-content` corretamente com o novo scaffold

## 4. Router (repassar route ao mount)

- [x] 4.1 Em `src/js/router.js`, alterar `featureInstance.mount(this.container)` para `featureInstance.mount(this.container, route)`

## 5. Features (simplificar constructors)

- [x] 5.1 `DashboardFeature`: remover `title`/`subtitle` do constructor (deixar apenas `super()`); manter `renderContent()`
- [x] 5.2 Verificar demais features (`analytics`, `reports`, `statistics`, `realtime`, `notifications`, `favourites`, `products`, `inventory`, `orders`, `invoices`, `customers`, `settings`, `account`, `security`, `preferences`) e simplificar constructors para `super()` sem title/subtitle
- [x] 5.3 Remover qualquer `super({ title, subtitle })` restante em features
- [x] 5.4 Adicionar `renderHeader()` de exemplo em `DashboardFeature` (botão simples) para validar a zona de ações

## 6. Verificação

- [x] 6.1 Rodar build do projeto e corrigir erros
- [x] 6.2 Navegar manualmente em todas as rotas do sidebar e verificar: título/subtítulo corretos (de sidebar.items.js), breadcrumb em sub-rotas, zona ações com botão no Dashboard, slot de conteúdo preenchido
- [x] 6.3 Verificar que rotas sem `renderHeader()` mostram zona ações vazia sem erro
- [x] 6.4 Verificar composição: instanciar uma feature dentro de outra (exemplo simples) sem conflito de constructor
