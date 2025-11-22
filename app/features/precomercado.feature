# language: pt
Funcionalidade: Gestão de Preços por Mercado
  Como administrador do sistema
  Quero gerenciar preços específicos de produtos por mercado
  Para que cada mercado tenha sua própria tabela de preços

  Contexto:
    Dado que existe um usuário administrador
    E que existe uma categoria de produtos
    E que existe um produto cadastrado
    E que existe um mercado cadastrado

  Cenário: Criar preço para produto em mercado
    Quando eu criar um preço de "15.50" para o produto no mercado
    Então o preço deve ser criado com sucesso
    E o preço deve estar com status "ativo"

  Cenário: Listar preços de um mercado
    Dado que existem 3 preços cadastrados para o mercado
    Quando eu listar os preços do mercado
    Então devo receber 3 preços

  Cenário: Buscar preço específico
    Dado que existe um preço cadastrado
    Quando eu buscar o preço por ID
    Então devo receber os dados do preço

  Cenário: Atualizar preço
    Dado que existe um preço de "10.00" cadastrado
    Quando eu atualizar o preço para "12.50"
    Então o preço deve ser atualizado com sucesso
    E o novo valor deve ser "12.50"

  Cenário: Inativar preço
    Dado que existe um preço ativo
    Quando eu inativar o preço
    Então o status do preço deve ser "inativo"

  Cenário: Deletar preço
    Dado que existe um preço cadastrado
    Quando eu deletar o preço
    Então o preço deve ser removido do sistema
