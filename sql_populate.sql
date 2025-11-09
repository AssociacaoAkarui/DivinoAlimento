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
INSERT INTO "Usuarios" (id, nome, email, senha, perfis, status, "createdAt", "updatedAt")
SELECT 1, 'Admin Usuario', 'admin@example.com', 'admin123', ARRAY['admin'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 1);

INSERT INTO "Usuarios" (id, nome, email, senha, perfis, status, "createdAt", "updatedAt")
SELECT 2, 'Fornecedor Silva', 'fornecedor@example.com', 'fornecedor123', ARRAY['fornecedor'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 2);

INSERT INTO "Usuarios" (id, nome, email, senha, perfis, status, "createdAt", "updatedAt")
SELECT 3, 'João Consumidor', 'consumidor@example.com', 'consumidor123', ARRAY['consumidor'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 3);

INSERT INTO "Usuarios" (id, nome, email, senha, perfis, status, "createdAt", "updatedAt")
SELECT 4, 'Maria Multi', 'multi@example.com', 'multi123', ARRAY['admin','fornecedor'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 4);

INSERT INTO "Usuarios" (id, nome, email, senha, perfis, status, "createdAt", "updatedAt")
SELECT 5, 'Pedro Inativo', 'inativo@example.com', 'inativo123', ARRAY['consumidor'::"enum_Usuarios_perfis"], 'inativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 5);

INSERT INTO "Usuarios" (id, nome, email, senha, perfis, status, "createdAt", "updatedAt")
SELECT 6, 'Carlos Admin Mercado', 'adminmercado@example.com', 'adminmercado123', ARRAY['adminmercado'::"enum_Usuarios_perfis"], 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Usuarios" WHERE id = 6);
