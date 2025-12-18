# language: pt
Funcionalidade: Gerenciar Pagamentos
  Como administrador do sistema
  Quero gerenciar pagamentos de fornecedores e consumidores
  Para controlar as transações financeiras dos ciclos

  Contexto:
    Dado que existe um usuário administrador
    E que existe um ciclo cadastrado
    E que existe um mercado cadastrado
    E que existe um fornecedor cadastrado
    E que existe um consumidor cadastrado

  Cenário: Criar pagamento para fornecedor
    Quando eu criar um pagamento de tipo "fornecedor" com valor "500.00"
    Então o pagamento deve ser criado com sucesso
    E o status deve ser "pendente"
    E o tipo deve ser "fornecedor"

  Cenário: Criar pagamento para consumidor
    Quando eu criar um pagamento de tipo "consumidor" com valor "150.00"
    Então o pagamento deve ser criado com sucesso
    E o status deve ser "pendente"
    E o tipo deve ser "consumidor"

  Cenário: Listar todos os pagamentos
    Dado que existem 5 pagamentos cadastrados
    Quando eu listar todos os pagamentos
    Então devo receber 5 pagamentos

  Cenário: Filtrar pagamentos por tipo
    Dado que existem 3 pagamentos de fornecedor
    E que existem 2 pagamentos de consumidor
    Quando eu filtrar pagamentos por tipo "fornecedor"
    Então devo receber 3 pagamentos

  Cenário: Filtrar pagamentos por status
    Dado que existem 2 pagamentos pendentes
    E que existem 3 pagamentos pagos
    Quando eu filtrar pagamentos por status "pendente"
    Então devo receber 2 pagamentos

  Cenário: Filtrar pagamentos por ciclo
    Dado que existem 4 pagamentos do ciclo atual
    E que existem 2 pagamentos de outro ciclo
    Quando eu filtrar pagamentos por ciclo
    Então devo receber 4 pagamentos

  Cenário: Buscar pagamento por ID
    Dado que existe um pagamento cadastrado
    Quando eu buscar o pagamento por ID
    Então devo receber os dados do pagamento

  Cenário: Atualizar valor do pagamento
    Dado que existe um pagamento de "200.00"
    Quando eu atualizar o valor para "250.00"
    Então o pagamento deve ser atualizado com sucesso
    E o valor total do pagamento deve ser "250.00"

  Cenário: Marcar pagamento como pago
    Dado que existe um pagamento pendente
    Quando eu marcar o pagamento como pago
    Então o status deve ser "pago"
    E a data de pagamento deve ser preenchida

  Cenário: Cancelar pagamento
    Dado que existe um pagamento pendente
    Quando eu cancelar o pagamento
    Então o status deve ser "cancelado"

  Cenário: Deletar pagamento
    Dado que existe um pagamento cadastrado
    Quando eu deletar o pagamento
    Então o pagamento deve ser removido do sistema

  Cenário: Gerar pagamentos automaticamente por ciclo
    Dado que o ciclo está finalizado
    E que existem ofertas com valor total
    E que existem pedidos com valor total
    Quando eu gerar pagamentos para o ciclo
    Então os pagamentos para fornecedores devem ser criados
    E os pagamentos para consumidores devem ser criados

  Cenário: Calcular total por ciclo
    Dado que existem pagamentos de fornecedores no valor de "1000.00"
    E que existem pagamentos de consumidores no valor de "1500.00"
    Quando eu calcular o total do ciclo
    Então o total a receber deve ser "1000.00"
    E o total a pagar deve ser "1500.00"
    E o saldo deve ser "500.00"

  Cenário: Não permitir criar pagamento sem ciclo
    Quando eu tentar criar um pagamento sem ciclo
    Então deve retornar erro "O cicloId é obrigatório"

  Cenário: Não permitir criar pagamento sem mercado
    Quando eu tentar criar um pagamento sem mercado
    Então deve retornar erro "O mercadoId é obrigatório"

  Cenário: Não permitir criar pagamento sem usuário
    Quando eu tentar criar um pagamento sem usuário
    Então deve retornar erro "O usuarioId é obrigatório"

  Cenário: Não permitir valor total negativo
    Quando eu tentar criar um pagamento com valor "-100.00"
    Então deve retornar erro "O valorTotal deve ser maior ou igual a zero"
