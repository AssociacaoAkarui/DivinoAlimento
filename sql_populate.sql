INSERT INTO "Usuarios" (nome, email, status, perfil, "createdAt", "updatedAt")VALUES ('admin', 'email@email.email', 'ativo', '{admin}', now(), now());

insert into "CategoriaProdutos" (id,nome,status,"createdAt", "updatedAt") values (1, 'fruta', 'ativo', CURRENT_DATE, CURRENT_DATE);

insert into "CategoriaProdutos" (id,nome,status,"createdAt", "updatedAt") values (2, 'verduras', 'ativo', CURRENT_DATE, CURRENT_DATE);

-- Caso já tenha sido criado alguma cesta e tentado rodar a composição, deve-se limpar as tabelas que foram populadas pelo sistema nestes processos, tabelas CicloCestas e Cesta. Deve-se apagar também os ciclos criados e ofertas e incluí-los novamente depois.

delete from "CicloCestas";

delete from "Cesta";

delete from "Ciclos"; 

delete from "Oferta";

-- Inserir cestas padrões, necessárias para emissão dos relatórios específicos (relatórios existentes não possuem tela de seleção de cestas e estão fixos para estas cestas)

insert into "Cesta" (id, nome, valormaximo, status,"createdAt", "updatedAt") values (2, 'Divino Alimento', 20, 'ativo',CURRENT_DATE, CURRENT_DATE);

insert into "Cesta" (id, nome, valormaximo, status,"createdAt", "updatedAt") values (4, 'Vila São Vicente de Paulo', 30, 'ativo',CURRENT_DATE, CURRENT_DATE);

insert into "Cesta" (id, nome, valormaximo, status,"createdAt", "updatedAt") values (7, 'Grupo de Compras SLP', 31.5, 'ativo',CURRENT_DATE, CURRENT_DATE);
