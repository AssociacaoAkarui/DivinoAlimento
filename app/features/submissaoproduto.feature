# language: pt
Funcionalidade: Gerenciamento de submissões de produtos
  Como administrador
  Eu quero gerenciar as submissões de produtos dos fornecedores
  Para aprovar ou reprovar novos produtos

  Cenário: Criar uma submissão de produto
    Dado que existe um fornecedor com id 2
    Quando eu crio uma submissão de produto com nome "Tomate Orgânico", preço 4.50 e medida "kg"
    Então a submissão deve ser criada com sucesso
    E a submissão deve ter status "pendente"

  Cenário: Aprovar uma submissão de produto
    Dado que existe uma submissão de produto pendente
    Quando eu aprovo a submissão
    Então a submissão deve ter status "aprovado"

  Cenário: Reprovar uma submissão de produto
    Dado que existe uma submissão de produto pendente
    Quando eu reprovo a submissão com motivo "Produto fora dos padrões de qualidade"
    Então a submissão deve ter status "reprovado"
    E a submissão deve ter o motivo de reprovação "Produto fora dos padrões de qualidade"

  Cenário: Listar submissões por status
    Dado que existem submissões com diferentes status
    Quando eu listo as submissões com status "pendente"
    Então deve retornar apenas as submissões pendentes
