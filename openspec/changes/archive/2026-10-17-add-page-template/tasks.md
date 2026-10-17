# Tasks: add-page-template

## 1. Template e objeto Page

- [x] 1.1 Criar `templates/page.raw` com container principal (classes Tabler de página), título `{{title}}`, subtítulo `{{subtitle}}` e slot de conteúdo
- [x] 1.2 Criar `src/js/components/page/page.imports.js` com o import `?raw` do `page.raw`
- [x] 1.3 Criar `src/js/components/page/page.js` com a classe `Page`: `constructor({ title, subtitle })`, `render()` devolvendo o shell com slot vazio e `setContent(html)` injetando no slot via DOM

## 2. Registro de rotas

- [x] 2.1 Adicionar o campo `subtitle` aos itens-folha de `src/js/components/sidebar/sidebar.items.js` (16 rotas), em inglês, coerente com os `label`
- [x] 2.2 Fazer `Router.resolveRoute` expor `subtitle` do item resolvido

## 3. Router e contrato de feature

- [x] 3.1 Fazer `Router.renderRoute` montar a página via `Page` (título/subtítulo do registro de rotas) e injetar no slot o resultado de `feature.render(route)` quando a feature expuser `render`; caso contrário, manter o placeholder de conteúdo dentro da página
- [x] 3.2 Cobrir com comentário curto o contrato `feature.render(route)` no ponto de renderização

## 4. CSS

- [x] 4.1 Adicionar CSS para esconder subtítulo vazio (`:empty`) e para o slot de conteúdo, sobrescrevendo só o necessário do Tabler

## 5. Verificação

- [x] 5.1 Rodar `npm run build` sem erros
- [x] 5.2 QA visual no browser: rota com `subtitle`, rota sem `subtitle` (sem resíduo vazio), navegação entre rotas atualizando título/subtítulo, dark mode coerente
