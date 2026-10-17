## Why

A arquitetura atual (Router instancia Page) é funcional mas limitada. Cada feature está atrelada a um único template de página, sem flexibilidade para layouts diferentes (dashboard full-width, modal, etc.). Seguir o padrão Flutter — onde páginas extendem templates base — permite que cada feature escolha seu layout via herança, mantendo padronização através dos templates base.

## What Changes

- Nova classe `MainTemplate` em `src/js/components/templates/` (classe base abstrata com métodos para render(), mount(), setContent()).
- `Page` existente refactorado para `PageTemplate` que extende `MainTemplate` (mantém scaffold atual).
- Nova estrutura de features: cada feature (Dashboard, Products, etc.) extende um template base (PageTemplate, FullWidthTemplate, etc.) e implementa `renderContent()`.
- `Router.renderRoute` simplificado: só instancia a feature e chama `mount(container)`, deixando a feature carregar seu template via herança.
- Contrato de feature mudado: de `render(route) → string HTML` para classe que extende Template e implementa `renderContent()`.
- `sidebar.items.js` mantém campo `subtitle` (adicionado na change anterior), mas a referência à feature continua a mesma (aponta para a classe).

## Capabilities

### New Capabilities
- `template-inheritance`: sistema de templates base com herança, permitindo que features extendam layouts padronizados (MainTemplate → PageTemplate → Feature).
- `feature-template-selection`: cada feature pode escolher qual template extender, habilitando layouts diferenciados sem quebrar consistência visual.

### Modified Capabilities
- `page-rendering`: o requisito de "Router instancia Page" muda para "feature extende template base"; o contrato de feature muda de função para classe com herança.

## Impact

- Novos: `src/js/components/templates/MainTemplate.js`, `src/js/components/templates/PageTemplate.js`, estrutura de features em `src/js/features/` (ou reuso de `src/js/components/` com nova organização).
- Alterados: `src/js/components/page/page.js` (vira PageTemplate), `src/js/router.js` (renderRoute simplificado), contratos de todas as features (mudam de função para classe).
- Sem dependências novas; usa o motor `Template` e o Tabler já presentes.
- **BREAKING**: Features existentes precisam ser refatoradas de função para classe que extende template.
