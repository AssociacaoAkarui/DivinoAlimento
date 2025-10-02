# language: pt
Funcionalidade: Gestão de Categorias de Produtos

  Cenário: CAT-01 Criar uma nova categoria com sucesso
    Dado que eu quero criar uma nova categoria de produtos
    Quando eu preencho o nome da categoria com "Verduras"
    E o status da categoria como "ativo"
    Quando eu salvo a nova categoria
    Então a categoria "Verduras" deve ser criada com sucesso

  Cenário: CAT-02 Ver os detalhes de uma categoria existente
    Dado que existe uma categoria "Legumes" cadastrada
    Quando eu solicito os detalhes da categoria "Legumes"
    Então eu devo ver os detalhes da categoria "Legumes"

  Cenário: CAT-03 Atualizar o nome de uma categoria existente
    Dado que existe uma categoria "Verdura"
    Quando eu edito o nome da categoria para "Verduras e Folhas"
    E salvo as alterações da categoria
    Então o nome da categoria deve ser "Verduras e Folhas"

  Cenário: CAT-04 Atualizar o status de uma categoria existente
    Dado que existe uma categoria com status "ativo"
    Quando eu edito o status da categoria para "inativo"
    E salvo as alterações da categoria
    Então o status da categoria deve ser "inativo"

  Cenário: CAT-05 Deletar uma categoria existente
    Dado que existe uma categoria "Categoria Temporária"
    E que não existam produtos associados à categoria "Categoria Temporária"
    Quando eu deleto a categoria "Categoria Temporária"
    Então a categoria "Categoria Temporária" não deve mais existir no sistema

  Cenário: CAT-06 Listar todas as categorias ativas
    Dado que existem categorias "Frutas", "Verduras" e "Legumes" cadastradas
    E todas as categorias estão com status "ativo"
    Quando eu solicito a lista de categorias ativas
    Então eu devo ver as categorias "Frutas", "Verduras" e "Legumes"