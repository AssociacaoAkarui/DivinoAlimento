# language: pt
Funcionalidade: Gestão de Categorias de Produtos

  @categoriaprodutos @CAT-01
  Cenário: Criar uma nova categoria com sucesso
    Dado que eu quero criar uma nova categoria de produtos
    Quando eu preencho o nome da categoria com "Verduras"
    E o status da categoria como "ativo"
    Quando eu salvo a nova categoria
    Então a categoria "Verduras" deve ser criada com sucesso

  @categoriaprodutos @CAT-02
  Cenário: Ver os detalhes de uma categoria existente
    Dado que existe uma categoria "Legumes" cadastrada
    Quando eu solicito os detalhes da categoria "Legumes"
    Então eu devo ver os detalhes da categoria "Legumes"

  @categoriaprodutos @CAT-03
  Cenário: Atualizar o nome de uma categoria existente
    Dado que existe uma categoria "Verdura"
    Quando eu edito o nome da categoria para "Verduras e Folhas"
    E salvo as alterações da categoria
    Então o nome da categoria deve ser "Verduras e Folhas"

  @categoriaprodutos @CAT-04
  Cenário: Atualizar o status de uma categoria existente
    Dado que existe uma categoria com status "ativo"
    Quando eu edito o status da categoria para "inativo"
    E salvo as alterações da categoria
    Então o status da categoria deve ser "inativo"

  @categoriaprodutos @CAT-05
  Cenário: Deletar uma categoria existente
    Dado que existe uma categoria "Categoria Temporária"
    E que não existam produtos associados à categoria "Categoria Temporária"
    Quando eu deleto a categoria "Categoria Temporária"
    Então a categoria "Categoria Temporária" não deve mais existir no sistema

  @categoriaprodutos @CAT-06
  Cenário: Listar todas as categorias ativas
    Dado que existem categorias "Frutas", "Verduras" e "Legumes" cadastradas
    E todas as categorias estão com status "ativo"
    Quando eu solicito a lista de categorias ativas
    Então eu devo ver as categorias "Frutas", "Verduras" e "Legumes"
