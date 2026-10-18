## Context

Hoje a zona superior da tela (título, subtítulo) é definida no constructor de cada feature via `super({ title, subtitle })`. Isso duplica dados que já vivem em `sidebar.items.js` e cria divergências (subtitle do sidebar difere do hardcoded na feature). O Router instancia a feature sem argumentos e chama `mount(container)` sem contexto de rota.

O app seguirá o padrão tabler.io para headers: breadcrumb, pretitle, título à esquerda; botões/ações à direita. A identidade (breadcrumb, título, subtítulo, ícone) pertence ao registro de rotas (`sidebar.items.js`). As ações pertencem à feature. Essas duas responsabilidades precisam coexistir na mesma zona visual sem se misturar.

Restrições: features devem ter constructors simples (`super()` apenas) para permitir composição (feature instanciando feature). Não deve haver injeção de dependência — tudo disponível quando a feature renderiza. O `Router` já resolve o route completo a partir de `sidebar.items.js` antes de chamar `renderRoute`.

## Goals / Non-Goals

**Goals:**
- Criar o objeto `PageHeader` com zona identidade (do route) e zona ações (da feature).
- `MainTemplate.mount(container, route)` orquestra criação do header e expõe `this.route` / `this.header`.
- Constructor da feature vira wiring puro (`super()` apenas).
- Título/subtítulo vêm de `sidebar.items.js` via route — fonte única.
- Feature ganha `renderHeader()` opcional para preencher a zona de ações.
- Router repassa `route` para `mount`.

**Non-Goals:**
- Implementar botões concretos de ação (não há需求 de UI específica ainda — apenas a zona slot).
- Mudar a estrutura de `sidebar.items.js` (nenhum campo novo necessário — `label` e `subtitle` já existem).
- Refatorar o shell `index.html` ou o header global (`#header` / classe `Header`) — é outro header (navbar), não a zona de página.
- Implementar breadcrumb com navegação clicável (a zona identidade pode renderizar texto simples por enquanto).
- Criar templates alternativos (FullWidthTemplate etc.) — apenas a infraestrutura.

## Decisions

### Decisão 1: route via `mount(container, route)`, não via constructor

O route é contexto de renderização, não de construção. A feature é uma classe de comportamento; o route diz onde ela está sendo usada. No constructor, a feature não tem (nem precisa ter) nada a fazer com o route.

- **Alternativa descartada**: `new Feature(route)` — colocaria responsabilidade no constructor, quebrando o princípio de composição (feature instanciando feature não teria como passar route).
- **Alternativa descartada**: injeção via setter antes do mount — desnecessário, o `mount` já é o ponto de encontro entre contexto e renderização.

### Decisão 2: `PageHeader` é criado pelo `MainTemplate`, não pela feature

O template é dono do scaffold (zona visual). O `PageHeader` é parte do scaffold. A feature nunca instancia, nunca injeta, nunca gerencia — só retorna HTML quando chamada. Isso mantém a feature sem responsabilidade sobre o header.

- **Alternativa descartada**: feature cria o PageHeader — colocaria identidade (dados do route) sob comando da feature, misturando zonas.

### Decisão 3: zona identidade preenchida automaticamente, zona ações preenchida por chamada

`PageHeader.mount()` preenche a zona identidade a partir do route (sem intervenção da feature). Depois, `MainTemplate` chama `this.renderHeader()` da feature e injeta o retorno na zona ações via `setActions(html)`. A feature não sabe onde o HTML vai parar — só devolve.

```
mount(container, route)
  ├─ this.route = route
  ├─ container.innerHTML = this.render()      ← scaffold com zonas
  ├─ this.header = new PageHeader(route)      ← identidade pronta
  ├─ this.slot = this.findSlot()
  ├─ this.setHeaderContent(this.renderHeader()) ← zona ações ← feature
  └─ this.setContent(this.renderContent())      ← corpo ← feature
```

### Decisão 4: breadcrumb derivado do `parent_id` do route

`sidebar.items.js` já tem `parent_id`. O `PageHeader` resolve o pai recursivamente e monta `[labelPai, labelItem]` como breadcrumb. Para rotas raiz (`parent_id: null`), breadcrumb é omitido. Pretitle = label do pai (ou omitido para raiz).

