## MODIFIED Requirements

### Requirement: O contrato renderContent deve suportar dois caminhos de renderização
O método `renderContent(slot)` SHALL receber o slot de destino e SHALL suportar dois caminhos: (a) **HTML string** — quem implementa `renderContent` devolve uma string e o `MainTemplate` injeta no slot via `setContent()`; (b) **Widget no slot** — quem implementa `renderContent` monta um widget (ex: Tabulator) diretamente no elemento e não devolve string, e o `MainTemplate` não injeta nada. No caminho (b) a instanciação do widget pode ser feita pela própria feature (quando `renderContent` é da feature) ou pelo template concreto (ex: `GridTemplate` implementa `renderContent` e delega a configuração a um método abstrato da feature, `renderGridConfig()`). Features existentes que não declaram o parâmetro `slot` SHALL continuar funcionando sem modificação — JavaScript ignora argumentos extras.

#### Scenario: Feature simples devolvendo HTML
- **WHEN** uma feature implementa `renderContent()` sem o parâmetro `slot` devolvendo uma string HTML
- **THEN** o mount injeta o HTML no slot via `setContent()` exatamente como antes da mudança

#### Scenario: Template concreto montando widget e delegando config à feature
- **WHEN** `GridTemplate` implementa `renderContent(slot)` instanciando `new CustomTabulator(slot, this.renderGridConfig())` e a feature implementa `renderGridConfig()`
- **THEN** o `CustomTabulator` fica montado dentro do slot e o mount não injeta HTML no slot, e a configuração (colunas/dados) vem da feature
