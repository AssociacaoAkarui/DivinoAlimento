import { describe, it } from "mocha";
import { expect } from "chai";
import {
  filterUsuariosBySearch,
  sortUsuariosByName,
  getActiveUsersCount,
  getInactiveUsersCount,
  getUsersByStatus,
  getUsersByPerfil,
  hasSearchResults,
} from "../../src/lib/usuarios-helpers";

describe("UC004: Listar Usuários - Helpers", () => {
  const usuarios = [
    { id: "1", nome: "Carlos Silva", email: "carlos@email.com", status: "ativo", perfis: ["admin"] },
    { id: "2", nome: "Ana Santos", email: "ana@email.com", status: "ativo", perfis: ["fornecedor"] },
    { id: "3", nome: "Bruno Costa", email: "bruno@email.com", status: "inativo", perfis: ["consumidor"] },
    { id: "4", nome: "Diana Oliveira", email: "diana@email.com", status: "ativo", perfis: ["admin", "fornecedor"] },
  ];

  describe("Funcionalidade: Filtrar usuários por busca", () => {
    context("Dado que tenho uma lista de usuários", () => {
      context("Quando busco por nome", () => {
        it("Então deve retornar usuários que contenham o termo no nome", () => {
          const resultado = filterUsuariosBySearch(usuarios, "ana");
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.map(u => u.nome)).to.include.members(["Ana Santos", "Diana Oliveira"]);
        });
      });

      context("Quando busco por email", () => {
        it("Então deve retornar usuários que contenham o termo no email", () => {
          const resultado = filterUsuariosBySearch(usuarios, "silva");
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal("Carlos Silva");
        });
      });

      context("Quando busco com termo vazio", () => {
        it("Então deve retornar todos os usuários", () => {
          const resultado = filterUsuariosBySearch(usuarios, "");
          expect(resultado).to.have.lengthOf(4);
        });
      });

      context("Quando busco por termo inexistente", () => {
        it("Então deve retornar lista vazia", () => {
          const resultado = filterUsuariosBySearch(usuarios, "xyz123");
          expect(resultado).to.have.lengthOf(0);
        });
      });

      context("Quando busco ignorando maiúsculas/minúsculas", () => {
        it("Então deve encontrar usuários independente do case", () => {
          const resultado = filterUsuariosBySearch(usuarios, "CARLOS");
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal("Carlos Silva");
        });
      });
    });
  });

  describe("Funcionalidade: Ordenar usuários por nome", () => {
    context("Dado que tenho uma lista desordenada", () => {
      context("Quando ordeno por nome", () => {
        it("Então deve retornar lista em ordem alfabética", () => {
          const resultado = sortUsuariosByName(usuarios);
          expect(resultado[0].nome).to.equal("Ana Santos");
          expect(resultado[1].nome).to.equal("Bruno Costa");
          expect(resultado[2].nome).to.equal("Carlos Silva");
          expect(resultado[3].nome).to.equal("Diana Oliveira");
        });
      });

      context("Quando ordeno lista vazia", () => {
        it("Então deve retornar lista vazia", () => {
          const resultado = sortUsuariosByName([]);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("Funcionalidade: Contar usuários ativos", () => {
    context("Dado que tenho usuários com diferentes status", () => {
      context("Quando conto usuários ativos", () => {
        it("Então deve retornar quantidade correta", () => {
          const count = getActiveUsersCount(usuarios);
          expect(count).to.equal(3);
        });
      });
    });

    context("Dado que não tenho usuários ativos", () => {
      context("Quando conto usuários ativos", () => {
        it("Então deve retornar zero", () => {
          const inativos = [{ id: "1", nome: "João", email: "joao@email.com", status: "inativo", perfis: [] }];
          const count = getActiveUsersCount(inativos);
          expect(count).to.equal(0);
        });
      });
    });
  });

  describe("Funcionalidade: Contar usuários inativos", () => {
    context("Dado que tenho usuários com diferentes status", () => {
      context("Quando conto usuários inativos", () => {
        it("Então deve retornar quantidade correta", () => {
          const count = getInactiveUsersCount(usuarios);
          expect(count).to.equal(1);
        });
      });
    });
  });

  describe("Funcionalidade: Filtrar usuários por status", () => {
    context("Dado que tenho usuários com diferentes status", () => {
      context("Quando filtro por status ativo", () => {
        it("Então deve retornar apenas usuários ativos", () => {
          const resultado = getUsersByStatus(usuarios, "ativo");
          expect(resultado).to.have.lengthOf(3);
          resultado.forEach(u => expect(u.status).to.equal("ativo"));
        });
      });

      context("Quando filtro por status inativo", () => {
        it("Então deve retornar apenas usuários inativos", () => {
          const resultado = getUsersByStatus(usuarios, "inativo");
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal("Bruno Costa");
        });
      });
    });
  });

  describe("Funcionalidade: Filtrar usuários por perfil", () => {
    context("Dado que tenho usuários com diferentes perfis", () => {
      context("Quando filtro por perfil admin", () => {
        it("Então deve retornar usuários que possuem perfil admin", () => {
          const resultado = getUsersByPerfil(usuarios, "admin");
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.map(u => u.nome)).to.include.members(["Carlos Silva", "Diana Oliveira"]);
        });
      });

      context("Quando filtro por perfil fornecedor", () => {
        it("Então deve retornar usuários que possuem perfil fornecedor", () => {
          const resultado = getUsersByPerfil(usuarios, "fornecedor");
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.map(u => u.nome)).to.include.members(["Ana Santos", "Diana Oliveira"]);
        });
      });

      context("Quando filtro por perfil inexistente", () => {
        it("Então deve retornar lista vazia", () => {
          const resultado = getUsersByPerfil(usuarios, "adminmercado");
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("Funcionalidade: Verificar se há resultados de busca", () => {
    context("Dado que tenho uma lista de usuários", () => {
      context("Quando busco por termo que existe", () => {
        it("Então deve retornar true", () => {
          const resultado = hasSearchResults(usuarios, "Carlos");
          expect(resultado).to.be.true;
        });
      });

      context("Quando busco por termo que não existe", () => {
        it("Então deve retornar false", () => {
          const resultado = hasSearchResults(usuarios, "xyz123");
          expect(resultado).to.be.false;
        });
      });

      context("Quando busco com termo vazio", () => {
        it("Então deve retornar true", () => {
          const resultado = hasSearchResults(usuarios, "");
          expect(resultado).to.be.true;
        });
      });
    });
  });
});
