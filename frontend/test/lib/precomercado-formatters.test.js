const { expect } = require("chai");

const {
  formatPreco,
  formatPrecoSimple,
  parsePrecoFromBRL,
  formatStatusPreco,
  getStatusPrecoColor,
  formatPriceDifference,
  formatPricePercentage,
  formatCreateSuccessMessage,
  formatUpdateSuccessMessage,
  formatDeleteSuccessMessage,
  formatCreateError,
  formatUpdateError,
  formatDeleteError,
  formatPrecoWithMedida,
  formatPriceComparison,
} = require("../../src/lib/precomercado-formatters.ts");

describe("PrecoMercado Formatters", function () {
  describe("formatPreco", function () {
    context("Dado um valor numérico", function () {
      context("Quando formato 10.50", function () {
        it("Então deve retornar 'R$ 10,50'", function () {
          const result = formatPreco(10.5);
          expect(result).to.include("10,50");
          expect(result).to.include("R$");
        });
      });

      context("Quando formato 1000", function () {
        it("Então deve retornar 'R$ 1.000,00'", function () {
          const result = formatPreco(1000);
          expect(result).to.include("1.000,00");
          expect(result).to.include("R$");
        });
      });

      context("Quando formato 0", function () {
        it("Então deve retornar 'R$ 0,00'", function () {
          const result = formatPreco(0);
          expect(result).to.include("0,00");
          expect(result).to.include("R$");
        });
      });
    });
  });

  describe("formatPrecoSimple", function () {
    context("Dado um valor numérico", function () {
      context("Quando formato 10.50", function () {
        it("Então deve retornar '10,50'", function () {
          const result = formatPrecoSimple(10.5);
          expect(result).to.equal("10,50");
        });
      });

      context("Quando formato 15", function () {
        it("Então deve retornar '15,00'", function () {
          const result = formatPrecoSimple(15);
          expect(result).to.equal("15,00");
        });
      });
    });
  });

  describe("parsePrecoFromBRL", function () {
    context("Dado uma string formatada em BRL", function () {
      context("Quando converto 'R$ 10,50'", function () {
        it("Então deve retornar 10.5", function () {
          const result = parsePrecoFromBRL("R$ 10,50");
          expect(result).to.equal(10.5);
        });
      });

      context("Quando converto 'R$ 1.000,00'", function () {
        it("Então deve retornar 1000", function () {
          const result = parsePrecoFromBRL("R$ 1.000,00");
          expect(result).to.equal(1000);
        });
      });

      context("Quando converto string vazia", function () {
        it("Então deve retornar 0", function () {
          const result = parsePrecoFromBRL("");
          expect(result).to.equal(0);
        });
      });

      context("Quando converto valor inválido", function () {
        it("Então deve retornar 0", function () {
          const result = parsePrecoFromBRL("abc");
          expect(result).to.equal(0);
        });
      });
    });
  });

  describe("formatStatusPreco", function () {
    context("Dado um status", function () {
      context("Quando formato 'ativo'", function () {
        it("Então deve retornar 'Ativo'", function () {
          const result = formatStatusPreco("ativo");
          expect(result).to.equal("Ativo");
        });
      });

      context("Quando formato 'inativo'", function () {
        it("Então deve retornar 'Inativo'", function () {
          const result = formatStatusPreco("inativo");
          expect(result).to.equal("Inativo");
        });
      });

      context("Quando formato status desconhecido", function () {
        it("Então deve retornar o próprio status", function () {
          const result = formatStatusPreco("pendente");
          expect(result).to.equal("pendente");
        });
      });
    });
  });

  describe("getStatusPrecoColor", function () {
    context("Dado um status", function () {
      context("Quando obtenho cor de 'ativo'", function () {
        it("Então deve retornar 'success'", function () {
          const result = getStatusPrecoColor("ativo");
          expect(result).to.equal("success");
        });
      });

      context("Quando obtenho cor de 'inativo'", function () {
        it("Então deve retornar 'secondary'", function () {
          const result = getStatusPrecoColor("inativo");
          expect(result).to.equal("secondary");
        });
      });

      context("Quando obtenho cor de status desconhecido", function () {
        it("Então deve retornar 'default'", function () {
          const result = getStatusPrecoColor("pendente");
          expect(result).to.equal("default");
        });
      });
    });
  });

  describe("formatPriceDifference", function () {
    context("Dado uma diferença de preço", function () {
      context("Quando diferença é positiva", function () {
        it("Então deve retornar com sinal '+'", function () {
          const result = formatPriceDifference(5.5);
          expect(result).to.include("+");
          expect(result).to.include("5,50");
        });
      });

      context("Quando diferença é negativa", function () {
        it("Então deve retornar com sinal '-'", function () {
          const result = formatPriceDifference(-5.5);
          expect(result).to.include("-");
          expect(result).to.include("5,50");
        });
      });

      context("Quando diferença é zero", function () {
        it("Então deve retornar '+R$ 0,00'", function () {
          const result = formatPriceDifference(0);
          expect(result).to.include("+");
          expect(result).to.include("0,00");
        });
      });
    });
  });

  describe("formatPricePercentage", function () {
    context("Dado uma porcentagem", function () {
      context("Quando porcentagem é positiva", function () {
        it("Então deve retornar com sinal '+'", function () {
          const result = formatPricePercentage(25.5);
          expect(result).to.include("+");
          expect(result).to.include("25");
          expect(result).to.include("%");
        });
      });

      context("Quando porcentagem é negativa", function () {
        it("Então deve retornar com sinal '-'", function () {
          const result = formatPricePercentage(-15.5);
          expect(result).to.include("-");
          expect(result).to.include("15");
          expect(result).to.include("%");
        });
      });

      context("Quando porcentagem é zero", function () {
        it("Então deve retornar '+0,0%'", function () {
          const result = formatPricePercentage(0);
          expect(result).to.include("+");
          expect(result).to.include("0");
          expect(result).to.include("%");
        });
      });
    });
  });

  describe("formatCreateSuccessMessage", function () {
    context("Dado nomes de produto e mercado", function () {
      context("Quando formato mensagem de criação", function () {
        it("Então deve incluir ambos os nomes", function () {
          const result = formatCreateSuccessMessage(
            "Banana",
            "Mercado Central",
          );
          expect(result).to.include("Banana");
          expect(result).to.include("Mercado Central");
          expect(result).to.include("criado com sucesso");
        });
      });
    });
  });

  describe("formatUpdateSuccessMessage", function () {
    context("Dado nome de produto", function () {
      context("Quando formato mensagem de atualização", function () {
        it("Então deve incluir o nome do produto", function () {
          const result = formatUpdateSuccessMessage("Banana");
          expect(result).to.include("Banana");
          expect(result).to.include("atualizado com sucesso");
        });
      });
    });
  });

  describe("formatDeleteSuccessMessage", function () {
    context("Dado nome de produto", function () {
      context("Quando formato mensagem de exclusão", function () {
        it("Então deve incluir o nome do produto", function () {
          const result = formatDeleteSuccessMessage("Banana");
          expect(result).to.include("Banana");
          expect(result).to.include("removido com sucesso");
        });
      });
    });
  });

  describe("formatCreateError", function () {
    context("Dado um erro", function () {
      context("Quando erro contém 'Já existe'", function () {
        it("Então deve retornar mensagem específica", function () {
          const error = { message: "Já existe um preço" };
          const result = formatCreateError(error);
          expect(result).to.equal(
            "Já existe um preço cadastrado para este produto neste mercado",
          );
        });
      });

      context("Quando erro tem mensagem genérica", function () {
        it("Então deve retornar a mensagem do erro", function () {
          const error = { message: "Erro específico" };
          const result = formatCreateError(error);
          expect(result).to.equal("Erro específico");
        });
      });

      context("Quando erro não tem mensagem", function () {
        it("Então deve retornar mensagem padrão", function () {
          const result = formatCreateError({});
          expect(result).to.equal("Erro ao criar preço");
        });
      });
    });
  });

  describe("formatUpdateError", function () {
    context("Dado um erro", function () {
      context("Quando erro tem mensagem", function () {
        it("Então deve retornar a mensagem", function () {
          const error = { message: "Preço não encontrado" };
          const result = formatUpdateError(error);
          expect(result).to.equal("Preço não encontrado");
        });
      });

      context("Quando erro não tem mensagem", function () {
        it("Então deve retornar mensagem padrão", function () {
          const result = formatUpdateError({});
          expect(result).to.equal("Erro ao atualizar preço");
        });
      });
    });
  });

  describe("formatDeleteError", function () {
    context("Dado um erro", function () {
      context("Quando erro tem mensagem", function () {
        it("Então deve retornar a mensagem", function () {
          const error = { message: "Preço não encontrado" };
          const result = formatDeleteError(error);
          expect(result).to.equal("Preço não encontrado");
        });
      });

      context("Quando erro não tem mensagem", function () {
        it("Então deve retornar mensagem padrão", function () {
          const result = formatDeleteError({});
          expect(result).to.equal("Erro ao excluir preço");
        });
      });
    });
  });

  describe("formatPrecoWithMedida", function () {
    context("Dado preço e medida", function () {
      context("Quando formato 10.50 com 'kg'", function () {
        it("Então deve retornar 'R$ 10,50 / kg'", function () {
          const result = formatPrecoWithMedida(10.5, "kg");
          expect(result).to.include("10,50");
          expect(result).to.include("kg");
          expect(result).to.include("/");
        });
      });

      context("Quando formato 5 com 'unidade'", function () {
        it("Então deve retornar 'R$ 5,00 / unidade'", function () {
          const result = formatPrecoWithMedida(5, "unidade");
          expect(result).to.include("5,00");
          expect(result).to.include("unidade");
        });
      });
    });
  });

  describe("formatPriceComparison", function () {
    context("Dado preços de mercado e referência", function () {
      context("Quando preço de mercado é maior", function () {
        it("Então deve mostrar seta para cima e percentual positivo", function () {
          const result = formatPriceComparison(15, 10);
          expect(result).to.include("↑");
          expect(result).to.include("+50");
        });
      });

      context("Quando preço de mercado é menor", function () {
        it("Então deve mostrar seta para baixo e percentual negativo", function () {
          const result = formatPriceComparison(8, 10);
          expect(result).to.include("↓");
          expect(result).to.include("-20");
        });
      });

      context("Quando preços são iguais", function () {
        it("Então deve retornar mensagem de igualdade", function () {
          const result = formatPriceComparison(10, 10);
          expect(result).to.equal("Igual ao preço de referência");
        });
      });

      context("Quando preço de referência é zero", function () {
        it("Então deve calcular sem erro", function () {
          const result = formatPriceComparison(10, 0);
          expect(result).to.be.a("string");
        });
      });
    });
  });
});
