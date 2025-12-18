# language: pt
Funcionalidade: Gerenciamento de ciclos
  Como administrador
  Eu quero gerenciar ciclos de comercialização
  Para organizar as ofertas e entregas de produtos

  Cenário: Criar um ciclo
    Dado que existe um ponto de entrega ativo
    Quando eu crio um ciclo com nome "Ciclo Teste" e datas válidas
    Então o ciclo deve ser criado com sucesso
    E o ciclo deve ter status "oferta"

  Cenário: Atualizar um ciclo
    Dado que existe um ciclo cadastrado
    Quando eu atualizo o ciclo com nome "Ciclo Atualizado"
    Então o ciclo deve ter o nome "Ciclo Atualizado"

  Cenário: Listar ciclos
    Dado que existem ciclos cadastrados
    Quando eu listo os ciclos
    Então deve retornar a lista de ciclos

  Cenário: Deletar um ciclo
    Dado que existe um ciclo cadastrado
    Quando eu deleto o ciclo
    Então o ciclo deve ser removido com sucesso
