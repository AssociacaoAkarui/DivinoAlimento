# language: pt
Funcionalidade: Gestão de Ciclos

  Cenário: CIC-01 Criar uma Nova Cesta para o ciclo
    Dado que eu quero criar uma nova Cesta para o ciclo
    Quando eu crio 1 Cesta
    Então a Cesta deve ser criada corretamente

  Cenário: CIC-02 Criar um novo Ponto de Entrega
    Dado que eu quero criar um novo Ponto de Entrega
    Quando eu crio 1 Ponto de Entrega
    Então o Ponto de Entrega deve ser criado corretamente

  Cenário: CIC-03 Criar um novo ciclo com pontos de entrega e cestas ativas
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

  Cenário: CIC-04 Atualizar um ciclo existente alterando dados básicos
    Dado que eu quero criar e atualizar um ciclo
    Quando eu altero o campo nome com o nome 'ciclo_modificado'
    Quando eu altero a observacao para 'observacao modificada'
    Quando eu altero a oferta inicio para '2023-02-01'
    Quando eu altero a oferta fim para '2023-02-28'
    Quando o usuário atualiza o ciclo
    Então o ciclo deve estar atualizado com os novos dados

  Cenário: CIC-05 Atualizar um ciclo existente alterando entregas e cestas
    Dado que eu quero criar e atualizar um ciclo com associações
    Quando eu crio 1 Ponto de Entrega para atualização
    Quando eu crio 2 Cesta para atualização
    Quando eu altero o ponto de entrega
    Quando eu adiciono nova entrega fornecedor inicio '2023-03-01' e fim '2023-03-05'
    Quando eu adiciono segunda entrega fornecedor inicio '2023-03-10' e fim '2023-03-15'
    Quando eu altero primeira cesta com quantidade '10'
    Quando eu adiciono segunda cesta com quantidade '5'
    Quando o usuário atualiza o ciclo com associações
    Então o ciclo deve estar atualizado com as novas entregas e cestas

  Cenário: CIC-06 Deletar um ciclo existente
    Dado que eu quero criar e deletar um ciclo
    Quando o usuário deleta o ciclo
    Então o ciclo não deve mais existir no sistema

  Cenário: CIC-07 Erro o criar um novo ciclo
    Dado que eu quero cria um novo ciclo con erro
    Quando o usuário cria um novo ciclo con erro
    Então o mensagem do erro contem 'Erro ao criar ciclo'
