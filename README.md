# vite-ui-template

Boilerplate para projetos de **testes de UI** com JavaScript puro (HTML + CSS + JS), usando [Vite](https://vite.dev) e templates HTML com extensão `.raw`.

Sem frameworks, sem build de componentes — só o suficiente para começar.

## Requisitos

- Node.js 20+ (testado no 25)
- npm 10+

## Como usar

```bash
npm install
npm run dev      # servidor de dev com hot reload
npm run build    # build de produção em dist/
npm run preview  # serve o build de produção
```

## Estrutura

```
.
├── index.html          # entry do Vite
├── examples/           # exemplos de referência (não fazem parte do build)
├── public/
│   └── favicon.svg     # ícone da aba (bolt do Tabler Icons)
├── src/
│   ├── main.js         # ponto de entrada JS (só CSS + bootstrap do App)
│   ├── css/
│   │   ├── sidebar.css # CSS da sidebar (cópia do exemplo)
│   │   └── style.css   # estilos do scaffold (header, toggle, card)
│   └── js/
│       ├── template.js          # classe Template (interpolação {{chave}})
│       ├── router.js            # classe Router (rotas a partir de sidebar.items)
│       └── components/
│           ├── app/             # renderização do shell
│           │   ├── renderer.js      # classe Renderer (DOM: mount/update/unmount)
│           │   ├── app.js           # classe App (composição + wiring + destroy)
│           │   └── app.templates.js # imports ?raw centralizados (satélite)
│           └── sidebar/         # classe Sidebar (colapso, tema, clique-fora)
│               ├── sidebar.js
│               ├── sidebar.items.js   # fonte única de verdade das rotas
│               └── sidebar.imports.js  # reservado para as features futuras
└── templates/
    ├── card.raw        # templates HTML com extensão .raw
    ├── header.raw      # header do app (toggle da sidebar + marca + busca + tema)
    └── sidebar.raw     # menu lateral (markup copiado do exemplo)
```

## Sidebar e header

O menu lateral é uma cópia do exemplo em `examples/sidebar-menu-with-themes-html-css/`, com quatro mudanças deliberadas: **o logo saiu** do topo da sidebar, **o botão de exibir/ocultar foi para o header do app** (à esquerda da marca), **o input de busca saiu do topo da sidebar para o header** (alinhado à direita) e **o alternador de tema saiu do rodapé da sidebar para o header** (logo à direita da busca). No exemplo o botão de exibir/ocultar existe em dois lugares — `.site-nav` (só no mobile) e `.sidebar-header` (só no desktop).

- `templates/sidebar.raw` — markup do `aside.sidebar` copiado verbatim do exemplo, **sem** o `nav.site-nav`, **sem** o bloco `.sidebar-header` (que só existiam para abrigar aqueles toggles), **sem** o `form.search-form` e **sem** o bloco `.sidebar-footer` (que abrigava o alternador de tema). O `.sidebar-content` agora começa direto na `.menu-list`; o miolo usa o placeholder `{{content}}` para receber o conteúdo da página.
- `templates/header.raw` — `button.sidebar-toggle` (glifo `menu` do Material Symbols), a marca (`ti ti-bolt` + "Test UI"), o `form.search-form` (`id="header-search"`), empurrado para a direita com `margin-left: auto`, e por fim o `button.theme-toggle` — só o `<span class="theme-icon material-symbols-rounded">` do Material Symbols, sem rótulo de texto, imediatamente à direita da busca (o `.container-fluid` tem `gap: 8px`).
- `src/css/sidebar.css` — CSS copiado verbatim, com **um único bloco local** no fim. Ele faz três coisas: (1) cola a sidebar na esquerda neutralizando o `.container` — o exemplo não tinha Bootstrap, e o Tabler traz um `.container` com `max-width: 1140px` + `margin-inline: auto` + padding, que empurrava o menu para x = 86px em vez de 0; (2) zera o `padding-inline-start`/`margin-bottom` do `.sidebar-content .menu-list` — o exemplo conta com o reset `* { margin: 0; padding: 0 }`, mas seletores de **elemento** (`ol, ul { padding-inline-start: 1.5rem }` do Tabler e `dl, ol, ul { margin-bottom: 1rem }` do Bootstrap) têm especificidade maior que o curinga (0,0,1 > 0,0,0) e recuavam a lista em 24px — com isso os ícones saíam do centro no modo recolhido (o `.sidebar-content .menu-list` do exemplo só define `display`/`gap`/`list-style`, não mexe em padding); (3) aplica `--header-height` no `top`/`height` para o sidebar sticky não sobrepor o header. As regras `.sidebar-header`, `.header-logo`, `.site-nav` e todas as do `.sidebar-footer` (inclusive `.sidebar-footer .theme-toggle`, o trilho `.theme-toggle-track` e o indicador) seguem no arquivo, mas ficaram **inertes** (os elementos não existem mais no markup).
- `src/js/components/sidebar.js` — mesma lógica do `script.js` do exemplo, reescrita como classe `Sidebar` (o boilerplate usa 100% classes) e instanciada depois do mount. Ganhou `bindOutsideClick()`: no mobile, clique fora da sidebar fecha o drawer. Isso é necessário porque o overlay `body::before` do exemplo não tem handler — lá o fechamento era feito pelo toggle que ficava dentro da sidebar. Já o `bindSearchForm()` do exemplo foi **removido**: ele expandia a sidebar ao clicar na busca, e com a busca no header isso viraria "clicar no input abre o drawer" no mobile. O `updateThemeIcon()` do exemplo trocava o ícone conforme o estado da sidebar; como o alternador saiu do rodapé, ele agora depende **só do tema** (lua no claro, sol no escuro) e ainda reescreve o `aria-label` do botão — por isso os `updateThemeIcon()` que o exemplo chamava nos handlers de sidebar (toggle e clique-fora) foram removidos.
- `src/css/style.css` — estilos do scaffold para o header: `position: sticky` com `z-index: 5` (o toggle precisa continuar alcançável ao rolar; o valor fica **abaixo** do overlay `10` e da sidebar `20` para não furar o drawer mobile), os tokens de cor e o layout dos **dois** botões do header (`.sidebar-toggle` e `.theme-toggle`, agrupados no mesmo seletor: `40x40`, `flex: 0 0 auto` para que nenhum dos dois seja esmagado quando a busca precisa de espaço, hover `--color-hover-secondary`, glifo `1.75rem`). O `.container-fluid` do header recebe `justify-content: flex-start` porque o Bootstrap usa `space-between`, o que jogaria a marca para a borda direita. A caixa de busca vive no mesmo header: `40px` de altura (igual ao toggle), `gap: 10px` e `flex: 1 1 0` + `max-width: 260px` + `margin-left: auto` — o `flex-basis: 0` evita o wrap (o `.container-fluid` do Bootstrap é `flex-wrap: wrap`; com largura fixa a caixa pulava para uma segunda linha **fora** do header no mobile) e o `margin-left: auto` a encosta na borda direita, com o `:focus-within` trocando o fundo.

Invariante do modo recolhido (só ícones): a sidebar fica com 90px e os 7 ícones do menu centrados no trilho — centro em x=45, igual ao ícone na mesma posição quando a sidebar está expandida (o ícone não "pula" ao recolher). No header, os quatro itens ficam sempre em **uma linha** (`gap: 8px`; o `flex-wrap: wrap` do Tabler nunca chega a quebrar, porque quem absorve a sobra é a busca): toggle de 40px à esquerda, marca, busca (encolhe de 260px até ~105px num viewport de 320px) e o alternador de tema colado na borda interna do container — os dois botões são `flex: 0 0 auto` e permanecem 40x40 em qualquer largura. Essa geometria bate exatamente com a do exemplo original aberto direto em `examples/sidebar-menu-with-themes-html-css/index.html`, que não sofre a colisão do `ul`; use essa página como referência ao mexer no CSS.

Fontes externas do exemplo (carregadas do Google Fonts, exigem rede): **Poppins** via `@import` no `sidebar.css` e **Material Symbols Rounded** (ícones do menu) via `<link>` no `index.html`. Sem essa segunda o menu mostra o texto dos ícones (`dashboard`, `search`, ...) em vez dos glifos.

A **a11y dos ícones** exige dois cuidados que o exemplo original não tem: os `<span class="material-symbols-rounded">` carregam o *nome da ligadura* como texto (`dashboard`), então receberam `aria-hidden="true"` — e, como os botões `.sidebar-toggle` e `.theme-toggle` só têm ícone, os dois ganharam `aria-label` (o do tema é reescrito a cada troca em `updateThemeIcon()` e descreve a ação: "Switch to dark theme" / "Switch to light theme").

### Tema (claro padrão + dark)

Atenção: o CSS do exemplo traz regras globais (fundo do `body`, variáveis de tema) e **já estiliza o conteúdo** — `.container .main-content { color: var(--color-text-primary) }` e `.main-content .card { background-color: var(--color-bg-sidebar) }`. Como `.main-content .card` tem especificidade maior que o `.card` do `style.css`, quem manda no card é o exemplo.

O dark mode tem **duas camadas**, porque o Tabler define cor explícita em `.card` e nos headings (que então não herdam o token do tema do exemplo):

1. `body.dark-theme` (classe que o exemplo usa) → tokens `--color-*`;
2. `data-bs-theme="dark"` no `<html>` → tokens `--tblr-*` do Tabler (corrige texto do card e headings, que iam a **1.2:1** de contraste).

As duas são alternadas juntas em `Sidebar.applyTheme()`. O header usa `--header-bg`/`--header-border` (definidos no `style.css`, com override em `body.dark-theme`), então ele acompanha o tema em vez de ficar branco no escuro.

O padrão é **tema claro** — o dark só liga pelo alternador no header (à direita da busca), fica salvo em `localStorage`, e `prefers-color-scheme` é ignorado de propósito.

## Estilos (Tabler)

O CSS/JS do [Tabler](https://tabler.io) (`@tabler/core`) já vem importado em `src/main.js`, **antes** do `src/css/style.css` — essa ordem permite que seus estilos sobrescrevam os do Tabler:

```js
import '@tabler/core/dist/css/tabler.min.css';
import '@tabler/core/dist/js/tabler.min.js';
import './style.css';
```

Os componentes do Bootstrap/Popper que o Tabler usa vêm junto (`@tabler/core` já depende deles).

## Ícones (Tabler Icons)

Os ícones vêm do `@tabler/icons-webfont` (webfont, uso por classe CSS):

```js
import '@tabler/icons-webfont/dist/tabler-icons.min.css';
```

```html
<i class="ti ti-bolt"></i>
```

Variantes disponíveis: `tabler-icons-filled.min.css` (preenchidos), `tabler-icons-200.min.css` e `tabler-icons-300.min.css` (pesos). O build emite a fonte em `.woff2` (~495 kB, usado pelos browsers modernos) mais `.woff` e `.ttf` como fallback legado — se o tamanho do `dist` incomodar, dá para servir só o `.woff2` ou trocar pelo pacote `@tabler/icons` (SVGs individuais, tree-shakeable).

## Templates `.raw`

Arquivos `.raw` são HTML puro servido como **string** pelo Vite. O segredo é o sufixo de query `?raw` no import:

```js
import cardTemplate from '../templates/card.raw?raw';
```

Sem o `?raw`, o Vite não resolve o arquivo. Com ele, qualquer extensão (`.raw`, `.html`, `.txt`) é importada como texto.

O template vira uma `class Template` (interpolação de `{{chave}}`) e o app usa três classes,
cada uma com uma responsabilidade:

- `src/js/template.js` — `Template.render(data)` devolve a string com os placeholders
  preenchidos. Não escapa HTML: sirva só dados confiáveis.
- `src/js/components/app/app.templates.js` — satélite que centraliza os imports `?raw`
  (`card`, `header`, `sidebar`) e exporta `templates`.
- `src/js/components/app/renderer.js` — `Renderer` é **só** a mecânica de DOM: valida o
  elemento raiz no construtor (lança erro nomeando o seletor ausente) e expõe `mount(html)`,
  `update(html)`, `unmount()` e `isMounted()`. Não conhece templates, rotas nem estado.
- `src/js/components/app/app.js` — `App` compõe o shell (header + sidebar), delega a escrita
  no DOM ao `Renderer`, orquestra `Router`/`Sidebar` e expõe `destroy()`.

```js
// src/main.js — entrypoint puro
import { App } from './js/components/app/app.js';

new App('#app').mount();
```

Duas regras de composição importantes:

1. **Ordem de init** — o `Sidebar` é conectado ao `Router` **antes** de `router.init()`. Assim a
   navegação inicial já destaca no menu o item da rota carregada (abrir `/products` marca
   *Products*, não *Dashboard*).
2. **Escrita no DOM só no `Renderer`** — `App` monta strings, `Renderer` injeta. `destroy()` é
   idempotente e esvazia o root.

Troque o motor de template (Tagged templates, lit-html, etc.) mexendo só em `Template`;
a camada de renderização não muda.

## Herança de templates (padrão Flutter)

Telas seguem o padrão Flutter: a **feature estende um template base** e só implementa o
conteúdo. Hierarquia em `src/js/components/templates/`:

```
MainTemplate (abstrato)  →  PageTemplate (scaffold)  →  Feature (renderContent)
```

- `MainTemplate.js` — contrato comum: `render()`, `findSlot()` e `renderContent()` são
  abstratos (lançam erro se chamados direto); `mount(container)` e `setContent(html)` são
  concretos. `mount()` faz a sequência fixa: injeta `render()`, guarda `this.root`, acha o slot
  via `findSlot()`, chama `renderContent()` e injeta via `setContent()` (innerHTML — o conteúdo
  **não** passa pelo motor `Template`, então `{{...}}` dentro dele aparece literal).
- `PageTemplate.js` + `page.imports.js` — template concreto: `render()` usa `templates/page.raw`
  (`{{title}}`, `{{subtitle}}`; subtítulo vazio some via `.page-subtitle:empty`) e `findSlot()`
  devolve `.page-content`.
- Features em `src/js/features/<nome>/` estendem o template que quiserem e definem
  título/subtítulo no `super({ title, subtitle })` — a fonte definitiva é a própria feature;
  o `subtitle` de `sidebar.items.js` é só registro.

```js
// src/js/features/dashboard/DashboardFeature.js
export class DashboardFeature extends PageTemplate {
  constructor() {
    super({ title: 'Dashboard', subtitle: 'Overview and insights' });
  }
  renderContent() {
    return `<div class="route-placeholder"><p>Dashboard em desenvolvimento...</p></div>`;
  }
}
```

O `Router` só instancia a feature da rota (`new route.component().mount(container)`) — não
conhece templates. Rota sem feature cai num placeholder simples, sem scaffold. Para um layout
novo (ex.: `FullWidthTemplate`), crie a classe estendendo `MainTemplate`, implemente
`render()`/`findSlot()` e pronto: o Router não muda. As classes de feature entram em
`sidebar.imports.js` (features não implementadas ficam `null`).

## Conhecidos

**Listeners sem teardown (shell).** `Router` (`popstate` + `click` em `document`) e
`Sidebar.bindOutsideClick()` ficam vinculados vitalício — aceitável porque o shell é montado
uma única vez; na troca de rota o `Router` chama `feature?.destruir?.()` (opt-in) na feature
anterior.

## Licença

MIT
