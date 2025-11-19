import { describe, it } from "mocha";
import { expect } from "chai";
import {
  formatStatus,
  formatPerfil,
  formatPerfis,
  getStatusBadgeColor,
  getPerfilBadgeColor,
  formatListError,
  getEmptyListMessage,
  getLoadingMessage,
  getUsersCountMessage,
} from "../../src/lib/usuarios-formatters";

describe("UC004: Listar Usuários - Formatters", () => {
  describe("Funcionalidade: Formatar status", () => {
    context("Dado que tenho status em lowercase", () => {
      context("Quando formato status", () => {
        it("Então deve retornar status capitalizado", () => {
          expect(formatStatus("ativo")).to.equal("Ativo");
          expect(formatStatus("inativo")).to.equal("Inativo");
          expect(formatStatus("pendente")).to.equal("Pendente");
        });
      });
    });

    context("Dado que tenho status desconhecido", () => {
      context("Quando formato status", () => {
        it("Então deve retornar status original", () => {
          expect(formatStatus("outro")).to.equal("outro");
        });
      });
    });
  });

  describe("Funcionalidade: Formatar perfil individual", () => {
    context("Dado que tenho perfis conhecidos", () => {
      context("Quando formato perfil", () => {
        it("Então deve retornar nome formatado", () => {
          expect(formatPerfil("admin")).to.equal("Administrador");
          expect(formatPerfil("adminmercado")).to.equal("Administrador de Mercado");
          expect(formatPerfil("fornecedor")).to.equal("Fornecedor");
          expect(formatPerfil("consumidor")).to.equal("Consumidor");
        });
      });
    });

    context("Dado que tenho perfil desconhecido", () => {
      context("Quando formato perfil", () => {
        it("Então deve retornar perfil original", () => {
          expect(formatPerfil("outro")).to.equal("outro");
        });
      });
    });
  });

  describe("Funcionalidade: Formatar múltiplos perfis", () => {
    context("Dado que tenho array vazio", () => {
      context("Quando formato perfis", () => {
        it("Então deve retornar 'Nenhum perfil'", () => {
          expect(formatPerfis([])).to.equal("Nenhum perfil");
        });
      });
    });

    context("Dado que tenho um perfil", () => {
      context("Quando formato perfis", () => {
        it("Então deve retornar perfil formatado", () => {
          expect(formatPerfis(["admin"])).to.equal("Administrador");
        });
      });
    });

    context("Dado que tenho dois perfis", () => {
      context("Quando formato perfis", () => {
        it("Então deve retornar lista com 'e'", () => {
          expect(formatPerfis(["admin", "fornecedor"])).to.equal("Administrador e Fornecedor");
        });
      });
    });

    context("Dado que tenho três perfis", () => {
      context("Quando formato perfis", () => {
        it("Então deve retornar lista separada por vírgula", () => {
          expect(formatPerfis(["admin", "fornecedor", "consumidor"]))
            .to.equal("Administrador, Fornecedor e Consumidor");
        });
      });
    });
  });

  describe("Funcionalidade: Obter cor do badge de status", () => {
    context("Dado diferentes status", () => {
      context("Quando obtenho cor do badge", () => {
        it("Então deve retornar classes CSS corretas", () => {
          expect(getStatusBadgeColor("ativo")).to.equal("bg-green-100 text-green-800");
          expect(getStatusBadgeColor("inativo")).to.equal("bg-red-100 text-red-800");
          expect(getStatusBadgeColor("pendente")).to.equal("bg-yellow-100 text-yellow-800");
        });
      });
    });

    context("Dado status desconhecido", () => {
      context("Quando obtenho cor do badge", () => {
        it("Então deve retornar cor padrão cinza", () => {
          expect(getStatusBadgeColor("outro")).to.equal("bg-gray-100 text-gray-800");
        });
      });
    });
  });

  describe("Funcionalidade: Obter cor do badge de perfil", () => {
    context("Dado diferentes perfis", () => {
      context("Quando obtenho cor do badge", () => {
        it("Então deve retornar classes CSS corretas", () => {
          expect(getPerfilBadgeColor("admin")).to.equal("bg-red-100 text-red-800");
          expect(getPerfilBadgeColor("adminmercado")).to.equal("bg-orange-100 text-orange-800");
          expect(getPerfilBadgeColor("fornecedor")).to.equal("bg-green-100 text-green-800");
          expect(getPerfilBadgeColor("consumidor")).to.equal("bg-blue-100 text-blue-800");
        });
      });
    });
  });

  describe("Funcionalidade: Formatar erro de listagem", () => {
    context("Dado erro de não autorizado", () => {
      context("Quando formato erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("Unauthorized");
          expect(formatListError(error)).to.equal("Você não tem permissão para visualizar a lista de usuários.");
        });
      });
    });

    context("Dado erro de admin required", () => {
      context("Quando formato erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("Admin required");
          expect(formatListError(error)).to.equal("Apenas administradores podem visualizar a lista de usuários.");
        });
      });
    });

    context("Dado erro de rede", () => {
      context("Quando formato erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("Network error");
          expect(formatListError(error)).to.equal("Erro de conexão. Verifique sua internet e tente novamente.");
        });
      });
    });

    context("Dado erro genérico", () => {
      context("Quando formato erro", () => {
        it("Então deve retornar mensagem padrão", () => {
          const error = new Error("Unknown error");
          expect(formatListError(error)).to.equal("Erro ao carregar lista de usuários. Por favor, tente novamente.");
        });
      });
    });
  });

  describe("Funcionalidade: Obter mensagem de lista vazia", () => {
    context("Dado que tenho termo de busca", () => {
      context("Quando obtenho mensagem de lista vazia", () => {
        it("Então deve incluir termo de busca", () => {
          expect(getEmptyListMessage("João")).to.equal('Nenhum usuário encontrado para "João"');
        });
      });
    });

    context("Dado que não tenho termo de busca", () => {
      context("Quando obtenho mensagem de lista vazia", () => {
        it("Então deve retornar mensagem genérica", () => {
          expect(getEmptyListMessage("")).to.equal("Nenhum usuário cadastrado");
        });
      });
    });
  });

  describe("Funcionalidade: Obter mensagem de carregamento", () => {
    context("Quando obtenho mensagem de carregamento", () => {
      it("Então deve retornar texto apropriado", () => {
        expect(getLoadingMessage()).to.equal("Carregando usuários...");
      });
    });
  });

  describe("Funcionalidade: Obter mensagem de contagem de usuários", () => {
    context("Dado que não tenho usuários", () => {
      context("Quando obtenho mensagem de contagem", () => {
        it("Então deve retornar 'Nenhum usuário'", () => {
          expect(getUsersCountMessage(0)).to.equal("Nenhum usuário");
        });
      });
    });

    context("Dado que tenho um usuário", () => {
      context("Quando obtenho mensagem de contagem", () => {
        it("Então deve retornar '1 usuário' no singular", () => {
          expect(getUsersCountMessage(1)).to.equal("1 usuário");
        });
      });
    });

    context("Dado que tenho múltiplos usuários", () => {
      context("Quando obtenho mensagem de contagem", () => {
        it("Então deve retornar contagem no plural", () => {
          expect(getUsersCountMessage(5)).to.equal("5 usuários");
          expect(getUsersCountMessage(10)).to.equal("10 usuários");
        });
      });
    });
  });
});
