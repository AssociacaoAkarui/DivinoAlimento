# language: pt
Funcionalidade: Gestão de Pedidos de Consumidores

  @pedidoconsumidores
  Cenário: PDC-01 Criar um novo pedido de consumidor com sucesso
    Dado que existe um ciclo ativo
    E que existe um usuário consumidor cadastrado
    Quando eu crio um novo pedido para o consumidor no ciclo
    E o status do pedido como "pendente"
    Quando eu salvo o novo pedido
    Então o pedido deve ser criado com sucesso

  @pedidoconsumidores
  Cenário: PDC-02 Ver os detalhes de um pedido existente
    Dado que existe um pedido cadastrado para um consumidor
    Quando eu solicito os detalhes do pedido
    Então eu devo ver os detalhes do pedido incluindo consumidor e ciclo

  @pedidoconsumidores
  Cenário: PDC-03 Adicionar produto a um pedido
    Dado que existe um pedido ativo de um consumidor
    E que existe um produto "Banana" disponível para compra
    Quando eu adiciono o produto "Banana" ao pedido
    E defino a quantidade como 5
    Quando eu salvo o produto no pedido
    Então o produto "Banana" deve estar no pedido com quantidade 5

  @pedidoconsumidores
  Cenário: PDC-04 Atualizar a quantidade de um produto no pedido
    Dado que existe um pedido com produto "Maçã" e quantidade 3
    Quando eu edito a quantidade para 6
    E salvo as alterações do pedido
    Então a quantidade de "Maçã" no pedido deve ser 6

  @pedidoconsumidores
  Cenário: PDC-05 Calcular valor total do pedido
    Dado que existe um pedido com produtos
    E o produto "Alface" tem quantidade 2 e valor 3.00
    E o produto "Tomate" tem quantidade 3 e valor 4.00
    Quando eu calculo o valor total do pedido
    Então o valor total deve ser 18.00

  @pedidoconsumidores
  Cenário: PDC-06 Atualizar status do pedido
    Dado que existe um pedido com status "pendente"
    Quando eu edito o status do pedido para "confirmado"
    E salvo as alterações do pedido
    Então o status do pedido deve ser "confirmado"

  @pedidoconsumidores
  Cenário: PDC-07 Listar o pedido de um consumidor
    Dado que um consumidor possui pedido
    Quando eu solicito o pedido do consumidor
    Então eu devo ver todos os produtos e quantidades pedidos do consumidor

  @pedidoconsumidores
  Cenário: PDC-08 Listar todos os pedidos de um ciclo
    Dado que existem múltiplos pedidos em um ciclo
    Quando eu solicito todos os pedidos do ciclo
    Então eu devo ver todos os pedidos associados ao ciclo