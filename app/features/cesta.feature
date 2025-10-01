# language: pt
Funcionalidade: Gestão de Cestas

  Cenário: CST-01 Criar uma nova cesta com sucesso
    Dado que eu quero criar uma nova Cesta
    Quando eu preencho o nome da cesta com "Cesta 01"
    E o valor máximo da cesta como 100
    E o status da cesta como "ativo"
    Quando eu salvo a nova cesta
    Então a cesta deve ser criada com sucesso