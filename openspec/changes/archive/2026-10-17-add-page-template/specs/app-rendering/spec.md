# Delta: app-rendering

## MODIFIED Requirements

### Requirement: Os templates devem ser centralizados num satélite da pasta do app
Os imports `?raw` dos templates MUST viver em módulos satélite no padrão dos
arquivos satélite de `components/sidebar/`: os templates do shell (`card`,
`header`, `sidebar`) em `src/js/components/app/`, e os templates de componente
na própria pasta do componente (ex.: `src/js/components/page/page.imports.js`).
O entrypoint (`src/main.js`) SHALL não importar templates.

#### Scenario: Entrypoint sem templates
- **WHEN** `src/main.js` é inspecionado
- **THEN** ele contém apenas imports de CSS e o bootstrap da aplicação, sem imports de
  templates `.raw`

#### Scenario: Template de componente importado pelo próprio componente
- **WHEN** o template `page.raw` é inspecionado
- **THEN** seu import `?raw` vive em `src/js/components/page/page.imports.js` e
  não em `src/js/components/app/app.templates.js`
