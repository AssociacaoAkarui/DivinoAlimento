# language: pt
Funcionalidade: Gestão de Composições de Cestas

  @composicao @CMP-01
  Cenário: Criar uma composição de cesta para um ciclo
    Dado que existe um ciclo ativo
    E que existe uma cesta "Cesta Básica" cadastrada
    Quando eu crio uma composição para a cesta no ciclo
    Quando eu salvo a nova composição
    Então a composição deve ser criada com sucesso

  @composicao @CMP-02
  Cenário: Ver os detalhes de uma composição existente
    Dado que existe uma composição cadastrada
    Quando eu solicito os detalhes da composição
    Então eu devo ver o ciclo, a cesta e os produtos da composição

  @composicao @CMP-03
  Cenário: Adicionar produto a uma composição
    Dado que existe uma composição de cesta
    E que existe um produto "Batata" disponível
    Quando eu adiciono o produto "Batata" à composição
    E defino a quantidade do produto como 10
    Quando eu salvo o produto na composição
    Então o produto "Batata" deve estar na composição

  @composicao @CMP-04
  Cenário: Atualizar a quantidade de um produto na composição
    Dado que existe uma composição com produto "Cebola" e quantidade 1
    Quando eu edito a quantidade do produto na composição para 3
    E salvo as alterações da composição
    Então a quantidade de "Cebola" na composição deve ser 3

  @composicao @CMP-05
  Cenário: Remover produto de uma composição
    Dado que existe uma composição com produto "Alho"
    Quando eu edito a quantidade do produto na composição para 0
    E salvo as alterações da composição
    Então o produto "Alho" não deve mais estar na composição

  @composicao @CMP-06
  Cenário: Calcular quantidade total de produto para as cestas
    Dado que existe uma composição com 25 cestas
    E o produto "Tomate" tem quantidade 100
    Quando eu calculo a quantidade total necessária
    Então a quantidade por cesta de "Tomate" deve ser 4

  @composicao @CMP-07
  Cenário: Validar produtos disponíveis nas ofertas
    Dado que existe uma composição com produto "Cenoura"
    E a quantidade total necessária é 80 unidades
    E as ofertas disponíveis somam apenas 60 unidades
    Quando eu valido a disponibilidade
    Então o sistema deve alertar sobre a falta

  @composicao @CMP-08
  Cenário: Listar composições de um ciclo
    Dado que existem múltiplas composições em um ciclo
    Quando eu solicito todas as composições do ciclo
    Então eu devo ver todas as composições, produtos e quantidade
