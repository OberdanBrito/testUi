## 1. Infraestrutura de template

- [x] 1.1 Criar `src/js/template.js` com a classe `Template` movida verbatim de `src/main.js`
      (interpolação `{{chave}}`)
- [x] 1.2 Criar `src/js/components/app/app.templates.js` centralizando os imports `?raw`
      (`card`, `header`, `sidebar`) e exportando `templates`

## 2. Classe `Renderer`

- [x] 2.1 Criar `src/js/components/app/renderer.js`: `constructor(rootSelector)` com validação
      do elemento raiz (throw com o seletor na mensagem)
- [x] 2.2 Implementar `mount(html)`, `update(html)`, `unmount()` e `isMounted()`

## 3. Classe `App`

- [x] 3.1 Criar `src/js/components/app/app.js` com a classe `App` movida de `src/main.js`,
      usando `Template` + `templates` + `Renderer`
- [x] 3.2 Corrigir a ordem de init em `mount()`: `renderer.mount` → `new Router` →
      `new Sidebar` → `setNavigateCallback` → `sidebar.init()` → `router.setSidebar` →
      `router.init()`
- [x] 3.3 Implementar `destroy()` (idempotente) chamando `renderer.unmount()`

## 4. Entrypoint

- [x] 4.1 Reduzir `src/main.js` a: imports de CSS + `import { App }` +
      `new App('#app').mount()`

## 5. Verificação

- [x] 5.1 `node --check` nos arquivos criados/alterados
- [x] 5.2 `npm run build` (confirma resolução dos `?raw` no bundle — 20 módulos)
- [x] 5.3 QA visual em `http://localhost:5173` (Playwright, screenshots em `/tmp/opencode/`):
      shell ✓, carga direta em `/products` com item ativo `id 8` (não Dashboard) ✓,
      rota inexistente → Dashboard destacado ✓, erro claro sem root ✓,
      `destroy()` esvazia `#app` e é idempotente ✓, tema dark (duas camadas + localStorage +
      a11y) ✓, toggle da sidebar ✓, navegação pelo menu ✓

### Decisão de execução (registro obrigatório)

**A hipótese de "bug de `preventDefault` causando reload" estava errada.** A verificação com
Playwright mostrou navegação SPA correta (sem request de documento; flag em `window` sobrevive).
O bug real é outro e está **fora de escopo** desta change:

- **Dupla navegação por clique no menu** — 2 `pushState` por clique e entrada de histórico
  duplicada (o botão Voltar precisa de 2 pressões para sair da rota).
- **Causa raiz:** o handler do `Sidebar` navega via callback → `Router.navigate()` →
  `sidebar.setActiveItem()` → `renderMenu()`, que troca `menuList.innerHTML` e **detacha**
  `event.target`. Quando o evento chega ao handler de `document` do `Router`,
  `link.closest('.sidebar')` retorna `null` (`isConnected: false`) e `shouldInterceptLink()`
  passa a tratar o link como externo ao sidebar, interceptando e navegando de novo.
- O `event.preventDefault()` desse segundo caminho é, acidentalmente, o que impede o reload
  completo — por isso o sintoma de "reload" não existe.
- **Evidências:** instrumentação de `Element.prototype.closest` + `history.pushState`
  (`isConnected: false` em `Router.shouldInterceptLink`, contagem 2), e `goBack` preso em
  `/notifications` após 1 Voltar.
- **Follow-up sugerido:** `renderMenu()` não deve substituir `innerHTML` durante o
  dispatch do evento (ou o `Router` deve resolver a rota a partir de `event.currentTarget`/
  `event.target` antes de qualquer re-render, ou o `Sidebar` deve `preventDefault()`).
  Requer tocar em `router.js`/`sidebar.js` — fora do escopo acordado.
