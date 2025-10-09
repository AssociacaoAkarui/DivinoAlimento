# language: pt
Funcionalidade: Gestão de Ofertas de Produtos

  @oferta
  Cenário: OFE-01 Adicionar produto a uma oferta com sucesso
    Dado que existe uma oferta ativa
    E que existe um produto "Cenoura" cadastrado
    Quando eu adiciono o produto "Cenoura" à oferta
    E defino a quantidade como 50
    Quando eu salvo o produto na oferta
    Então o produto "Cenoura" deve estar associado à oferta

  @oferta
  Cenário: OFE-02 Ver os detalhes de um produto ofertado
    Dado que existe um produto "Beterraba" em uma oferta
    Quando eu solicito os detalhes do produto ofertado
    Então eu devo ver quantidade, medida e valor de referência

  @oferta
  Cenário: OFE-03 Atualizar a quantidade de um produto ofertado
    Dado que existe um produto ofertado com quantidade 30
    Quando eu edito a quantidade para 45
    E salvo as alterações do produto ofertado
    Então a quantidade do produto ofertado deve ser 45

  @oferta
  Cenário: OFE-04 Remover produto de uma oferta
    Dado que existe um produto "Abóbora" em uma oferta
    E que não existem composições para este produto ofertado
    Quando eu removo o produto da oferta
    Então o produto "Abóbora" não deve mais estar na oferta

  @oferta
  Cenário: OFE-05 Validar quantidade disponível
    Dado que existe um produto ofertado com quantidade 25
    E existem composições que somam 20 unidades
    Quando eu verifico a quantidade disponível
    Então a quantidade disponível deve ser 5

  @oferta
  Cenário: OFE-06 Listar todos os produtos de uma oferta
    Dado que existe uma oferta com múltiplos produtos
    Quando eu solicito todos os produtos da oferta
    Então eu devo ver a lista completa de produtos ofertados