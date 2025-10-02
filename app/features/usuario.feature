# language: pt
Funcionalidade: Gestão de Usuários

  Cenário: USR-01 Criar um novo usuário com sucesso
    Dado que eu quero criar um novo usuário
    Quando eu preencho o nome do usuário com "João da Silva Santos"
    E o nome fantasia do usuário com "João Silva"
    E o celular do usuário com "11999887766"
    E as informações para pagamento do usuário com "pix: 11999887766"
    E o email do usuário com "joao.silva@email.com"
    E a política de privacidade do usuário com "cientepolitica"
    E o perfil do usuário como "{consumidor}"
    E o status do usuário como "ativo"
    Quando eu salvo o novo usuário
    Então o usuário "João da Silva Santos" deve ser criado com sucesso

  Cenário: USR-02 Ver os detalhes de um usuário existente
    Dado que existe um usuário "Maria Santos" cadastrado
    Quando eu solicito os detalhes do usuário "Maria Santos"
    Então eu devo ver os detalhes do usuário "Maria Santos"

  Cenário: USR-03 Atualizar o nome de um usuário existente
    Dado que existe um usuário "Pedro Costa"
    Quando eu edito o nome do usuário para "Pedro Costa Junior"
    E salvo as alterações do usuário
    Então o nome do usuário deve ser "Pedro Costa Junior"

  Cenário: USR-04 Atualizar o nome fantasia de um usuário existente
    Dado que existe um usuário "Sr.Pedro"
    Quando eu edito o nome do usuário para "Venda do Sr. Pedro"
    E salvo as alterações do usuário
    Então o nome do usuário deve ser "Venda do Sr. Pedro"

  Cenário: USR-05 Atualizar o celular de um usuário existente
    Dado que existe um usuário com celular "11988776655"
    Quando eu edito o celular para "11999888777"
    E salvo as alterações do usuário
    Então o celular do usuário deve ser "11999888777"

  Cenário: USR-06 Atualizar as informações para pagamento de um usuário existente
    Dado que existe um usuário com informações para pagamento "pix: 11999887766"
    Quando eu edito as informações para pagamento para "pix: email@email.com"
    E salvo as alterações do usuário
    Então as informações para pagamento do usuário deve ser "pix: email@email.com"

  Cenário: USR-07 Atualizar o email de um usuário existente
    Dado que existe um usuário com email "email@email.com"
    Quando eu edito o email para "novoemail@email.com"
    E salvo as alterações do usuário
    Então o email do usuário deve ser "novoemail@email.com"

  Cenário: USR-08 Atualizar a política de privacidade de um usuário existente
    Dado que existe um usuário com política de privacidade ""
    Quando eu edito o a política de privacidade para "cientepolitica"
    E salvo as alterações do usuário
    Então a políica de privacidade do usuário deve ser "cientepolitica"

  Cenário: USR-09 Atualizar o perfil de um usuário existente
    Dado que existe um usuário com perfil "{consumidor}"
    Quando eu edito o perfil do usuário para "{fornecedor,consumidor}"
    E salvo as alterações do usuário
    Então o perfil do usuário deve ser "{fornecedor,consumidor}"

  Cenário: USR-10 Atualizar o status de um usuário existente
    Dado que existe um usuário com status "ativo"
    Quando eu edito o status do usuário para "inativo"
    E salvo as alterações do usuário
    Então o status do usuário deve ser "inativo"

  Cenário: USR-11 Deletar um usuário existente
    Dado que existe um usuário "Usuário Teste"
    E que não existam ofertas ou pedidos associados ao usuário "Usuário Teste"
    E que o "Usuário Teste" não seja o único usuário com perfil "admin"
    E que o "Usuário Teste" não seja o usuário logado
    Quando eu deleto o usuário "Usuário Teste"
    Então o usuário "Usuário Teste" não deve mais existir no sistema

  Cenário: USR-12 Acesso ao sistema do primeiro usuário
    Dado quero fazer login no sistema
    E estou logado no AUTH
    E que não exista nenhum usuário cadastrado
    Quando eu preencho o nome do usuário com "Admin Sistema"
    E o email com "admin@sistema.com"
    E o perfil como "{consumidor}"
    Quando eu salvo o novo usuário
    Então o usuário "Admin Sistema" deve ser criado com sucesso
    E deve ter perfil de "{consumidor,admin}"
