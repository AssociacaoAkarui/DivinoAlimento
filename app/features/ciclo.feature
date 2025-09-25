# language: pt
Funcionalidade: Gestión de Ciclos

  Cenário: Criar uma Nova Cesta
    Dado que eu quero criar uma nova Cesta
    Quando eu crio 1 Cesta
    Então a Cesta deve ser criada corretamente

  Cenário: Criar um novo Ponto de Entrega
    Dado que eu quero criar um novo Ponto de Entrega
    Quando eu crio 1 Ponto de Entrega
    Então o Ponto de Entrega deve ser criado corretamente

  Cenário: Criar um novo ciclo com pontos de entrega e cestas ativas
    Dado que eu quero criar um novo Ciclo
    Quando eu crio 1 Ponto de Entrega
    Quando eu crio 1 Cesta
    Quando eu nome 'Ciclo de Teste'
    Quando eu oferta inicio '2023-01-01'
    Quando eu oferta fim '2023-01-31'
    Quando eu itens adicionais inicio '2023-01-01'
    Quando eu itens adicionais fim '2023-01-31'
    Quando eu retirada consumidor inicio '2023-01-01'
    Quando eu retirada consumidor fim '2023-01-31'
    Quando observacao 'test'
    Quando entrega fornecedor inicio '2023-01-01'
    Quando entrega fornecedor fim '2023-01-31'
    Quando quantidade cestas '1'
    Quando o usuário cria um novo ciclo
    Então o ciclo deve ser criado com os pontos de entrega e cestas ativas

  Cenário: Atualizar um ciclo existente alterando ou não os pontos de entrega e cestas ativas
    Dado que eu quero criar e atualizar um ciclo
    Quando eu altero o campo nome com o nome 'ciclo_modificado'
    Quando o usuário altera um ciclo selecionado
  
