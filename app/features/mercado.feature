# language: pt
Funcionalidade: Gestão de Mercados

  @mercado @MER-01 @versaoNov2025 @criadoOut2025
  Cenário: Criar um novo mercado tipo Cesta com sucesso
    Dado que eu quero criar um novo mercado tipo Cesta
    E exista um usuário cadastrado com nome "Manuel"
    Quando eu preencho o nome do mercado com "Grupo de Compras"
    E o tipo do mercado como Cesta
    E o responsável do mercado tipo Cesta como "Manuel"
    E a taxa administrativa como 1
    E o ponto de entrega como "Akarui"
    E o valor máximo do mercado tipo Cesta como 30
    E o status do mercado tipo Cesta como "ativo"
    Quando eu salvo o novo mercado tipo Cesta
    Então o mercado tipo Cesta "Grupo de Compras" deve ser criado com sucesso com o ponto de entrega "Akarui" deve ser criado vinculado ao mercado "Grupo de Compras"

  @mercado @MER-02 @versaoNov2025 @criadoOut2025
  Cenário: Criar um novo mercado tipo Lote com sucesso
    Dado que eu quero criar um novo mercado tipo Lote
    E exista um usuário cadastrado com nome "Manuel"
    Quando eu preencho o nome do mercado com "Mercado O Mais Barato"
    E o tipo do mercado como Lote
    E o responsável do mercado tipo Lote como "Manuel"
    E a taxa administrativa como 1
    E o ponto de entrega como "Rua do Mercado, 177"
    E o status do mercado como "ativo"
    Quando eu salvo o novo mercado tipo Lote
    Então o mercado tipo Lote "Mercado O Mais Barato" deve ser criado com sucesso com o ponto de entrega "Rua do Mercado, 177" deve ser criado vinculado ao mercado "Mercado O Mais Barato"

  @mercado @MER-03 @versaoNov2025 @criadoOut2025
  Cenário: Criar um novo mercado tipo Venda Direta com sucesso
    Dado que eu quero criar um novo mercado tipo Venda Direta
    E exista um usuário cadastrado com nome "Manuel"
    Quando eu preencho o nome do mercado com "Venda Direta para Grupo de Compras"
    E o tipo do mercado como Venda Direta
    E o responsável do mercado tipo Venda Direta como "Manuel"
    E a taxa administrativa como 1
    E o ponto de entrega como "Akarui - Rua da Fome, 144"
    E o status do mercado tipo Venda Direta como "ativo"
    Quando eu salvo o novo mercado tipo Venda Direta
    Então o mercado tipo Venda Direta "Venda Direta para Grupo de Compras" deve ser criado com sucesso com o ponto de entrega "Akarui - Rua da Fome, 144" deve ser criado vinculado ao mercado "Venda Direta para Grupo de Compras"

  @mercado @MER-04 @versaoNov2025 @criadoOut2025
  Cenário: Ver os detalhes de um mercado existente
    Dado que existe um mercado "Divino Alimento" cadastrado
    Quando eu solicito os detalhes do mercado "Divino Alimento"
    Então eu devo ver os detalhes do mercado "Divino Alimento"

  @mercado @MER-05 @versaoNov2025 @criadoOut2025
  Cenário: Atualizar os dados de um mercado tipo Cesta existente
    Dado que existe um mercado tipo Cesta "Grupo de Compras" cadastrado
    E exista um usuário cadastrado com nome "Manuel"
    E exista um usuário cadastrado com nome "Karen"
    Quando eu edito o nome do mercado "Grupo de Compras" para "Grupo de Consumidores"
    E edito o responsável de "Manuel" para "Karen"
    E edito a taxa administrativa de 1 para 2
    E edito o valor máximo do mercado de 30 para 50
    E salvo as alterações do mercado tipo Cesta
    Então o nome do mercado deve ser "Grupo de Consumidores", com responsável "Karen", com taxa administrativa 2, com valor máximo 50

  @mercado @MER-06 @versaoNov2025 @criadoOut2025
  Cenário: Atualizar os dados de um mercado tipo Lote existente
    Dado que existe um mercado tipo Lote "Quitandinha" cadastrado
    E exista um usuário cadastrado com nome "Manuel"
    E exista um usuário cadastrado com nome "Karen"
    Quando eu edito o nome do mercado "Quitandinha" para "Quitanda da Zezé"
    E edito o responsável de "Manuel" para "Karen"
    E edito a taxa administrativa de 1 para 2
    E salvo as alterações do mercado tipo Lote
    Então o nome do mercado deve ser "Quitanda da Zezé", com responsável "Karen", com taxa administrativa 2

 @mercado @MER-07 @versaoNov2025 @criadoOut2025
  Cenário: Atualizar os dados de um mercado tipo Venda Direta existente
    Dado que existe um mercado tipo Venda Direta "Venda Direta Grupo 1" cadastrado
    E exista um usuário cadastrado com nome "Manuel"
    E exista um usuário cadastrado com nome "Karen"
    Quando eu edito o nome do mercado "Venda Direta Grupo 1" para "Venda Direta do Domingo"
    E edito o responsável de "Manuel" para "Karen"
    E edito a taxa administrativa de 1 para 2
    E salvo as alterações do mercado tipo Venda Direta
    Então o nome do mercado deve ser "Venda Direta do Domingo", com responsável "Karen", com taxa administrativa 2

  @mercado @MER-08 @versaoNov2025 @criadoOut2025
  Cenário: Deletar um mercado existente
    Dado que existe um mercado "Divino Alimento" cadastrado
    E que não exista nenhum ciclo que seja composto pelo mercado "Divino Alimento"
    Quando eu deleto o mercado "Divino Alimento"
    Então o mercado "Divino Alimento" não deve mais existir no sistema

  @mercado @MER-09 @versaoNov2025 @criadoOut2025
  Cenário: Listar todos os mercados ativas de um mesmo responsável
    Dado que existem mercados "Mercado 01", "Mercado 02" e "Mercado 03" cadastrados
    E que todos tenham como administrador o usuário "Manuel"
    E todos os mercados estão com status "ativo"
    Quando eu solicito a lista de mercados ativos
    Então eu devo ver os mercados "Mercado 01", "Mercado 02" e "Mercado 03"

  @mercado @MER-10 @versaoNov2025 @criadoOut2025
  Cenário: Tentar criar um mercado sem nome
    Dado que eu quero criar um novo Mercado
    Quando eu tento salvar o novo mercado
    Então eu devo receber um erro de validação
