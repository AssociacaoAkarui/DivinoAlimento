# language: pt
Funcionalidade: Gestão de Pontos de Entrega

  Cenário: PEN-01 Criar um novo ponto de entrega com sucesso
    Dado que eu quero criar um novo ponto de entrega
    Quando eu preencho o nome do ponto de entrega com "Centro - Rua das Flores"
    E o endereço do ponto de entrega com "Rua das Flores, 123 - Centro"
    E o status do ponto de entrega como "ativo"
    Quando eu salvo o novo ponto de entrega
    Então o ponto de entrega "Centro - Rua das Flores" deve ser criado com sucesso

  Cenário: PEN-02 Ver os detalhes de um ponto de entrega existente
    Dado que existe um ponto de entrega "Bairro Norte" cadastrado
    Quando eu solicito os detalhes do ponto de entrega "Bairro Norte"
    Então eu devo ver os detalhes do ponto de entrega "Bairro Norte"

  Cenário: PEN-03 Atualizar o nome de um ponto de entrega existente
    Dado que existe um ponto de entrega "Centro Antigo"
    Quando eu edito o nome do ponto de entrega para "Centro Histórico"
    E salvo as alterações do ponto de entrega
    Então o nome do ponto de entrega deve ser "Centro Histórico"

  Cenário: PEN-04 Atualizar o endereço de um ponto de entrega existente
    Dado que existe um ponto de entrega com endereço "Rua A, 100"
    Quando eu edito o endereço para "Rua A, 200 - Sala 5"
    E salvo as alterações do ponto de entrega
    Então o endereço do ponto de entrega deve ser "Rua A, 200 - Sala 5"

  Cenário: PEN-05 Atualizar o status de um ponto de entrega existente
    Dado que existe um ponto de entrega com status "ativo"
    Quando eu edito o status do ponto de entrega para "inativo"
    E salvo as alterações do ponto de entrega
    Então o status do ponto de entrega deve ser "inativo"

  Cenário: PEN-06 Deletar um ponto de entrega existente
    Dado que existe um ponto de entrega "Ponto Temporário"
    E que não exista nenhum ciclo associado ao ponto de entrega "Ponto Temporário"
    Quando eu deleto o ponto de entrega "Ponto Temporário"
    Então o ponto de entrega "Ponto Temporário" não deve mais existir no sistema