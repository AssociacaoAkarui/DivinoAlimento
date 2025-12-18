import { describe, it } from "mocha";
import { expect } from "chai";
import {
  formatUpdateError,
  getUpdateSuccessMessage,
  formatBanco,
  formatSituacao,
  formatPerfil,
  formatPerfis,
  getPerfilBadgeColor,
  formatCelular,
  formatChavePix,
  formatConta,
  getValidationErrorMessage,
  formatValidationErrors,
  getSaveButtonText,
  getCancelButtonText,
} from "../../src/lib/usuario-dados-formatters";

describe("usuario-dados-formatters", () => {
  describe("formatUpdateError", () => {
    context("Dado erro de usuário não encontrado", () => {
      context("Quando formatar erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("User not found");
          expect(formatUpdateError(error)).to.equal("Usuário não encontrado. Por favor, tente novamente.");
        });
      });
    });

    context("Dado erro de não autorizado", () => {
      context("Quando formatar erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("Unauthorized");
          expect(formatUpdateError(error)).to.equal("Você não tem permissão para atualizar estes dados.");
        });
      });
    });

    context("Dado erro de admin required", () => {
      context("Quando formatar erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("Admin required");
          expect(formatUpdateError(error)).to.equal("Apenas administradores podem realizar esta ação.");
        });
      });
    });

    context("Dado erro de rede", () => {
      context("Quando formatar erro", () => {
        it("Então deve retornar mensagem apropriada", () => {
          const error = new Error("Network error");
          expect(formatUpdateError(error)).to.equal("Erro de conexão. Verifique sua internet e tente novamente.");
        });
      });
    });

    context("Dado erro genérico", () => {
      context("Quando formatar erro", () => {
        it("Então deve retornar mensagem padrão", () => {
          const error = new Error("Unknown error");
          expect(formatUpdateError(error)).to.equal("Erro ao atualizar dados. Por favor, tente novamente.");
        });
      });
    });
  });

  describe("getUpdateSuccessMessage", () => {
    context("Dado nome do usuário", () => {
      context("Quando obter mensagem de sucesso", () => {
        it("Então deve incluir nome no mensagem", () => {
          expect(getUpdateSuccessMessage("João Silva")).to.equal("Dados de João Silva atualizados com sucesso!");
        });
      });
    });
  });

  describe("formatBanco", () => {
    context("Dado nomes de bancos conhecidos", () => {
      context("Quando formatar banco", () => {
        it("Então deve retornar nomes formatados", () => {
          expect(formatBanco("itau")).to.equal("Itaú");
          expect(formatBanco("nubank")).to.equal("Nubank");
          expect(formatBanco("caixa")).to.equal("Caixa Econômica Federal");
        });
      });
    });

    context("Dado banco desconhecido", () => {
      context("Quando formatar banco", () => {
        it("Então deve retornar nome original", () => {
          expect(formatBanco("Outro Banco")).to.equal("Outro Banco");
        });
      });
    });
  });

  describe("formatSituacao", () => {
    context("Dado status em lowercase", () => {
      context("Quando formatar situação", () => {
        it("Então deve retornar capitalizado", () => {
          expect(formatSituacao("ativo")).to.equal("Ativo");
          expect(formatSituacao("inativo")).to.equal("Inativo");
          expect(formatSituacao("pendente")).to.equal("Pendente");
        });
      });
    });
  });

  describe("formatPerfil", () => {
    context("Dado perfis conhecidos", () => {
      context("Quando formatar perfil", () => {
        it("Então deve retornar nomes formatados", () => {
          expect(formatPerfil("admin")).to.equal("Administrador");
          expect(formatPerfil("adminmercado")).to.equal("Administrador de Mercado");
          expect(formatPerfil("fornecedor")).to.equal("Fornecedor");
          expect(formatPerfil("consumidor")).to.equal("Consumidor");
        });
      });
    });
  });

  describe("formatPerfis", () => {
    context("Dado array vazio", () => {
      context("Quando formatar perfis", () => {
        it("Então deve retornar 'Nenhum perfil'", () => {
          expect(formatPerfis([])).to.equal("Nenhum perfil");
        });
      });
    });

    context("Dado um perfil", () => {
      context("Quando formatar perfis", () => {
        it("Então deve retornar perfil formatado", () => {
          expect(formatPerfis(["admin"])).to.equal("Administrador");
        });
      });
    });

    context("Dado múltiplos perfis", () => {
      context("Quando formatar perfis", () => {
        it("Então deve retornar lista formatada", () => {
          expect(formatPerfis(["admin", "fornecedor"])).to.equal("Administrador e Fornecedor");
          expect(formatPerfis(["admin", "fornecedor", "consumidor"])).to.equal("Administrador, Fornecedor e Consumidor");
        });
      });
    });
  });

  describe("getPerfilBadgeColor", () => {
    context("Dado diferentes perfis", () => {
      context("Quando obter cor do badge", () => {
        it("Então deve retornar cores corretas", () => {
          expect(getPerfilBadgeColor("admin")).to.equal("bg-red-100 text-red-800");
          expect(getPerfilBadgeColor("adminmercado")).to.equal("bg-orange-100 text-orange-800");
          expect(getPerfilBadgeColor("fornecedor")).to.equal("bg-green-100 text-green-800");
          expect(getPerfilBadgeColor("consumidor")).to.equal("bg-blue-100 text-blue-800");
          expect(getPerfilBadgeColor("unknown")).to.equal("bg-gray-100 text-gray-800");
        });
      });
    });
  });

  describe("formatCelular", () => {
    context("Dado celular com 11 dígitos", () => {
      context("Quando formatar celular", () => {
        it("Então deve aplicar máscara (XX) XXXXX-XXXX", () => {
          expect(formatCelular("11987654321")).to.equal("(11) 98765-4321");
        });
      });
    });

    context("Dado celular com 10 dígitos", () => {
      context("Quando formatar celular", () => {
        it("Então deve aplicar máscara (XX) XXXX-XXXX", () => {
          expect(formatCelular("1134567890")).to.equal("(11) 3456-7890");
        });
      });
    });

    context("Dado celular com formatação diferente", () => {
      context("Quando formatar celular", () => {
        it("Então deve retornar valor original", () => {
          expect(formatCelular("123")).to.equal("123");
        });
      });
    });
  });

  describe("formatChavePix", () => {
    context("Dado CPF como chave PIX", () => {
      context("Quando formatar chave PIX", () => {
        it("Então deve aplicar máscara de CPF", () => {
          expect(formatChavePix("12345678900")).to.equal("123.456.789-00");
        });
      });
    });

    context("Dado CNPJ como chave PIX", () => {
      context("Quando formatar chave PIX", () => {
        it("Então deve aplicar máscara de CNPJ", () => {
          expect(formatChavePix("12345678000199")).to.equal("12.345.678/0001-99");
        });
      });
    });

    context("Dado email como chave PIX", () => {
      context("Quando formatar chave PIX", () => {
        it("Então deve retornar valor original", () => {
          expect(formatChavePix("joao@email.com")).to.equal("joao@email.com");
        });
      });
    });
  });

  describe("formatConta", () => {
    context("Dado número de conta", () => {
      context("Quando formatar conta", () => {
        it("Então deve separar dígito verificador", () => {
          expect(formatConta("567890")).to.equal("56789-0");
        });
      });
    });
  });

  describe("getValidationErrorMessage", () => {
    context("Dado campos conhecidos", () => {
      context("Quando obter mensagem de erro", () => {
        it("Então deve retornar mensagens específicas", () => {
          expect(getValidationErrorMessage("nomeCompleto")).to.equal("Nome completo é obrigatório");
          expect(getValidationErrorMessage("celular")).to.equal("Celular inválido. Use o formato (11) 95555-9999");
          expect(getValidationErrorMessage("banco")).to.equal("Banco é obrigatório");
        });
      });
    });

    context("Dado campo desconhecido", () => {
      context("Quando obter mensagem de erro", () => {
        it("Então deve retornar mensagem padrão", () => {
          expect(getValidationErrorMessage("unknown")).to.equal("Campo inválido");
        });
      });
    });
  });

  describe("formatValidationErrors", () => {
    context("Dado nenhum erro", () => {
      context("Quando formatar erros", () => {
        it("Então deve retornar string vazia", () => {
          expect(formatValidationErrors({})).to.equal("");
        });
      });
    });

    context("Dado um erro", () => {
      context("Quando formatar erros", () => {
        it("Então deve retornar a mensagem do erro", () => {
          expect(formatValidationErrors({ nome: "Nome inválido" })).to.equal("Nome inválido");
        });
      });
    });

    context("Dado múltiplos erros", () => {
      context("Quando formatar erros", () => {
        it("Então deve retornar contador de erros", () => {
          const errors = { nome: "erro1", email: "erro2" };
          expect(formatValidationErrors(errors)).to.equal("2 erros encontrados. Por favor, corrija-os.");
        });
      });
    });
  });

  describe("getSaveButtonText", () => {
    context("Dado estado de loading", () => {
      context("Quando obter texto do botão", () => {
        it("Então deve retornar 'Salvando...'", () => {
          expect(getSaveButtonText(true)).to.equal("Salvando...");
        });
      });
    });

    context("Dado estado normal", () => {
      context("Quando obter texto do botão", () => {
        it("Então deve retornar 'Salvar'", () => {
          expect(getSaveButtonText(false)).to.equal("Salvar");
        });
      });
    });
  });

  describe("getCancelButtonText", () => {
    context("Quando obter texto do botão cancelar", () => {
      it("Então deve retornar 'Cancelar'", () => {
        expect(getCancelButtonText()).to.equal("Cancelar");
      });
    });
  });
});
