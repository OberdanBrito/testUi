## Context

O sistema de templates (change `flutter-style-templates` + `page-header-object`) estabeleceu a hierarquia `MainTemplate` (base abstrata) → `PageTemplate` (scaffold concreto) → `Feature` (conteúdo). O contrato de renderização é único: a feature devolve uma string HTML de `renderContent()` e o `MainTemplate` injeta no slot via `setContent()`.

O `GridTemplate` é o segundo template concreto. Diferente das telas de conteúdo estático, grids com Tabulator são **widgets**: o Tabulator não é HTML pronto — ele precisa de um elemento DOM vivo e toma posse dele (`new Tabulator(el, config)`). O contrato atual de "devolver string" não comporta isso. Ao mesmo tempo, nenhuma feature existente pode quebrar: hoje existe apenas `DashboardFeature`, que devolve HTML string.

## Goals / Non-goals

**Goals:**
- Evoluir o contrato de renderização do `MainTemplate` para suportar os dois caminhos: devolver HTML string (atual) ou receber o slot e montar um widget.
- Criar o `GridTemplate` (scaffold + `templates/grid.raw` + satélite `grid.imports.js`) herdando `mount()` e `PageHeader` do base.
- Adicionar a dependência `tabulator-tables` ao projeto.
- Manter retrocompatibilidade total com `PageTemplate` e `DashboardFeature`.

**Non-Goals:**
- Implementar uma feature de grid real com dados (o escopo é a infraestrutura; a primeira feature Tabulator decide origem dos dados).
- Implementar destruição da instância do Tabulator na navegação (não existe caso de uso ainda; risco documentado).
- Suportar widgets além do Tabulator (o contrato é genérico, mas só o Tabulator é dependência nova).
- Criar templates full-width ou outros além do GridTemplate.

## Decisions

### Decisão 1: contrato de dois caminhos no MainTemplate, mas o Tabulator mora no GridTemplate

O `mount()` do `MainTemplate` passa a chamar `renderContent(this.slot)` (contrato genérico de dois caminhos — ver abaixo). A diferença desta change para a iteração anterior é **onde o Tabulator é instanciado**:

- O contrato de `renderContent(slot)` no `MainTemplate` continua suportando os dois caminhos: (a) **HTML string** — a feature (ou o template) devolve string e o mount injeta via `setContent()`; (b) **widget** — quem chamou monta um widget no slot e não devolve string. Features que não declaram o parâmetro `slot` (ex: `DashboardFeature`) continuam funcionando — JavaScript ignora argumentos extras. **Zero migração.**
- **O `GridTemplate` é o dono do Tabulator**, não a feature. Ele implementa `renderContent(slot)` instanciando `new Tabulator(slot, this.renderGridConfig())` e guarda a instância em `this.tabulator`. A feature **apenas fornece a configuração** via `renderGridConfig()` (objeto com `columns` e `data`). Assim o widget — e seu lifecycle — ficam centralizados no template; qualquer grid futuro herda criação e (futura) destruição de graça.

```js
// GridTemplate
renderGridConfig() { throw new Error('renderGridConfig() must be implemented by subclass'); }

renderContent(slot) {
  this.tabulator = new Tabulator(slot, this.renderGridConfig());
  return null; // mount não injeta HTML (guard if (content))
}
```

**Alternativa rejeitada — método separado `renderInto(slot)`:** exigiria decidir qual método implementar para a mesma responsabilidade, e o mount precisaria de duck-typing (`typeof this.renderInto === 'function'`). O argumento extra em `renderContent(slot)` resolve sem ambiguidade.

**Alternativa rejeitada (e adotada após revisão) — Tabulator na feature:** na iteração anterior o Tabulator era montado por `renderContent(slot)` da feature. Foi reconsiderada porque o `GridTemplate` existe **exclusivamente** para hospedar Tabulator — um template de grid que renderiza HTML estático é contraditório — e porque espalhar a criação/destruição do widget por cada feature impede centralizar o lifecycle. A forma adotada mantém o dual-path genérico no base (útil para `PageTemplate`) e concentra o widget no `GridTemplate`.

### Decisão 2: o guard `if (content)` no mount é obrigatório, não opcional

