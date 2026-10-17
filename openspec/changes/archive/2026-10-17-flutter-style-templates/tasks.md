## 1. Criar MainTemplate (classe base abstrata)

- [x] 1.1 Criar pasta `src/js/components/templates/` se não existir
- [x] 1.2 Criar arquivo `src/js/components/templates/MainTemplate.js` com classe base abstrata
- [x] 1.3 Implementar constructor que aceita `{ title, subtitle }` e inicializa `this.root` e `this.slot`
- [x] 1.4 Implementar método `render()` que lança erro indicando que deve ser implementado pela subclasse
- [x] 1.5 Implementar método `findSlot()` que lança erro indicando que deve ser implementado pela subclasse
- [x] 1.6 Implementar método `renderContent()` que lança erro indicando que deve ser implementado pela subclasse
- [x] 1.7 Implementar método `mount(container)` que injeta `render()` no container, guarda `this.root`, chama `findSlot()`, chama `renderContent()` e injeta via `setContent()`
- [x] 1.8 Implementar método `setContent(html)` que injeta HTML em `this.slot` via `innerHTML`

## 2. Refatorar Page para PageTemplate

- [x] 2.1 Renomear/mover `src/js/components/page/page.js` para `src/js/components/templates/PageTemplate.js`
- [x] 2.2 Fazer `PageTemplate` extender `MainTemplate`
- [x] 2.3 Remover lógica duplicada de `mount()` e `setContent()` (agora herdada de MainTemplate)
- [x] 2.4 Implementar `render()` usando o template existente (`page.raw`) com interpolação de `{ title, subtitle }`
- [x] 2.5 Implementar `findSlot()` para retornar `this.root.querySelector('.page-content')`
- [x] 2.6 Remover método `renderContent()` (ou deixar lançando erro, pois PageTemplate não é uma feature)
- [x] 2.7 Atualizar `page.imports.js` para refletir novo caminho se necessário
- [x] 2.8 Verificar se há outras referências a `Page` no código e atualizar para `PageTemplate`

## 3. Criar estrutura de features (exemplo com DashboardFeature)

- [x] 3.1 Decidir localização das features (`src/js/features/` ou `src/js/components/features/`)
- [x] 3.2 Criar pasta para feature (ex: `src/js/features/dashboard/`)
- [x] 3.3 Criar arquivo `src/js/features/dashboard/DashboardFeature.js`
- [x] 3.4 Fazer `DashboardFeature` extender `PageTemplate`
- [x] 3.5 Implementar constructor chamando `super({ title: 'Dashboard', subtitle: 'Overview and insights' })`
- [x] 3.6 Implementar `renderContent()` devolvendo HTML placeholder do dashboard
- [x] 3.7 Criar arquivo satélite de imports se necessário (para centralizar imports de features)
- [x] 3.8 Repetir processo para outras features principais (Products, Settings, etc.) ou deixar para implementação futura

## 4. Atualizar Router para usar novo contrato

- [x] 4.1 Modificar `Router.renderRoute()` para instanciar feature diretamente: `new route.component().mount(this.container)`
- [x] 4.2 Remover lógica que instanciava `Page` separadamente
- [x] 4.3 Remover lógica que injetava conteúdo manualmente via `innerHTML`
- [x] 4.4 Atualizar tratamento de rota sem feature para exibir placeholder simples (sem scaffold)
- [x] 4.5 Verificar se `resolveRoute()` precisa de ajustes (campo `subtitle` pode não ser mais usado pela feature)
- [x] 4.6 Testar navegação para rota com feature válida
- [x] 4.7 Testar navegação para rota sem feature

## 5. Atualizar sidebar.items.js e imports

- [x] 5.1 Verificar se `sidebar.items.js` precisa manter campo `subtitle` (pode ser útil para registro, mas não usado pela feature)
- [x] 5.2 Atualizar `sidebar.imports.js` para importar as novas classes de feature em vez de funções
- [x] 5.3 Verificar se todas as referências a features em `sidebar.items.js` apontam para classes válidas
- [x] 5.4 Garantir que features placeholder (ainda não implementadas) tenham classes stubs ou sejam nulas

## 6. Limpeza e verificação

- [x] 6.1 Remover arquivo antigo `src/js/components/page/page.js` se ainda existir
- [x] 6.2 Remover pasta antiga `src/js/components/page/` se vazia
- [x] 6.3 Verificar se há imports quebrados após refatoração
- [x] 6.4 Rodar build/dev server para verificar erros de sintaxe
- [x] 6.5 Testar navegação entre diferentes rotas no navegador
- [x] 6.6 Verificar se o scaffold de página aparece corretamente com título e subtítulo
- [x] 6.7 Verificar se o conteúdo da feature aparece no slot corretamente
- [x] 6.8 Documentar em comentários ou README o padrão de herança de templates para referência futura
