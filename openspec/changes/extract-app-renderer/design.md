## Context

`src/main.js` (58 linhas) contém `Template`, `App` e o bootstrap. O projeto é um boilerplate
de testes de UI em JS puro + Vite, com templates HTML `.raw` importados como string, e usa
**100% classes** (README). O padrão de pasta observado é:

- classe de aplicação em arquivo solto de `src/js/` (`router.js`);
- classe de componente com arquivos satélite em `src/js/components/<nome>/` (`sidebar/` tem
  `sidebar.js`, `sidebar.items.js`, `sidebar.imports.js`);
- pasta futura `src/js/features/` já referenciada em `sidebar.imports.js:6-9`.

O `README.md:108-141` documenta `App`/`Template` como classes próprias, mas o código atual
as mantém inline no entrypoint.

## Goals / Non-Goals

**Goals:**
- Extrair a mecânica de renderização para a classe `Renderer` em `src/js/components/app/`.
- Extrair `App` (composição + wiring + lifecycle) e `Template` (motor `{{chave}}`).
- Centralizar os imports `?raw` num satélite `app.templates.js`.
- Corrigir no caminho: root não validado, ordem de init Router/Sidebar, import morto do
  `cardTemplate`, ausência de `unmount`/`destroy`.
- Deixar `src/main.js` como entrypoint puro.

**Non-Goals:**
- Não alterar `src/js/router.js` nem `src/js/components/sidebar/*` (inclusive o bug de
  `preventDefault` dos links do menu e os listeners de `document`/`window`).
- Não trocar o motor de template (mantém a interpolação `{{chave}}` atual).
- Não criar as features de `src/js/features/` nem renderizar conteúdo de rota com `card.raw`.
- Não alterar CSS, templates `.raw` nem dependências.

## Decisions

- **`Renderer` é deliberadamente fina** — só DOM (validar root, `mount`, `update`, `unmount`,
  `isMounted`). Composição e dados ficam em `App`. Racional: o usuário pediu uma classe
  "dedicada só à renderização (injetar HTML no DOM, gerenciar re-render)", separada do App
  que cuida de composição/estado.
- **Pasta `src/js/components/app/`** (escolha do usuário), seguindo o padrão de
  `components/sidebar/` com arquivo satélite `app.templates.js`.
- **`Template` em `src/js/template.js`** (escolha do usuário): motor genérico é
  infraestrutura, coerente com `router.js` em `src/js/`. Evita a colisão de nomes
  `app.template.js` vs `app.templates.js`.
- **Ordem de init em `App.mount()`**: `renderer.mount(shell)` → `new Router` → `new Sidebar` →
  `setNavigateCallback` → `sidebar.init()` → `router.setSidebar(sidebar)` → `router.init()`.
  Assim o `navigate()` inicial encontra `this.sidebar` populado e o `setActiveItem()` destaca
  a rota correta. Corrige o bug sem tocar em `router.js`.
- **`app.templates.js` exporta também `card`**, reservado para as features futuras
  (cf. `sidebar.imports.js:6-9`). Com isso o `cardTemplate` deixa de ser import morto do
  entrypoint e passa a ser um índice de templates.
- **`App.destroy()` só chama `renderer.unmount()`** — remover listeners exigiria tocar em
  `sidebar.js`/`router.js`, fora de escopo. Residual documentado como follow-up.

## Risks / Trade-offs

- **Residual de listeners**: `Router` (`popstate` + `click` em `document`) e
  `Sidebar.bindOutsideClick()` não têm teardown. Aceito nesta change; reportado, não silenciado.
- **`Renderer` pode parecer "fina demais"** — o valor está na separação e na validação do
  root; se o boilerplate crescer (slots, re-render parcial), a classe já é o ponto de extensão.
- **API do README diverge do código** — a seção "Templates .raw" mostra
  `App(rootSelector, template, data)`, que não corresponde ao `App` real. Será atualizada na
  Fase 8 para refletir o novo layout.
- **Correção da hipótese de `preventDefault` (Decisão de execução)**: a análise inicial supunha
  que a ausência de `preventDefault` no `Sidebar` causava reload completo da SPA. O QA com
  Playwright **refutou** isso — a navegação é SPA, sem request de documento. O bug real é a
  **dupla navegação por clique no menu** (2 `pushState`, entrada de histórico duplicada), porque
  `Sidebar.setActiveItem()` → `renderMenu()` troca `menuList.innerHTML` durante o bubble e
  deixa `event.target` detached; `Router.shouldInterceptLink()` então vê
  `closest('.sidebar') === null` e intercepta de novo. O `event.preventDefault()` desse segundo
  caminho é o que, acidentalmente, evita o reload. Fora de escopo; precisa de issue própria.