Se o mount chamasse `setContent(this.renderContent(this.slot))` inline, o caminho widget quebraria: `renderContent` montaria o Tabulator no elemento e devolveria `null`/`undefined`; `setContent('')` rodaria **depois** e faria `slot.innerHTML = ''`, apagando o DOM que o Tabulator acabou de construir. O guard `if (content)` garante que injeção só acontece quando há string para injetar.

### Decisão 3: GridTemplate implementa renderContent() e delega a config à feature

O `GridTemplate` implementa `render()` (scaffold com `<div class="grid-container">`), `findSlot()` (retorna `.grid-container`) e `renderContent(slot)` (cria o Tabulator). Ele NÃO conhece colunas nem dados — esses vêm de `renderGridConfig()`, método abstrato que a feature implementa. O `PageHeader` vem de graça: o `mount()` do base cria o header incondicionalmente, então a tela de grid já nasce com zona identidade (breadcrumb, título do route) e zona ações (via `renderHeader()`, como qualquer template).

**Alternativa rejeitada — mount() condicional para header:** criar ou não o `PageHeader` por template exigiria parametrizar o mount() do base, quebrando a sequência fixa de 7 passos que é a identidade do sistema. Se uma tela de grid sem header for necessária, isso se decide num change futuro — não agora.

### Decisão 4: `tabulator-tables` via npm (Vite)

Adicionada como dependência regular no `package.json`, CSS importado no build (import no entrypoint ou `<link>` no `index.html`, a decidir na implementação — o projeto já usa `<link>` no index.html para o main.css).

**Alternativa rejeitada — CDN:** o projeto é Vite com dependências npm (`@tabler/core`); CDN quebraria a consistência do build e a instalação offline.

### Decisão 5: grid.raw espelha a estrutura de page.raw

O scaffold de grid reutiliza o padrão visual: zona do header (slot onde o `PageHeader` monta) + `.grid-container` como corpo. O satélite `grid.imports.js` segue o padrão de `page.imports.js` (import `?raw` de `../../../../templates/grid.raw`).

## Risks / Trade-offs

- **[Tabulator montado no slot pode ser apagado por setContent se o guard falhar]** → o guard `if (content)` no passo 7 do mount é obrigatório e revisado no QA. Testar os dois caminhos (feature HTML string e template widget) visualmente.
- **[Instância do Tabulator sem destruição na navegação]** → o `GridTemplate` guarda a instância em `this.tabulator`; o DOM antigo é descartado pelo `innerHTML` da próxima montagem. Como o widget agora é do template, a destruição também pode ser centralizada no `GridTemplate` (ex: `destruir()` chamando `this.tabulator.destroy()`) quando a primeira feature Tabulator real nascer — sem espalhar isso pelas features.
- **[CSS do Tabulator pode conflitar com os estilos do app]** → importar apenas o CSS base do Tabulator; ajustes visuais pontuais no `main.css` com escopo `.grid-container`.
- **[Header incondicional em telas de grid]** → grids nascem com header herdado; se o produto pedir grid sem header, o mount() do base precisa de parametrização (mudança futura).
- **[Features existentes e o argumento extra]** → comportamento verificado por QA: `DashboardFeature` (renderContent sem parâmetro) deve renderizar idêntico ao antes da mudança.

## Migration Plan

Mudança aditiva e retrocompatível, sem migração de dados nem de features:

1. Adicionar `tabulator-tables` ao `package.json` e instalar.
2. Criar `templates/grid.raw` + `grid.imports.js`.
3. Criar `GridTemplate.js`.
4. Alterar `MainTemplate` — `renderContent(slot)` + passo 7 do mount com o guard.
5. QA visual dos dois caminhos: montar um GridTemplate puro (scaffold + header), e validar que `DashboardFeature` continua idêntico.

Rollback: reversão dos arquivos criados/alterados; nenhuma feature existente é afetada em runtime, então o rollback não tem impacto visual além da remoção do GridTemplate.

## Open Questions

- Destruição do Tabulator ao trocar de tela: o ponto de implementação natural é o `GridTemplate` (já guarda `this.tabulator`) — `destruir()` chamando `this.tabulator.destroy()`. Decidir junto com a primeira feature Tabulator real.
- Origem dos dados do grid (route? API? feature carrega?): decidida pela primeira feature de grid, não pela infraestrutura.
- Import do CSS do Tabulator: entrypoint (bundle) vs `<link>` no index.html (paralelo ao main.css) — decidir na implementação.
