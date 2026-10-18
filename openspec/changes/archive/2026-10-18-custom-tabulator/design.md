## Context

O `GridTemplate` (change `grid-template`) é o dono do Tabulator: implementa `renderContent(slot)` instanciando `new Tabulator(slot, this.renderGridConfig())` e guarda a instância em `this.tabulator`. A feature estende `GridTemplate` e implementa `renderGridConfig()` devolvendo `{ data, columns }` — mas a `CustomersFeature` também devolve `layout: 'fitColumns'`, ou seja, a feature está decidindo propriedades que deveriam ser do sistema.

O problema: não existe um perfil global de grid. Cada feature carrega `layout`/densidade por conta própria (ou herda o default cru do Tabulator), e não há um ponto único para padronizar o visual e o comportamento estrutural de todas as grids.

O contrato de herança (`template-inheritance`) e a seleção de template (`feature-template-selection`) já estão estáveis. Este change não altera a hierarquia `MainTemplate → GridTemplate → Feature` nem o caminho widget do `renderContent(slot)` — apenas troca **qual classe** é instanciada e **de onde vem o perfil**.

## Goals / Non-Goals

**Goals:**
- Criar a classe `CustomTabulator` (estende `Tabulator`) que carrega um perfil global e é instanciada pelo `GridTemplate`.
- Definir o perfil global `GRID_DEFAULTS` (layout, densidade, alinhamento de coluna) num satélite importável.
- Estabelecer precedência **P2**: as chaves estruturais são de propriedade do sistema; a feature só manda `data`/`columns` (e pode ajustar o restante do perfil).
- Garantir retrocompatibilidade em runtime (`CustomTabulator extends Tabulator`).

**Non-Goals:**
- Adicionar métodos/comportamento compartilhado ao `CustomTabulator` (opção B). A classe é, por ora, um perfil de configuração — o ponto de extensão fica pronto para o futuro.
- Trocar o nome `renderGridConfig()` (fica por compatibilidade; a feature passa a devolver só o que é dela).
- Implementar destruição do Tabulator na navegação (pré-existente, fora do escopo).
- Suportar widgets além do Tabulator.

## Decisions

### Decisão 1: `CustomTabulator` estende `Tabulator` (subclass), não factory

Mesmo sendo um perfil de configuração (opção A), a herança é mantida de propósito:
- dá **tipo nomeado** (`CustomTabulator`) e `instanceof` (inclusive `instanceof Tabulator`, que continua verdadeiro);
- cria o **ponto de extensão** — amanhã um método compartilhado entra aí sem tocar no `GridTemplate`;
- separa a *decisão do perfil* (CustomTabulator) da *orquestração* (GridTemplate).

**Alternativa rejeitada — factory `createTabulator(el, cfg)`:** faria o mesmo merge, mas sem tipo nomeado e sem costura para evoluir; o `GridTemplate` precisaria conhecer o merge. Rejeitada porque o custo da herança é zero e ela compra o futuro.

> **Nota de implementação — usar `TabulatorFull`, não `Tabulator`.** O `tabulator-tables` 6.x exporta um build **modular**: só o core vem registrado; recursos como `responsiveLayout` (e outros módulos) não estão ativos e disparam `Tabulator Module Not Installed: responsiveLayout` em runtime. A classe importa `TabulatorFull` (que registra todos os módulos) e estende dele: `import { TabulatorFull as Tabulator } from 'tabulator-tables'`. A instância continua sendo `instanceof Tabulator` e a API é idêntica; só o bundle fica maior (refletido no warning de chunk size do build).

### Decisão 2: precedência P2 — chaves estruturais são de propriedade do sistema

O perfil define duas classes de chaves:

| Classe | Chaves | Regra |
|---|---|---|
| **De propriedade do sistema** | `layout`, `rowHeight`, `responsiveLayout` | o valor de `GRID_DEFAULTS` **sempre vence**; a feature não pode sobrescrever |
| **Baseline extensível** | `placeholder`, `columnDefaults` | o valor de `GRID_DEFAULTS` é o ponto de partida; a feature pode ajustar |
| **Exclusivas da feature** | `data`, `columns` | vêm só da feature |

O mecanismo é: mesclar `{ ...GRID_DEFAULTS, ...featureOptions }` e depois **reforçar** as chaves de propriedade do sistema com o valor do perfil:

```js
const merged = { ...GRID_DEFAULTS, ...featureOptions };
for (const key of SYSTEM_OWNED_KEYS) {
  merged[key] = GRID_DEFAULTS[key]; // feature não sobrescreve
}
```

**Alternativa rejeitada — P1 (feature vence sempre):** `{ ...GRID_DEFAULTS, ...featureOptions }` puro. É mais flexível, mas reintroduz o problema original: qualquer feature volta a decidir `layout`/`rowHeight`, e o perfil deixa de ser autoridade.

**Trade-off aceito:** uma feature legítima que precisasse de um `layout` diferente fica bloqueada. Se isso aparecer, o escape é um change futuro (ex.: canal explícito de override) — não agora.

### Decisão 3: `columnDefaults` com deep-merge

`columnDefaults` é um objeto aninhado. Um spread raso `{ ...GRID_DEFAULTS, ...featureOptions }` **substituiria** o objeto inteiro, perdendo o alinhamento global (`headerHozAlign`, `vertAlign`) sempre que a feature passasse o seu próprio `columnDefaults`. Por isso essa chave recebe deep-merge:

