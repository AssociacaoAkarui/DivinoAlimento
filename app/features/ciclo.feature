# language: pt
Funcionalidade: Gestão de Ciclos

  @CIC-01
  Cenário: Criar uma Nova Cesta para o ciclo
    Dado que eu quero criar uma nova Cesta para o ciclo
    Quando eu crio 1 Cesta
    Então a Cesta deve ser criada corretamente

  @CIC-02
  Cenário: Criar um novo Ponto de Entrega
    Dado que eu quero criar um novo Ponto de Entrega
    Quando eu crio 1 Ponto de Entrega
    Então o Ponto de Entrega deve ser criado corretamente

  @CIC-03
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

  @CIC-04
  Cenário: Atualizar um ciclo existente alterando dados básicos
    Dado que eu quero criar e atualizar um ciclo
    Quando eu altero o campo nome com o nome 'ciclo_modificado'
    Quando eu altero a observacao para 'observacao modificada'
    Quando eu altero a oferta inicio para '2023-02-01'
    Quando eu altero a oferta fim para '2023-02-28'
    Quando o usuário atualiza o ciclo
    Então o ciclo deve estar atualizado com os novos dados

  @CIC-05
  Cenário: Atualizar um ciclo existente alterando entregas e cestas
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

  @CIC-06
  Cenário: Deletar um ciclo existente
    Dado que eu quero criar e deletar um ciclo
    Quando o usuário deleta o ciclo
    Então o ciclo não deve mais existir no sistema

  @CIC-07
  Cenário: Erro o criar um novo ciclo
    Dado que eu quero cria um novo ciclo con erro
    Quando o usuário cria um novo ciclo con erro
    Então uma mensagem de erro deve ser retornada

  @CIC-08
  Cenário: Listar ciclos com paginação por cursor
    Dado que existem 12 ciclos cadastrados
    Quando eu listo os ciclos com limite de 10
    Então eu devo receber 10 ciclos e um cursor para a próxima página
    Quando eu listo os ciclos novamente usando o cursor recebido
    Então eu devo receber os 2 ciclos restantes

  @CIC-09
  Cenário: Erro ao criar um novo ciclo com dados inválidos
    Dado que eu quero criar um novo Ciclo
    Quando eu tento criar um ciclo com o nome ''
    Então eu devo receber um erro de validação com a mensagem "O nome do ciclo não pode ser vazio."

  @CIC-10
  Cenário: Erro ao criar um ciclo sem as datas de oferta
    Dado que eu quero criar um novo Ciclo
    Quando eu nome 'Ciclo Sem Datas'
    Quando eu tento criar o ciclo sem as datas de oferta
    Então eu devo receber um erro de validação sobre as datas de oferta

  @CIC-11
  Cenário: Erro ao tentar atualizar um ciclo com status inválido
    Dado que eu quero criar e atualizar um ciclo
    Quando eu tento atualizar o status para 'INVALIDO'
    Então eu devo receber um erro de validação informando que o status é inválido

  @CIC-12
  Cenário: Ignorar campos não permitidos ao criar um ciclo
    Dado que eu quero criar um novo Ciclo
    Quando eu crio 1 Ponto de Entrega
    Quando eu nome 'Ciclo com Campos Extras'
    Quando eu oferta inicio '2023-01-01'
    Quando eu oferta fim '2023-01-31'
    Quando eu incluo o campo 'id' com valor '999'
    Quando eu incluo o campo 'createdAt' com valor '2023-01-01'
    Quando o usuário cria um novo ciclo
    Então o ciclo deve ser criado ignorando os campos 'id' e 'createdAt'
