# language: pt
Funcionalidade: Relatório de Entregas dos Fornecedores
  Como administrador ou fornecedor
  Eu quero visualizar as entregas de produtos por ciclo
  Para acompanhar o que foi ofertado e entregar aos mercados

  @entregasfornecedores @ENT-01
  Cenário: Listar entregas de todos os fornecedores de um ciclo
    Dado que existe um ciclo ativo
    E que existem 3 fornecedores com ofertas neste ciclo
    Quando eu solicito as entregas do ciclo
    Então eu devo ver entregas de 3 fornecedores diferentes

  @entregasfornecedores @ENT-02
  Cenário: Listar entregas de um fornecedor específico
    Dado que existe um ciclo ativo
    E que existe um fornecedor "João Silva" com ofertas neste ciclo
    Quando eu solicito as entregas do ciclo para o fornecedor "João Silva"
    Então eu devo ver apenas as entregas do fornecedor "João Silva"

  @entregasfornecedores @ENT-03
  Cenário: Visualizar detalhes de uma entrega
    Dado que existe uma oferta de "Tomate" no ciclo
    Quando eu solicito as entregas do ciclo
    Então eu devo ver o nome do fornecedor
    E eu devo ver o nome do produto
    E eu devo ver a quantidade ofertada
    E eu devo ver o valor unitário
    E eu devo ver o valor total

  @entregasfornecedores @ENT-04
  Cenário: Listar entregas sem ofertas cadastradas
    Dado que existe um ciclo sem ofertas
    Quando eu solicito as entregas do ciclo
    Então eu devo ver uma lista vazia

  @entregasfornecedores @ENT-05
  Cenário: Erro ao buscar entregas de ciclo inexistente
    Quando eu solicito as entregas de um ciclo inexistente
    Então eu devo receber um erro informando que o ciclo não existe
