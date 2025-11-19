-- Categorias de productos (solo insertar si no existen)
INSERT INTO "CategoriaProdutos" (id, nome, status, "createdAt", "updatedAt")
SELECT 1, 'fruta', 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "CategoriaProdutos" WHERE id = 1);

INSERT INTO "CategoriaProdutos" (id, nome, status, "createdAt", "updatedAt")
SELECT 2, 'verduras', 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "CategoriaProdutos" WHERE id = 2);

-- Caso já tenha sido criado alguma cesta e tentado rodar a composição, deve-se limpar as tabelas que foram populadas pelo sistema nestes processos, tabelas CicloCestas e Cesta. Deve-se apagar também os ciclos criados e ofertas e incluí-los novamente depois.

delete from "CicloCestas";

delete from "Cesta";

delete from "Ciclos";

delete from "Oferta";

-- Inserir cestas padrões, necessárias para emissão dos relatórios específicos (relatórios existentes não possuem tela de seleção de cestas e estão fixos para estas cestas)

INSERT INTO "Cesta" (id, nome, valormaximo, status, "createdAt", "updatedAt")
SELECT 2, 'Divino Alimento', 20, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Cesta" WHERE id = 2);

INSERT INTO "Cesta" (id, nome, valormaximo, status, "createdAt", "updatedAt")
SELECT 4, 'Vila São Vicente de Paulo', 30, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Cesta" WHERE id = 4);

INSERT INTO "Cesta" (id, nome, valormaximo, status, "createdAt", "updatedAt")
SELECT 7, 'Grupo de Compras SLP', 31.5, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Cesta" WHERE id = 7);

-- Usuarios con diferentes perfiles (solo insertar si no existen)
INSERT INTO "Usuarios" (id, nome, nomeoficial, celular, banco, agencia, conta, "chavePix", email, cientepolitica, senha, perfis, status, "createdAt", "updatedAt")
SELECT 1, 'Admin Usuario', 'Admin', '11999999999', 'Itaú', '1234', '12345-6', 'admin@example.com', 'admin@example.com', 'sim', 'admin123', ARRAY['admin'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 1);

INSERT INTO "Usuarios" (id, nome, nomeoficial, celular, banco, agencia, conta, "chavePix", email, cientepolitica, senha, perfis, status, "createdAt", "updatedAt")
SELECT 2, 'Fornecedor Silva', 'Silva Orgânicos', '11988888888', 'Bradesco', '5678', '98765-4', '11988888888', 'fornecedor@example.com', 'sim', 'fornecedor123', ARRAY['fornecedor'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 2);

INSERT INTO "Usuarios" (id, nome, nomeoficial, celular, banco, agencia, conta, "chavePix", email, cientepolitica, senha, perfis, status, "createdAt", "updatedAt")
SELECT 3, 'João Consumidor', 'João', '11977777777', 'Nubank', '0001', '11111-1', 'consumidor@example.com', 'consumidor@example.com', 'sim', 'consumidor123', ARRAY['consumidor'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 3);

INSERT INTO "Usuarios" (id, nome, nomeoficial, celular, banco, agencia, conta, "chavePix", email, cientepolitica, senha, perfis, status, "createdAt", "updatedAt")
SELECT 4, 'Maria Multi', 'Maria Produtos', '11966666666', 'Santander', '4321', '54321-0', '12345678901', 'multi@example.com', 'sim', 'multi123', ARRAY['admin','fornecedor'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 4);

INSERT INTO "Usuarios" (id, nome, nomeoficial, celular, banco, agencia, conta, "chavePix", email, cientepolitica, senha, perfis, status, "createdAt", "updatedAt")
SELECT 5, 'Pedro Inativo', 'Pedro', '11955555555', 'Caixa', '9876', '66666-6', 'inativo@example.com', 'inativo@example.com', 'sim', 'inativo123', ARRAY['consumidor'::"enum_Usuarios_perfis"], 'inativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 5);

INSERT INTO "Usuarios" (id, nome, nomeoficial, celular, banco, agencia, conta, "chavePix", email, cientepolitica, senha, perfis, status, "createdAt", "updatedAt")
SELECT 6, 'Carlos Admin Mercado', 'Carlos Mercado', '11944444444', 'Banco do Brasil', '1111', '22222-2', 'adminmercado@example.com', 'adminmercado@example.com', 'sim', 'adminmercado123', ARRAY['adminmercado'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 6);
