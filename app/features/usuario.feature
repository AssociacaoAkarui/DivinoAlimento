# language: pt
Funcionalidade: Gestão de Usuários

  @usuario @USR-01
  Cenário: Criar um novo usuário com sucesso
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

  @usuario @USR-02
  Cenário: Ver os detalhes de um usuário existente
    Dado que existe um usuário "Maria Santos" cadastrado
    Quando eu solicito os detalhes do usuário "Maria Santos"
    Então eu devo ver os detalhes do usuário "Maria Santos"

  @usuario @USR-03
  Cenário: Atualizar um usuário existente
    Dado que existe um usuário "Pedro Costa"
    Quando eu edito o nome do usuário para "Pedro Costa Junior"
    E eu edito o nome fantasia do usuário para "Venda do Sr. Pedro"
    E eu edito o celular para "11999888777"
    E eu edito as informações para pagamento para "pix: email@email.com"
    E eu edito o email para "novoemail@email.com"
    E eu edito o a política de privacidade para "cientepolitica"
    E eu edito o perfil do usuário para "{fornecedor,consumidor}"
    E eu edito o status do usuário para "inativo"
    E salvo as alterações do usuário
    Então o nome do usuário deve ser "Pedro Costa Junior"
    Então o nome fantasia do usuário deve ser "Venda do Sr. Pedro"
    Então o celular do usuário deve ser "11999888777"
    Então as informações para pagamento do usuário deve ser "pix: email@email.com"
    Então o email do usuário deve ser "novoemail@email.com"
    Então a políica de privacidade do usuário deve ser "cientepolitica"
    Então o perfil do usuário deve ser "{fornecedor,consumidor}"
    Então o status do usuário deve ser "inativo"

  @usuario @USR-04
  Cenário: Deletar um usuário existente
    Dado que existe um usuário "Usuário Teste"
    E que não existam ofertas ou pedidos associados ao usuário "Usuário Teste"
    E que o "Usuário Teste" não seja o único usuário com perfil "admin"
    E que o "Usuário Teste" não seja o usuário logado
    Quando eu deleto o usuário "Usuário Teste"
    Então o usuário "Usuário Teste" não deve mais existir no sistema

  @usuario @USR-05
  Cenário: Acesso ao sistema do primeiro usuário
    Dado quero fazer login no sistema
    E estou logado no AUTH
    E que não exista nenhum usuário cadastrado
    Quando eu preencho o nome do usuário com "Admin Sistema"
    E o email com "admin@sistema.com"
    E o perfil como "{consumidor}"
    Quando eu salvo o novo usuário
    Então o usuário "Admin Sistema" deve ser criado com sucesso
    E deve ter perfil de "{consumidor,admin}"

  @usuario @USR-06
  Cenário: Acesso ao sistema quando este já possui pelo menos um usuário admin
    Dado quero fazer login no sistema
    E estou logado no AUTH
    E que o usuário AUTH não exista cadastrado no sistema
    Quando eu preencho o nome do usuário com "Novo Usuário"
    E o email com "novousuarion@sistema.com"
    E o perfil como "{consumidor}"
    Quando eu salvo o novo usuário
    Então o usuário "Novo Usuário" deve ser criado com sucesso
    E deve ter perfil de "{consumidor}"

  @usuario @USR-07
  Cenário: Acesso ao sistema por usuário já cadastrado
    Dado quero fazer login no sistema
    E estou logado no AUTH
    E que o usuário AUTH exista cadastrado no sistema
    Quando eu clico em logar
    Então o sistema retorna os dados do usuário
