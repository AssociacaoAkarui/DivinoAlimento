# language: pt
Funcionalidade: Gestão de Mercados por Ciclo
  Como administrador de mercado
  Eu quero associar mercados aos ciclos
  Para gerenciar diferentes tipos de venda em cada ciclo

  Cenário: Adicionar mercado tipo CESTA a um ciclo
    Dado que existe um ciclo cadastrado
    E que existe um mercado tipo "cesta" cadastrado
    E que existe um ponto de entrega ativo
    Quando eu associo o mercado ao ciclo com tipo de venda "cesta"
      | quantidadeCestas |    50 |
      | valorAlvoCesta   | 80.00 |
      | ordemAtendimento |     1 |
    Então o mercado deve estar associado ao ciclo
    E o tipo de venda deve ser "cesta"
    E a quantidade de cestas deve ser 50

  Cenário: Adicionar mercado tipo LOTE a um ciclo
    Dado que existe um ciclo cadastrado
    E que existe um mercado tipo "lote" cadastrado
    E que existe um ponto de entrega ativo
    Quando eu associo o mercado ao ciclo com tipo de venda "lote"
      | valorAlvoLote    | 500.00 |
      | ordemAtendimento |      1 |
    Então o mercado deve estar associado ao ciclo
    E o tipo de venda deve ser "lote"

  Cenário: Adicionar mercado tipo VENDA_DIRETA a um ciclo
    Dado que existe um ciclo cadastrado
    E que existe um mercado tipo "venda_direta" cadastrado
    E que existe um ponto de entrega ativo
    Quando eu associo o mercado ao ciclo com tipo de venda "venda_direta"
      | ordemAtendimento | 1 |
    Então o mercado deve estar associado ao ciclo
    E o tipo de venda deve ser "venda_direta"

  Cenário: Listar mercados de um ciclo
    Dado que existe um ciclo cadastrado
    E que existem 3 mercados associados ao ciclo
    Quando eu listo os mercados do ciclo
    Então deve retornar 3 mercados

  Cenário: Atualizar ordem de atendimento dos mercados
    Dado que existe um ciclo com 2 mercados associados
    Quando eu atualizo a ordem de atendimento do segundo mercado para 1
    Então a ordem de atendimento deve ser atualizada

  Cenário: Remover mercado de um ciclo
    Dado que existe um ciclo com mercado associado
    Quando eu removo o mercado do ciclo
    Então o mercado não deve estar mais associado ao ciclo

  Cenário: Validar campos obrigatórios para tipo CESTA
    Dado que existe um ciclo cadastrado
    E que existe um mercado tipo "cesta" cadastrado
    Quando eu tento associar o mercado sem quantidade de cestas
    Então deve retornar erro de validação

  Cenário: Validar unicidade de mercado por ciclo
    Dado que existe um ciclo com mercado associado
    Quando eu tento associar o mesmo mercado novamente
    Então deve retornar erro de duplicação
