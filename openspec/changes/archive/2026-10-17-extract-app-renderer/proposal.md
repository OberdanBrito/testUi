# Extrair a classe `Renderer` para `src/js/components/app/`

## Why

`src/main.js` mistura hoje três responsabilidades no entrypoint: o motor de template
(`Template`), a composição do shell e o wiring de `Router`/`Sidebar` (`App`) e o bootstrap.
Além do acoplamento, quatro defeitos concretos estão no caminho de renderização:

1. **Ordem de init incorreta** — `router.init()` chama `navigate()` → `sidebar.setActiveItem()`
   antes de `router.setSidebar(sidebar)`. A rota inicial nunca sincroniza o item ativo do menu
   (abrir `/products` destaca *Dashboard*).
2. **Root não validado** — `document.querySelector(rootSelector)` pode ser `null`; o `mount()`
   lança `TypeError` opaco em `this.root.innerHTML`.
3. **Import morto** — `cardTemplate` é importado em `main.js` e nunca usado.
4. **Sem teardown** — não existe `unmount()`/`destroy()`; o shell não pode ser desmontado.

O `README.md` (seção "Templates .raw") já documenta `App`/`Template` como classes próprias,
ou seja, a intenção original era tê-las extraídas — o código não acompanhou.

## What Changes

- Nova classe `Renderer` em `src/js/components/app/renderer.js`: **só** a mecânica de
  renderização (validar root, `mount`/`update`/`unmount`, flag `isMounted()`).
- `App` move de `src/main.js` para `src/js/components/app/app.js`, assumindo composição do
  shell, orquestração do wiring (ordem de init corrigida) e `destroy()`.
- `Template` move de `src/main.js` para `src/js/template.js` (infraestrutura, ao lado de
  `router.js`).
- Novo satélite `src/js/components/app/app.templates.js` centralizando os imports `?raw`
  (`card`, `header`, `sidebar`) — segue o padrão de `src/js/components/sidebar/sidebar.*.js`.
- `src/main.js` vira entrypoint puro: imports de CSS + `new App('#app').mount()`.

## Capabilities

### New Capabilities
- `app-rendering`: controle da renderização do shell da aplicação — classe `Renderer`
  (injeção de HTML no DOM, re-render, desmontagem) e composição/lifecycle em `App`.

### Modified Capabilities
(nenhuma — não existe spec anterior em `openspec/specs/`)

## Impact

- **Arquivos criados:** `src/js/template.js`, `src/js/components/app/renderer.js`,
  `src/js/components/app/app.js`, `src/js/components/app/app.templates.js`.
- **Arquivo modificado:** `src/main.js` (reduz a ~10 linhas).
- **Intocados por decisão de escopo:** `src/js/router.js`, `src/js/components/sidebar/*`,
  `templates/*.raw`, `src/css/*`.
- **Comportamento observável:** o item ativo do menu passa a refletir a rota atual já na
  carga inicial (correção do bug 1).
- **Residual reportado:** listeners de `document`/`window` em `Router` e
  `Sidebar.bindOutsideClick()` continuam sem remoção — `App.destroy()` só desmonta o DOM.
  Fora de escopo desta change; vira follow-up.
