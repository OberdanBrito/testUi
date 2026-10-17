# Proposal: add-page-template

## Why

As telas de recurso renderizadas pelo `Router` hoje são um placeholder solto
(`<h2>` + `<p>` sem padrão visual). Sem um template de tela principal, cada
recurso inventa seu próprio layout e a experiência deixa de ser padronizada.

## What Changes

- Novo template `templates/page.raw`: container principal com título, subtítulo
  e slot de conteúdo do recurso.
- Nova classe `Page` em `src/js/components/page/` (objeto instanciável, no
  padrão dos componentes existentes), importando o `.raw` via satélite próprio.
- `sidebar.items.js` passa a ser o registro de rotas completo: cada item-folha
  ganha o campo `subtitle`, fonte única do título/subtítulo da página.
- `Router.renderRoute` passa a montar a página via `Page` e injetar o conteúdo
  devolvido por `feature.render(route)` no slot, em vez de renderizar
  placeholder.
- Contrato de recurso definido: `render(route)` devolve o HTML do conteúdo da
  tela.
- Subtítulo ausente não pode deixar elemento vazio na tela.

## Capabilities

### New Capabilities
- `page-rendering`: template de tela principal (container + título + subtítulo +
  slot de conteúdo) usado pelas telas de recurso, padronizando o design visual.

### Modified Capabilities
- `app-rendering`: o requisito de centralização dos imports `?raw` num único
  satélite em `components/app/` passa a admitir satélite por componente
  (necessário para `components/page/page.imports.js`).

## Impact

- Novos: `templates/page.raw`, `src/js/components/page/page.js`,
  `src/js/components/page/page.imports.js`, CSS de página.
- Alterados: `src/js/components/sidebar/sidebar.items.js` (campo `subtitle`),
  `src/js/router.js` (montagem da página e contrato da feature).
- Sem dependências novas; usa o motor `Template` e o Tabler já presentes.
