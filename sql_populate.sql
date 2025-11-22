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

-- UC008: Produtos (alimentos)
INSERT INTO "Produtos" (id, nome, "categoriaId", status, "createdAt", "updatedAt")
SELECT 1, 'Banana Prata', 1, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Produtos" WHERE id = 1);

INSERT INTO "Produtos" (id, nome, "categoriaId", status, "createdAt", "updatedAt")
SELECT 2, 'Maçã Fuji', 1, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Produtos" WHERE id = 2);

INSERT INTO "Produtos" (id, nome, "categoriaId", status, "createdAt", "updatedAt")
SELECT 3, 'Alface Crespa', 2, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Produtos" WHERE id = 3);

INSERT INTO "Produtos" (id, nome, "categoriaId", status, "createdAt", "updatedAt")
SELECT 4, 'Couve Manteiga', 2, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Produtos" WHERE id = 4);

INSERT INTO "Produtos" (id, nome, "categoriaId", status, "createdAt", "updatedAt")
SELECT 5, 'Laranja Pera', 1, 'inativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Produtos" WHERE id = 5);

-- UC009: ProdutoComercializavels (productos comercializables)
INSERT INTO "ProdutoComercializavels" (id, "produtoId", medida, "pesoKg", "precoBase", status, "createdAt", "updatedAt")
SELECT 1, 1, 'kg', 1.0, 8.50, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "ProdutoComercializavels" WHERE id = 1);

INSERT INTO "ProdutoComercializavels" (id, "produtoId", medida, "pesoKg", "precoBase", status, "createdAt", "updatedAt")
SELECT 2, 1, 'cacho', 0.5, 4.50, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "ProdutoComercializavels" WHERE id = 2);

INSERT INTO "ProdutoComercializavels" (id, "produtoId", medida, "pesoKg", "precoBase", status, "createdAt", "updatedAt")
SELECT 3, 2, 'kg', 1.0, 12.00, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "ProdutoComercializavels" WHERE id = 3);

INSERT INTO "ProdutoComercializavels" (id, "produtoId", medida, "pesoKg", "precoBase", status, "createdAt", "updatedAt")
SELECT 4, 3, 'unidade', 0.3, 3.50, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "ProdutoComercializavels" WHERE id = 4);

INSERT INTO "ProdutoComercializavels" (id, "produtoId", medida, "pesoKg", "precoBase", status, "createdAt", "updatedAt")
SELECT 5, 4, 'maço', 0.4, 5.00, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "ProdutoComercializavels" WHERE id = 5);

INSERT INTO "ProdutoComercializavels" (id, "produtoId", medida, "pesoKg", "precoBase", status, "createdAt", "updatedAt")
SELECT 6, 5, 'kg', 1.0, 6.00, 'inativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "ProdutoComercializavels" WHERE id = 6);

-- UC010: SubmissaoProdutos (submissões de produtos de fornecedores)
INSERT INTO "SubmissaoProdutos" (id, "fornecedorId", "nomeProduto", descricao, "imagemUrl", "precoUnidade", medida, status, "motivoReprovacao", "createdAt", "updatedAt")
SELECT 1, 2, 'Tomate Orgânico', 'Tomate orgânico cultivado sem agrotóxicos', '/placeholder.svg', 4.50, 'kg', 'pendente', NULL, CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "SubmissaoProdutos" WHERE id = 1);

INSERT INTO "SubmissaoProdutos" (id, "fornecedorId", "nomeProduto", descricao, "imagemUrl", "precoUnidade", medida, status, "motivoReprovacao", "createdAt", "updatedAt")
SELECT 2, 2, 'Alface Americana', 'Alface fresca colhida diariamente', '/placeholder.svg', 3.00, 'unidade', 'pendente', NULL, CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "SubmissaoProdutos" WHERE id = 2);

INSERT INTO "SubmissaoProdutos" (id, "fornecedorId", "nomeProduto", descricao, "imagemUrl", "precoUnidade", medida, status, "motivoReprovacao", "createdAt", "updatedAt")
SELECT 3, 2, 'Cenoura Baby', 'Cenouras pequenas e doces', '/placeholder.svg', 8.00, 'kg', 'aprovado', NULL, CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "SubmissaoProdutos" WHERE id = 3);

INSERT INTO "SubmissaoProdutos" (id, "fornecedorId", "nomeProduto", descricao, "imagemUrl", "precoUnidade", medida, status, "motivoReprovacao", "createdAt", "updatedAt")
SELECT 4, 2, 'Pepino Japonês', 'Pepino com sabor suave', '/placeholder.svg', 6.00, 'kg', 'reprovado', 'Produto fora dos padrões de qualidade', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "SubmissaoProdutos" WHERE id = 4);

