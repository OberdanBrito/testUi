# Design: flutter-style-templates

## Context

A change anterior (`add-page-template`) estabeleceu um template de página único instanciado pelo `Router`. Isso padroniza o layout, mas limita a flexibilidade: todas as features usam o mesmo scaffold (container + título + subtítulo + slot). Não há como ter um dashboard full-width, uma página modal, ou um layout com sidebar lateral específico para certas features.

O motor `Template` já existe (interpolação simples via regex). A classe `Page` já existe com métodos `render()`, `mount()`, e `setContent()`. O `sidebar.items.js` é a fonte única de rotas. Convenções de componentes (arquivos satélite, imports `?raw`) estão estabelecidas.

## Goals / Non-Goals

**Goals:**
- Sistema de herança de templates: `MainTemplate` (base abstrata) → `PageTemplate` (implementação concreta) → `Feature` (extende template).
- Cada feature escolhe qual template extender (ex: DashboardFeature extends PageTemplate, AnalyticsFeature extends FullWidthTemplate).
- `Router` simplificado: só instancia a feature e chama `mount(container)`, deixando a feature carregar seu template via herança.
- Manter padronização visual através dos templates base (cada template define seu scaffold consistente).

**Non-Goals:**
- Implementar múltiplos templates alternativos além de `PageTemplate` (só a infraestrutura de herança).
- Lifecycle completo (destroy, state management) — foco apenas em render/mount.
- Breadcrumbs, slots extras, ou componentes complexos de layout.
- Internacionalização dos textos.

## Decisions

1. **`MainTemplate` como classe base abstrata** — define a interface comum (`render()`, `mount()`, `setContent()`, `renderContent()`) mas não implementa `render()` nem `findSlot()`. Isso garante que todos os templates sigam o mesmo contrato, mas permite que cada um defina seu próprio markup. Alternativa (template base funcional) foi descartada: sem herança de classe, não há garantia de contrato entre templates.

2. **Feature extende template, não o inverso** — a feature herda do template (ex: `DashboardFeature extends PageTemplate`), não o template recebe a feature como parâmetro. Isso segue o padrão Flutter (Widget build(BuildContext)) e deixa a feature controlar seu próprio layout ao escolher qual classe extender. Alternativa (template recebe feature) centralizaria a escolha do layout no Router, quebrando a flexibilidade.

3. **`renderContent()` como método abstrato** — cada feature implementa `renderContent()` devolvendo o HTML do conteúdo específico. O template base chama `renderContent()` no `mount()` e injeta no slot. Isso separa scaffold (template) de conteúdo (feature). Alternativa (feature devolve HTML string no constructor) misturaria inicialização com renderização.

4. **`Page` vira `PageTemplate`** — a classe existente `src/js/components/page/page.js` é renomeada/refatorada para `PageTemplate` que extende `MainTemplate`. Isso evita duplicação: o scaffold atual é reutilizado como implementação concreta de um template base. Alternativa (criar `PageTemplate` do zero e manter `Page`) criaria dois componentes quase idênticos.

5. **Router só instancia feature** — `renderRoute` simplifica para `new route.component().mount(this.container)`. A feature, via herança, já carrega seu template e sabe como renderizar. Isso remove acoplamento entre Router e templates específicos. Alternativa (Router sabe qual template usar) centralizaria a decisão de layout, quebrando a ideia de feature escolher seu template.

6. **Contrato de feature: classe que extende Template** — mudança breaking da change anterior (que usava `render(route) → string HTML`). Isso é necessário para a herança funcionar. Features existentes precisam ser refatoradas para classes que extendem um template. Aceitável porque features ainda não estão implementadas (são placeholders).

7. **Localização de features** — features podem morar em `src/js/features/` ou continuar em `src/js/components/` com nova organização. A mudança não prescreve localização, foca na arquitetura de herança. Decisão deixada para implementação (pode ser ajustada).

## Risks / Trade-offs

- [Mudança breaking no contrato de feature] → features existentes (ainda não implementadas) precisam ser refatoradas. Aceitável porque é custo único e a arquitetura evolui para mais flexibilidade.
- [Complexidade adicional com herança de classes] → desenvolvedores precisam entender a hierarquia (MainTemplate → PageTemplate → Feature). Mitigado pela documentação e pelo fato de ser um padrão comum (Flutter, React components).
- [Router perde visibilidade do template usado] → não é mais possível centralizar lógica que depende do tipo de template (ex: analytics de qual layout é usado). Aceitável porque o Router não deve saber sobre layout — isso é responsabilidade da feature.
- [Template base sem `render()` implementado pode confundir] → `MainTemplate` lança erro se `render()` for chamado diretamente. Mitigado por documentação clara e pelo fato de que ninguém instancia `MainTemplate` diretamente, só suas subclasses.
- [Cada feature precisa escolher template manualmente] → esquecer de extender o template certo resulta em erro em runtime. Mitigado por linters/TypeScript no futuro (se o projeto migrar), e por exemplos claros de features existentes.
