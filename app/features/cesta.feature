# language: pt
Funcionalidade: Gestão de Cestas

  Cenário: CST-01 Criar uma nova cesta com sucesso
    Dado que eu quero criar uma nova Cesta
    Quando eu preencho o nome da cesta com "Cesta 01"
    E o valor máximo da cesta como 100
    E o status da cesta como "ativo"
    Quando eu salvo a nova cesta
    Então a cesta deve ser criada com sucesso
  
  Cenário: CST-02 Ver os detalhes de uma cesta existente
    Dado que existe uma cesta "Divino Alimento" cadastrada
    Quando eu solicito os detalhes da cesta "Divino Alimento"
    Então eu devo ver os detalhes da cesta "Divino Alimento"
  
  Cenário: CST-03 Atualizar o nome de uma cesta existente
    Dado que existe uma cesta "Cesta 01"
    Quando eu edito o nome da cesta para "Divino Alimento"
    E salvo as alterações da cesta
    Então o nome da cesta deve ser "Divino Alimento"

  Cenário: CST-04 Atualizar o valor máximo de uma cesta existente
    Dado que existe uma cesta com valor máximo 100
    Quando eu edito o valor máximo da cesta para 50
    E salvo as alterações da cesta
    Então o valor máximo da cesta deve ser 100
   
  Cenário: CST-05 Atualizar o status de uma cesta existente
    Dado que existe uma cesta com status "ativo"
    Quando eu edito o status da cesta para "inativo"
    E salvo as alterações da cesta
    Então o valor máximo da cesta deve ser "inativo"

  Cenário: CST-06 Deletar uma cesta existente
    Dado que existe uma cesta "Divino Alimento"
    E que não exista nenhum ciclo que seja composto pela cesta "Divino Alimento"
    Quando eu deleto a cesta "Divino Alimento"
    Então a cesta "Divino Alimento" não deve mais existir no sistema

  Cenário: CST-07 Listar todas as cestas ativas
    Dado que existem cestas "Cesta 01", "Divino Alimento" e "Vila Dona Mariana" cadastradas
    E todas as cestas estão com status "ativo"
    Quando eu solicito a lista de cestas ativas
    Então eu devo ver as cestas "Cesta 01", "Divino Alimento" e "Vila Dona Mariana"
