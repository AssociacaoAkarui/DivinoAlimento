Feature: Gestión de Ciclos

  Scenario: Criar uma Nova Cesta
    Given que eu quero criar uma nova Cesta
    When eu crio a Cesta
    Then a Cesta deve ser criada corretamente

  Scenario: Criar um novo Ponto de Entrega
    Given que eu quero criar um novo Ponto de Entrega
    When eu crio o Ponto de Entrega
    Then o Ponto de Entrega deve ser criado corretamente

  Scenario: Criar um novo ciclo com pontos de entrega e cestas ativas
    Given que o sistema possui pontos de entrega e cestas ativas
    When o usuário cria um novo ciclo
    Then o ciclo deve ser criado com os pontos de entrega e cestas ativas