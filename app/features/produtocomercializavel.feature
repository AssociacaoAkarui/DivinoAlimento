# language: pt
@produtocomercializavel
Funcionalidade: Gerenciar produtos comercializáveis

  @produtocomercial @PCO-01 @versaoNov2025 @criadoOut2025
  Cenário: Criar um novo registro de produto comercializável com sucesso
    Dado que eu quero criar um registro de produto comercializável para um produto existente
    Quando eu preencho a medida como "unidade"
    E o peso em kilogramas com "0.150"
    E o preço base com "1.50"
    E o status do produto comercializável como "ativo"
    Quando eu salvo o novo produto comercializável
    Então o produto comercializável com medida "unidade" deve ser criado com sucesso

  @produtocomercial @PCO-02 @versaoNov2025 @criadoOut2025
  Cenário: Ver os detalhes de um produto comercializável existente
    Dado que existe um produto "Banana Prata" com cadastro de produto comercializável "Unidade"
    Quando eu peço os detalhes do produto comercializável "Unidade" do produto "Banana Prata"
    Então eu devo ver os detalhes do produto comercializável "Unidade" do produto "Banana Prata"

  @produtocomercial @PCO-03 @versaoNov2025 @criadoOut2025
  Cenário: Atualizar um produto comercializável existente
    Dado que existe um produto "Pera Williams" com cadastro de produto comercializável "Caixa"
    Quando eu altero a unidade do produto comercializável para "Unidade"
    E eu salvo as alterações do produto comercializável
    Então a medida do produto comercializável deve ser "Unidade"

  @produtocomercial @PCO-04 @versaoNov2025 @criadoOut2025
  Cenário: Deletar um produto comercializável existente
    Dado que existe um produto "Pera Williams" com cadastro de produto comercializável "Caixa"
    Quando eu deleto o produto comercializável "Caixa"
    Então o produto comercializável "Caixa" não deve mais existir para o produto "Pera Williams" no sistema