- **Alternativa descartada**: campo `breadcrumb` explícito em `sidebar.items.js` — duplicaria hierarquia já expressa por `parent_id`.

### Decisão 5: `renderHeader()` é opcional com default vazio

Se a feature não implementa `renderHeader()`, `MainTemplate` chama `super.renderHeader()` que devolve `''`. Zona ações fica vazia — visualmente invisível. Nenhum erro, nenhuma exigência.

- **Alternativa descartada**: `renderHeader()` abstrato (lança erro) — forçaria toda feature a implementar mesmo sem ações.

### Decisão 6: page.raw ganha estrutura de duas zonas

O scaffold do header passa de:
```html
<header class="page-header">
  <h1>{{title}}</h1>
  <p>{{subtitle}}</p>
</header>
```
Para estrutura com zona identidade e zona ações:
```html
<header class="page-header">
  <div class="page-header-identity">
    <nav class="page-breadcrumb"></nav>   <!-- preenchida pelo PageHeader -->
    <div class="page-pretitle"></div>      <!-- preenchida pelo PageHeader -->
    <h1 class="page-title"></h1>           <!-- preenchida pelo PageHeader -->
    <p class="page-subtitle"></p>          <!-- preenchida pelo PageHeader -->
  </div>
  <div class="page-header-actions"></div>  <!-- preenchida via renderHeader() -->
</header>
```
O `PageHeader` manipula o DOM da zona identidade; a zona ações recebe `innerHTML` do retorno de `renderHeader()`. A interpolação `{{title}}` é removida do scaffold — identidade é DOM, não interpolação.

### Decisão 7: compatibilidade com features existentes

JS ignora argumentos extras. `mount(container, route)` chamado em features que só esperam `container` não quebra. A mudança de constructor (`super({ title, subtitle })` → `super()`) é manual mas trivial. `this.title` / `this.subtitle` deixam de existir em `MainTemplate` — substituídos por `this.route.label` / `this.route.subtitle`.

## Risks / Trade-offs

- [Features existentes que usam `this.title`/`this.subtitle` quebram] → Migração: todas as features são atualizadas no mesmo change; `PageTemplate.render()` usa `this.route.label`/`this.route.subtitle` em vez de `this.title`/`this.subtitle`.
- [Zona identidade preenchida via DOM pode flash (scaffold vazio primeiro)] → O `PageHeader` roda logo após `innerHTML` e antes do browser pintar — sem flash visível em prática.
- [Breadcrumb derivado de `parent_id` não cobre hierarquias não-listadas] → `sidebar.items.js` é flat com `parent_id`; cobre a estrutura atual. Hierarquia mais profunda (neto) suportada por recursão.
- [`renderHeader()` retorna HTML cru — sem escape] → Padrão já usado por `renderContent()` (HTML é intencional). Features controlam seu próprio HTML.
- [Mudança breaking na assinatura de `mount`] → Todas as chamadas de `mount` passam pelo Router (ponto único). Features são as únicas consumidoras indiretas.

## Migration Plan

1. Criar `PageHeader.js` + scaffold novo do `page.raw`.
2. Alterar `MainTemplate.mount(container, route)` + expor `this.route`/`this.header`.
3. Alterar `Router.renderRoute` para passar `route`.
4. Ajustar `PageTemplate.render()` para usar route em vez de `this.title`.
5. Atualizar todas as features: constructor → `super()`, remover title/subtitle.
6. Validação: build + navegação manual em todas as rotas.

Rollback: git revert do change — nenhuma mudança de dados persistidos.

## Open Questions

- `pretitle` para rotas raiz: omitir, ou usar valor fixo (ex: nome da app)? → Decisão: omitir por enquanto (page-header renderiza vazio).
- Zona ações com layout tabler (grid `row`/`col`/`btn-list`): incluir no scaffold desde já ou adicionar quando houver ações concretas? → Decisão: incluir wrapper `.page-header-actions` desde já, estilos tabler quando houver需求 de UI.
