# language: pt_br
Funcionalidade: Gestión de Ciclos

  Cenário: Criar uma Nova Cesta
    Dado que eu quero criar uma nova Cesta
    Quando eu crio 1 Cesta
    Então a Cesta deve ser criada corretamente

  Cenário: Criar um novo Ponto de Entrega
    Dado que eu quero criar um novo Ponto de Entrega
    Quando eu crio 1 Ponto de Entrega
    Então o Ponto de Entrega deve ser criado corretamente

  Cenário: Criar um novo ciclo com pontos de entrega e cestas ativas
    Dado que eu quero criar um novo Ciclo
    Quando eu crio 2 Ponto de Entrega
    Quando eu crio 2 Cesta
    Quando o usuário cria um novo ciclo
    Então o ciclo deve ser criado com os pontos de entrega e cestas ativas