# language: pt
Funcionalidade: Gestão de Produtos

  Cenário: PRO-01 Criar um novo produto com sucesso
    Dado que eu quero criar um novo Produto
    Quando eu preencho o nome com "Maçã Fuji"
    E a medida como "unidade"
    E o peso em gramas com "150"
    E o valor de referência com "1.50"
    E o status como "ativo"
    E a categoria como "Frutas"
    E o descritivo com "Maçã Fuji fresca e crocante"
    Quando eu salvo o novo produto
    Então o produto "Maçã Fuji" deve ser criado com sucesso

  Cenário: PRO-02 Ver os detalhes de um produto existente
    Dado que existe um produto "Banana Prata" cadastrado na categoria "Frutas"
    Quando eu peço os detalhes do produto "Banana Prata"
    Então eu devo ver os detalhes do produto "Banana Prata" com a categoria "Frutas"

  Cenário: PRO-03 Atualizar um produto existente
    Dado que existe um produto "Pera Williams" cadastrado na categoria "Frutas"
    Quando eu preencho o nome com "Pera Portuguesa"
    E o valor de referência com "4.50"
    E eu salvo as alterações do produto
    Então o nome do produto na base de dados deve ser "Pera Portuguesa"

  Cenário: PRO-04 Deletar um produto existente
    Dado que existe um produto "Uva Itália" cadastrado na categoria "Frutas"
    Quando eu deleto o produto "Uva Itália"
    Então o produto "Uva Itália" não deve mais existir no sistema