-- UC005: Mercados (mercados com pontos de entrega)
INSERT INTO "Mercados" (id, nome, tipo, "responsavelId", "taxaAdministrativa", "valorMaximoCesta", status, "createdAt", "updatedAt")
SELECT 1, 'Mercado Central', 'cesta', 1, 5.00, 150.00, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Mercados" WHERE id = 1);

INSERT INTO "Mercados" (id, nome, tipo, "responsavelId", "taxaAdministrativa", "valorMaximoCesta", status, "createdAt", "updatedAt")
SELECT 2, 'Feira Livre', 'venda_direta', 6, NULL, NULL, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Mercados" WHERE id = 2);

INSERT INTO "Mercados" (id, nome, tipo, "responsavelId", "taxaAdministrativa", "valorMaximoCesta", status, "createdAt", "updatedAt")
SELECT 3, 'Mercado Zona Sul', 'lote', 1, 3.50, NULL, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Mercados" WHERE id = 3);

-- UC012: PontoEntregas (pontos de entrega vinculados a mercados)
INSERT INTO "PontoEntregas" (id, nome, endereco, bairro, cidade, estado, cep, "mercadoId", status, "createdAt", "updatedAt")
SELECT 1, 'Centro Comunitario Centro', 'Rua das Flores, 100', 'Centro', 'Sao Paulo', 'SP', '01000-000', 1, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "PontoEntregas" WHERE id = 1);

INSERT INTO "PontoEntregas" (id, nome, endereco, bairro, cidade, estado, cep, "mercadoId", status, "createdAt", "updatedAt")
SELECT 2, 'Associacao Zona Norte', 'Av. Brasil, 500', 'Santana', 'Sao Paulo', 'SP', '02000-000', 1, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "PontoEntregas" WHERE id = 2);

INSERT INTO "PontoEntregas" (id, nome, endereco, bairro, cidade, estado, cep, "mercadoId", status, "createdAt", "updatedAt")
SELECT 3, 'Feira Livre Zona Sul', 'Praca da Arvore, 50', 'Saude', 'Sao Paulo', 'SP', '04000-000', 2, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "PontoEntregas" WHERE id = 3);

INSERT INTO "PontoEntregas" (id, nome, endereco, bairro, cidade, estado, cep, "mercadoId", status, "createdAt", "updatedAt")
SELECT 4, 'Ponto Entrega Zona Oeste', 'Rua Cardeal Arcoverde, 200', 'Pinheiros', 'Sao Paulo', 'SP', '05407-000', 3, 'ativo', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "PontoEntregas" WHERE id = 4);

-- UC010: Ciclos (ciclos de comercializacao)
INSERT INTO "Ciclos" (id, nome, "ofertaInicio", "ofertaFim", "pontoEntregaId", "itensAdicionaisInicio", "itensAdicionaisFim", "retiradaConsumidorInicio", "retiradaConsumidorFim", observacao, status, "createdAt", "updatedAt")
SELECT 1, '1o Ciclo de Novembro 2025', '2025-11-01 08:00:00', '2025-11-15 18:00:00', 1, '2025-11-05 08:00:00', '2025-11-10 18:00:00', '2025-11-16 08:00:00', '2025-11-17 18:00:00', 'Primeiro ciclo de novembro', 'oferta', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Ciclos" WHERE id = 1);

INSERT INTO "Ciclos" (id, nome, "ofertaInicio", "ofertaFim", "pontoEntregaId", "itensAdicionaisInicio", "itensAdicionaisFim", "retiradaConsumidorInicio", "retiradaConsumidorFim", observacao, status, "createdAt", "updatedAt")
SELECT 2, '2o Ciclo de Novembro 2025', '2025-11-16 08:00:00', '2025-11-30 18:00:00', 2, '2025-11-20 08:00:00', '2025-11-25 18:00:00', '2025-12-01 08:00:00', '2025-12-02 18:00:00', 'Segundo ciclo de novembro', 'oferta', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Ciclos" WHERE id = 2);

INSERT INTO "Ciclos" (id, nome, "ofertaInicio", "ofertaFim", "pontoEntregaId", observacao, status, "createdAt", "updatedAt")
SELECT 3, 'Ciclo de Outubro 2025', '2025-10-01 08:00:00', '2025-10-15 18:00:00', 1, 'Ciclo finalizado de outubro', 'finalizado', CURRENT_DATE, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM "Ciclos" WHERE id = 3);
