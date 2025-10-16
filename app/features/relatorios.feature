# language: pt
Funcionalidade: Geração de Relatórios

  @relatorio @REL-01 @pending
  Cenário: Gerar relatório de pedidos por consumidor
    Dado que existem múltiplos pedidos de consumidores e múltiplos ciclos
    Quando eu seleciono os ciclos desejados
    Quando eu solicito o relatório de pedidos por consumidor
    Então eu devo receber um relatório agrupado por consumidor
    E cada consumidor deve ter seus produtos listados

  @relatorio @REL-02 @pending
  Cenário: Gerar relatório de pedidos por produto
    Dado que existem múltiplos pedidos de consumidores e múltiplos ciclos
    Quando eu seleciono os ciclos desejados
    Quando eu solicito o relatório de pedidos por produto
    Então eu devo receber um relatório agrupado por produto
    E cada produto deve mostrar todos os consumidores que o pediram

  @relatorio @REL-03 @pending
  Cenário: Gerar relatório de fornecedores
    Dado que existem múltiplos fornecedores e múltiplos ciclos
    Quando eu seleciono os ciclos desejados
    E solicito o relatório de fornecedores
    Então eu devo receber um relatório com todas as movimentações dos fornecedores
    E o relatório deve incluir produtos, quantidades e valores

  @relatorio @REL-04 @pending
  Cenário: Exportar relatório em CSV
    Dado que existe um relatório de pedidos gerado
    Quando eu escolho exportar em formato CSV
    Então eu devo receber um arquivo CSV com os dados
    E o arquivo deve conter cabeçalhos corretos
