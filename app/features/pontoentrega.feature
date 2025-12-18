# language: pt
Funcionalidade: Gestão de Pontos de Entrega

  @pontoentrega @PEN-01 @versaoNov2025 @alteradoOut2025
  Cenário: Criar um novo ponto de entrega para um mercado específico com sucesso
    Dado que eu quero criar um novo ponto de entrega para o mercado "Quitandinha"
    Quando eu preencho o nome do ponto de entrega com "Centro - Rua das Flores, 123"
    Quando eu salvo o novo ponto de entrega
    Então o ponto de entrega "Centro - Rua das Flores, 123" é criado para o mercado "Quitandinha"

  @pontoentrega @PEN-02 @versaoNov2025 @alteradoOut2025
  Cenário: Ver os nomes dos pontos de entrega de um mercado específico
    Dado que existe os pontos de entrega "Bairro Norte" e "Bairro Sul" cadastrados para o mercado "Quitandinha"
    Quando eu solicito os nomes dos pontos de entrega do mercado "Quitandinha"
    Então eu devo ver os nomes dos pontos de entrega "Bairro Norte" e "Bairro Sul"

  @pontoentrega @PEN-03
  Cenário: Atualizar o nome de um ponto de entrega existente
    Dado que existe um ponto de entrega "Centro Antigo"
    Quando eu edito o nome do ponto de entrega para "Centro Histórico"
    E salvo as alterações do ponto de entrega
    Então o nome do ponto de entrega deve ser "Centro Histórico"

  @pontoentrega @PEN-06
  Cenário: Deletar um ponto de entrega existente
    Dado que existe um ponto de entrega "Ponto Temporário"
    E que não exista nenhum ciclo associado ao ponto de entrega "Ponto Temporário"
    Quando eu deleto o ponto de entrega "Ponto Temporário"
    Então o ponto de entrega "Ponto Temporário" não deve mais existir no sistema
