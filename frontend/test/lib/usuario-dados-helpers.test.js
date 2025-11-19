import { describe, it } from "mocha";
import { expect } from "chai";
import {
  createDescritivo,
  parseDescritivo,
  mapPerfisToBackend,
  mapPerfisToFrontend,
  mapSituacaoToStatus,
  mapStatusToSituacao,
  validateUsuarioDadosForm,
  hasErrors,
  isFormValid,
  prepareUsuarioDadosForBackend,
  formatPhoneForBackend,
  formatPhoneForDisplay,
  canEditPerfis,
  getRedirectRoute,
} from "../../src/lib/usuario-dados-helpers";

describe("usuario-dados-helpers", () => {
  describe("createDescritivo", () => {
    context("Dado dados bancários válidos", () => {
      context("Quando criar descritivo", () => {
        it("Então deve retornar JSON com campos corretos", () => {
          const result = createDescritivo("Itaú", "1234", "56789-0", "email@test.com");
          const parsed = JSON.parse(result);

          expect(parsed).to.have.property("banco", "Itaú");
          expect(parsed).to.have.property("agencia", "1234");
          expect(parsed).to.have.property("conta", "56789-0");
          expect(parsed).to.have.property("pix", "email@test.com");
        });
      });
    });
  });

  describe("parseDescritivo", () => {
    context("Dado um descritivo JSON válido", () => {
      context("Quando parsear descritivo", () => {
        it("Então deve extrair dados bancários corretamente", () => {
          const json = JSON.stringify({
            banco: "Bradesco",
            agencia: "5678",
            conta: "12345-6",
            pix: "123.456.789-00"
          });

          const result = parseDescritivo(json);

          expect(result.banco).to.equal("Bradesco");
          expect(result.agencia).to.equal("5678");
          expect(result.conta).to.equal("12345-6");
          expect(result.chavePix).to.equal("123.456.789-00");
        });
      });
    });

    context("Dado descritivo null", () => {
      context("Quando parsear descritivo", () => {
        it("Então deve retornar valores padrão vazios", () => {
          const result = parseDescritivo(null);

          expect(result.banco).to.equal("");
          expect(result.agencia).to.equal("");
          expect(result.conta).to.equal("");
          expect(result.chavePix).to.equal("");
        });
      });
    });

    context("Dado JSON inválido", () => {
      context("Quando parsear descritivo", () => {
        it("Então deve retornar valores padrão vazios", () => {
          const result = parseDescritivo("invalid json");

          expect(result.banco).to.equal("");
          expect(result.agencia).to.equal("");
          expect(result.conta).to.equal("");
          expect(result.chavePix).to.equal("");
        });
      });
    });
  });

  describe("mapPerfisToBackend", () => {
    context("Dado checkboxes de perfis selecionados", () => {
      context("Quando mapear para backend", () => {
        it("Então deve retornar array de perfis corretos", () => {
          const formData = {
            perfilAdministrador: true,
            perfilFornecedor: true,
            perfilConsumidor: false,
            perfilAdministradorMercado: false,
          };

          const result = mapPerfisToBackend(formData);

          expect(result).to.be.an("array");
          expect(result).to.have.lengthOf(2);
          expect(result).to.include("admin");
          expect(result).to.include("fornecedor");
        });
      });
    });

    context("Dado todos os perfis selecionados", () => {
      context("Quando mapear para backend", () => {
        it("Então deve retornar todos os perfis", () => {
          const formData = {
            perfilAdministrador: true,
            perfilFornecedor: true,
            perfilConsumidor: true,
            perfilAdministradorMercado: true,
          };

          const result = mapPerfisToBackend(formData);

          expect(result).to.have.lengthOf(4);
          expect(result).to.include.members(["admin", "adminmercado", "fornecedor", "consumidor"]);
        });
      });
    });
  });

  describe("mapPerfisToFrontend", () => {
    context("Dado array de perfis do backend", () => {
      context("Quando mapear para frontend", () => {
        it("Então deve retornar checkboxes corretos", () => {
          const perfis = ["admin", "fornecedor"];

          const result = mapPerfisToFrontend(perfis);

          expect(result.perfilAdministrador).to.be.true;
          expect(result.perfilFornecedor).to.be.true;
          expect(result.perfilConsumidor).to.be.false;
          expect(result.perfilAdministradorMercado).to.be.false;
        });
      });
    });
  });

  describe("mapSituacaoToStatus", () => {
    context("Dado situação frontend", () => {
      context("Quando mapear para status backend", () => {
        it("Então deve retornar status em lowercase", () => {
          expect(mapSituacaoToStatus("Ativo")).to.equal("ativo");
          expect(mapSituacaoToStatus("Inativo")).to.equal("inativo");
          expect(mapSituacaoToStatus("Pendente")).to.equal("pendente");
        });
      });
    });
  });

  describe("mapStatusToSituacao", () => {
    context("Dado status backend", () => {
      context("Quando mapear para situação frontend", () => {
        it("Então deve retornar situação capitalizada", () => {
          expect(mapStatusToSituacao("ativo")).to.equal("Ativo");
          expect(mapStatusToSituacao("inativo")).to.equal("Inativo");
          expect(mapStatusToSituacao("pendente")).to.equal("Pendente");
        });
      });
    });
  });

  describe("validateUsuarioDadosForm", () => {
    context("Dado formulário válido", () => {
      context("Quando validar formulário", () => {
        it("Então não deve retornar erros", () => {
          const formData = {
            nomeCompleto: "João Silva",
            celular: "11987654321",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: true,
          };

          const errors = validateUsuarioDadosForm(formData);

          expect(errors).to.be.an("object");
          expect(Object.keys(errors)).to.have.lengthOf(0);
        });
      });
    });

    context("Dado nome completo vazio", () => {
      context("Quando validar formulário", () => {
        it("Então deve retornar erro de nome completo", () => {
          const formData = {
            nomeCompleto: "",
            celular: "11987654321",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: true,
          };

          const errors = validateUsuarioDadosForm(formData);

          expect(errors).to.have.property("nomeCompleto");
        });
      });
    });

    context("Dado celular inválido", () => {
      context("Quando validar formulário", () => {
        it("Então deve retornar erro de celular", () => {
          const formData = {
            nomeCompleto: "João Silva",
            celular: "123",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: true,
          };

          const errors = validateUsuarioDadosForm(formData);

          expect(errors).to.have.property("celular");
        });
      });
    });

    context("Dado política não aceita", () => {
      context("Quando validar formulário", () => {
        it("Então deve retornar erro de aceite política", () => {
          const formData = {
            nomeCompleto: "João Silva",
            celular: "11987654321",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: false,
          };

          const errors = validateUsuarioDadosForm(formData);

          expect(errors).to.have.property("aceitePolitica");
        });
      });
    });
  });

  describe("hasErrors", () => {
    context("Dado objeto de erros vazio", () => {
      context("Quando verificar erros", () => {
        it("Então deve retornar false", () => {
          expect(hasErrors({})).to.be.false;
        });
      });
    });

    context("Dado objeto de erros com campos", () => {
      context("Quando verificar erros", () => {
        it("Então deve retornar true", () => {
          expect(hasErrors({ nome: "erro" })).to.be.true;
        });
      });
    });
  });

  describe("isFormValid", () => {
    context("Dado formulário válido", () => {
      context("Quando verificar validade", () => {
        it("Então deve retornar true", () => {
          const formData = {
            nomeCompleto: "João Silva",
            celular: "11987654321",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: true,
          };

          expect(isFormValid(formData)).to.be.true;
        });
      });
    });

    context("Dado formulário inválido", () => {
      context("Quando verificar validade", () => {
        it("Então deve retornar false", () => {
          const formData = {
            nomeCompleto: "",
            celular: "11987654321",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: true,
          };

          expect(isFormValid(formData)).to.be.false;
        });
      });
    });
  });

  describe("prepareUsuarioDadosForBackend", () => {
    context("Dado dados válidos do formulário", () => {
      context("Quando preparar para backend", () => {
        it("Então deve retornar estrutura correta", () => {
          const formData = {
            nomeCompleto: "João Silva",
            nomeFantasia: "João",
            celular: "11987654321",
            banco: "Itaú",
            agencia: "1234",
            conta: "56789-0",
            chavePix: "joao@email.com",
            aceitePolitica: true,
            perfilAdministrador: true,
            perfilFornecedor: false,
            perfilConsumidor: false,
            perfilAdministradorMercado: false,
            situacao: "Ativo",
          };

          const result = prepareUsuarioDadosForBackend("123", formData);

          expect(result).to.have.property("id", "123");
          expect(result).to.have.property("input");
          expect(result.input).to.have.property("nome", "João Silva");
          expect(result.input).to.have.property("nomeoficial", "João");
          expect(result.input).to.have.property("celular", "11987654321");
          expect(result.input).to.have.property("descritivo");
          expect(result.input).to.have.property("cientepolitica", "sim");
          expect(result.input).to.have.property("perfis");
          expect(result.input.perfis).to.include("admin");
          expect(result.input).to.have.property("status", "ativo");
        });
      });
    });
  });

  describe("formatPhoneForBackend", () => {
    context("Dado celular formatado", () => {
      context("Quando formatar para backend", () => {
        it("Então deve remover formatação", () => {
          expect(formatPhoneForBackend("(11) 98765-4321")).to.equal("11987654321");
        });
      });
    });
  });

  describe("formatPhoneForDisplay", () => {
    context("Dado celular com 11 dígitos", () => {
      context("Quando formatar para exibição", () => {
        it("Então deve aplicar máscara (XX) XXXXX-XXXX", () => {
          expect(formatPhoneForDisplay("11987654321")).to.equal("(11) 98765-4321");
        });
      });
    });
  });

  describe("canEditPerfis", () => {
    context("Dado role admin", () => {
      context("Quando verificar permissão", () => {
        it("Então deve retornar true", () => {
          expect(canEditPerfis("admin")).to.be.true;
        });
      });
    });

    context("Dado role não-admin", () => {
      context("Quando verificar permissão", () => {
        it("Então deve retornar false", () => {
          expect(canEditPerfis("fornecedor")).to.be.false;
          expect(canEditPerfis("consumidor")).to.be.false;
        });
      });
    });
  });

  describe("getRedirectRoute", () => {
    context("Dado diferentes roles", () => {
      context("Quando obter rota de redirecionamento", () => {
        it("Então deve retornar rotas corretas", () => {
          expect(getRedirectRoute("admin")).to.equal("/admin/dashboard");
          expect(getRedirectRoute("adminmercado")).to.equal("/adminmercado/dashboard");
          expect(getRedirectRoute("fornecedor")).to.equal("/fornecedor/loja");
          expect(getRedirectRoute("consumidor")).to.equal("/dashboard");
          expect(getRedirectRoute("unknown")).to.equal("/dashboard");
        });
      });
    });
  });
});
