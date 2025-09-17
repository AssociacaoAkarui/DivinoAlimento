Funcionalidade: Gestión de Ciclos

  Cenário: Criar uma Nova Cesta
    Dado que eu quero criar uma nova Cesta
    Quando eu crio a Cesta
    Então a Cesta deve ser criada corretamente

  Cenário: Criar um novo Ponto de Entrega
    Dado que eu quero criar um novo Ponto de Entrega
    Quando eu crio o Ponto de Entrega
    Então o Ponto de Entrega deve ser criado corretamente

  Cenário: Criar um novo ciclo com pontos de entrega e cestas ativas
    Dado que o sistema possui um ponto de entrega e 2 cestas ativas
    Quando o usuário cria um novo ciclo
    Então o ciclo deve ser criado com os pontos de entrega e cestas ativas