```js
merged.columnDefaults = { ...GRID_DEFAULTS.columnDefaults, ...featureOptions.columnDefaults };
```

Assim o alinhamento global é o baseline e a feature ajusta só o que precisar (por chave). Chaves de topo fora de `columnDefaults` continuam com spread raso — são escalares, então o raso é seguro.

**Alternativa rejeitada — perfil só de chaves de topo (sem `columnDefaults`):** descartada porque o alinhamento de header/célula é parte do perfil visual do sistema.

### Decisão 4: localização L2 — pasta `tabulator/` com satélite de defaults

```
src/js/components/tabulator/
  CustomTabulator.js        // extends Tabulator, injeta o perfil
  tabulator.defaults.js     // GRID_DEFAULTS + SYSTEM_OWNED_KEYS
```

Segue a convenção de pastas de componentes do projeto e deixa `tabulator.defaults.js` importável por testes/features sem carregar a classe. A classe não fica em `templates/` porque não é template — é um adaptador de widget.

### Decisão 5: conteúdo inicial do perfil `GRID_DEFAULTS`

```js
export const GRID_DEFAULTS = {
  layout: 'fitDataTable',
  rowHeight: 48,
  responsiveLayout: 'collapse',
  placeholder: 'No data',
  columnDefaults: {
    headerHozAlign: 'left',
    vertAlign: 'middle',
  },
};

export const SYSTEM_OWNED_KEYS = ['layout', 'rowHeight', 'responsiveLayout'];
```

Esses valores são o **perfil inicial** — a primeira padronização visual do grid. São calibráveis (ver Open Questions). O importante para o change é que o perfil exista e que as chaves estruturais sejam trancadas.

> **Nota de implementação — `headerHeight` não é opção do Tabulator 6.6.1.** O Tabulator 6 controla a altura do header exclusivamente via CSS; a string `headerHeight` não existe no `dist/`. Por isso ela foi retirada do perfil: incluí-la seria configuração morta (silenciosamente ignorada). Se uma altura fixa de header for desejada no futuro, ela deve vir de uma regra CSS (`.grid-container .tabulator-header`), não de uma opção do Tabulator.

### Decisão 6: `renderGridConfig()` continua, mas enxuto

O nome e a assinatura ficam (retrocompatibilidade). O papel muda: a feature devolve **apenas o que é dela** — `data` e `columns` (e, se quiser, ajustes do baseline extensível). `layout` sai da `CustomersFeature` porque passa a ser do sistema. O `GridTemplate` segue abstrato em `renderGridConfig()` (lança erro se não implementado).

### Decisão 7: BREAKING só no nível de spec

A requirement existente "O GridTemplate deve possuir o Tabulator..." é modificada para instanciar `CustomTabulator`. Em runtime nada quebra: `CustomTabulator extends Tabulator`, então `this.tabulator` continua sendo uma instância de `Tabulator` e qualquer `instanceof Tabulator` segue válido. Não há migração de dados nem de features.

## Risks / Trade-offs

- **[Mudar o perfil muda o visual de todas as grids de uma vez]** → o `layout` padrão deixa de ser o cru do Tabulator e passa a valer para `CustomersFeature` e qualquer grid futura. Mitigação: QA visual comparando antes/depois; calibrar `layout`/`rowHeight` se necessário.
- **[P2 bloqueia override legítimo]** → uma feature que precise de `layout`/`rowHeight` diferente não consegue. Mitigação: decisão consciente; escape futuro via canal de override se o caso aparecer.
- **[Deep-merge de `columnDefaults` é ponto de atenção]** → chaves aninhadas futuras podem precisar do mesmo tratamento. Mitigação: documentar que `columnDefaults` é a única chave com deep-merge.
- **[Instância do Tabulator sem destruição na navegação]** → pré-existente; o DOM antigo é descartado pelo `innerHTML` da próxima montagem. Fora do escopo.
- **[Valores do perfil são arbitrários no primeiro corte]** → `fitDataTable`/`48` são iniciais. Mitigação: calibrar no QA visual e ajustar `GRID_DEFAULTS`.

## Migration Plan

1. Criar `src/js/components/tabulator/tabulator.defaults.js` (`GRID_DEFAULTS` + `SYSTEM_OWNED_KEYS`).
2. Criar `src/js/components/tabulator/CustomTabulator.js` (merge P2 + deep-merge de `columnDefaults`).
3. Alterar `GridTemplate.renderContent(slot)` para `new CustomTabulator(slot, this.renderGridConfig())`.
4. Remover `layout` de `CustomersFeature.renderGridConfig()`.
5. QA visual (grid renderiza com o perfil; `CustomersFeature` com layout do sistema) + `npm run build`.

Rollback: reverter os 4 passos — o perfil é isolado em dois arquivos novos e a troca é um `new` no `GridTemplate`.

## Open Questions

- Os valores iniciais do perfil (`layout: 'fitDataTable'`, `rowHeight: 48`) estão calibrados com o visual do app? Confirmar no QA visual e ajustar `GRID_DEFAULTS`.
- `placeholder: 'No data'` deve ser fixo do sistema ou localizável por feature? Hoje é baseline extensível (feature pode trocar).
