# Design: add-page-template

## Context

O shell (header + sidebar + `#route-container`) já é composto por `App` a partir
de templates `.raw` e renderizado pelo `Renderer`. O `Router` hoje, ao resolver
uma rota sem feature, injeta um placeholder (`<h2>` + `<p>`) diretamente no
`#route-container`. Não existe nenhum padrão visual de tela de recurso.

Convenções vigentes: markup em `templates/*.raw` importado via `?raw`; classe de
componente em `src/js/components/<nome>/` com arquivos satélite (`sidebar.js`,
`sidebar.items.js`, `sidebar.imports.js`); interpolação `{{chave}}` pelo motor
`Template` (uma passada, sem escape, sem condicionais).

`sidebar.items.js` é a fonte única de verdade das rotas (o `Router` já resolve
rotas a partir dele) e tem `label`, `icon`, `path`, `feature`, `submenu`,
`redirectTo` — mas não tem subtítulo.

## Goals / Non-Goals

**Goals:**
- Um template de tela principal (container + título + subtítulo + slot de
  conteúdo) aplicado a toda rota-folha renderizada pelo `Router`.
- Classe `Page` instanciável, morando em `src/js/components/page/`, no padrão
  dos componentes existentes.
- Título/subtítulo provenientes de `sidebar.items.js` (registro de rotas).
- Contrato de recurso definido: `feature.render(route)` devolve o HTML do
  conteúdo.

**Non-Goals:**
- Implementar as features em si (dashboard, products, etc.) — continuam
  placeholder de conteúdo.
- Condicionais/loops no motor `Template`.
- Breadcrumbs, ações no cabeçalho da página ou slots extras além do conteúdo.
- Internacionalização dos textos.

## Decisions

1. **Título/subtítulo em `sidebar.items.js`** — o arquivo já é a fonte única das
   rotas; adicionar `subtitle` mantém um único registro alimentando menu, router
   e página. Alternativa (feature declara seu próprio título) foi descartada:
   permitiria desvio do padrão visual e duplicaria a fonte de verdade.

2. **`Page` instanciado pelo `Router`, não pela feature** — o `Router` é quem
   resolve a rota e conhece `title`/`subtitle`; a feature só devolve conteúdo.
   Isso garante padronização (nenhuma feature monta layout próprio). Alternativa
   (feature instancia `Page`) daria flexibilidade de cabeçalho, mas quebraria a
   padronização — fora do escopo.

3. **Contrato de feature: `render(route)` → string HTML** — forma mínima que o
   `Router` já consegue consumir (`route.component` aponta para a classe).
   `mount(container)`/`destroy()` fica para uma mudança futura de lifecycle
   (hoje não há teardown em nenhum componente do shell).

4. **Conteúdo injetado via DOM, não via interpolação** — o motor `Template` faz
   `replace` numa passada; interpolar `{{content}}` corroe dados que contenham
   `{{`. Padrão igual ao do `Sidebar` (renderiza shell, preenche slot com
   `innerHTML`).

5. **Subtítulo ausente escondido via CSS `:empty`** — o `Template` não tem
   condicionais; renderizar o elemento e escondê-lo quando vazio evita JS extra
   e evita elemento vazio na tela (regra de UI: nada de resíduo vazio/"null").

6. **Visual via classes Tabler** — o app já usa `@tabler/core` com
   `data-bs-theme` para dark mode; usar a anatomia de página do Tabler
   herda tema e consistência sem CSS novo. Classes custom só para o slot.

7. **Satélite `page.imports.js` para o `?raw`** — espelha o padrão de
   `sidebar.imports.js`; o requisito de centralização em `app.templates.js` é
   generalizado no spec delta (ver `specs/app-rendering/spec.md`).

## Risks / Trade-offs

- [16 itens-folha precisam de `subtitle` escrito à mão] → textos curtos em
  inglês, coerentes com os `label`; sem subtítulo o campo fica `''` e o
  elemento é escondido.
- [Spec `app-rendering` muda o requisito de imports `?raw`] → delta explícito
  em `specs/app-rendering/spec.md`, validado antes do archive.
- [Feature ainda inexistente: `render(route)` não é exercitado de verdade] →
  `Router` mantém o placeholder de conteúdo quando `route.component` for nulo,
  mas agora dentro da página (título/subtítulo corretos).
- [Página inteira re-renderizada a cada navegação] → igual ao comportamento
  atual do placeholder; sem estado de página preservado. Aceitável por ora.
