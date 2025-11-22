const { expect } = require("chai");

const {
  preparePrecoMercadoForBackend,
  filterPrecosByStatus,
  filterPrecosBySearch,
  sortPrecosByProdutoNome,
  sortPrecosByPreco,
  calculatePriceDifference,
  getPrecosPorMercado,
  getPrecosPorProduto,
  validatePreco,
  isPrecoChanged,
} = require("../../src/lib/precomercado-helpers.ts");

describe("PrecoMercado Helpers", function () {
  describe("preparePrecoMercadoForBackend", function () {
    context("Dado dados de preço para enviar ao backend", function () {
      context("Quando preparo com todos os campos", function () {
        it("Então deve retornar objeto formatado", function () {
          const input = {
            produtoId: 1,
            mercadoId: 2,
            preco: 10.5,
            status: "ativo",
          };
          const result = preparePrecoMercadoForBackend(input);
          expect(result).to.deep.equal({
            produtoId: 1,
            mercadoId: 2,
            preco: 10.5,
            status: "ativo",
          });
        });
      });

      context("Quando preparo sem status", function () {
        it("Então deve usar 'ativo' como padrão", function () {
          const input = {
            produtoId: 1,
            mercadoId: 2,
            preco: 10.5,
          };
          const result = preparePrecoMercadoForBackend(input);
          expect(result.status).to.equal("ativo");
        });
      });
    });
  });

  describe("filterPrecosByStatus", function () {
    const precos = [
      { id: 1, preco: 10, status: "ativo" },
      { id: 2, preco: 20, status: "inativo" },
      { id: 3, preco: 30, status: "ativo" },
    ];

    context("Dado uma lista de preços", function () {
      context("Quando filtro por status ativo", function () {
        it("Então deve retornar apenas preços ativos", function () {
          const result = filterPrecosByStatus(precos, ["ativo"]);
          expect(result).to.have.lengthOf(2);
          expect(result.every((p) => p.status === "ativo")).to.be.true;
        });
      });

      context("Quando filtro por status inativo", function () {
        it("Então deve retornar apenas preços inativos", function () {
          const result = filterPrecosByStatus(precos, ["inativo"]);
          expect(result).to.have.lengthOf(1);
          expect(result[0].status).to.equal("inativo");
        });
      });

      context("Quando passo array vazio de status", function () {
        it("Então deve retornar todos os preços", function () {
          const result = filterPrecosByStatus(precos, []);
          expect(result).to.have.lengthOf(3);
        });
      });
    });
  });

  describe("filterPrecosBySearch", function () {
    const precos = [
      {
        id: 1,
        preco: 10,
        produto: { nome: "Banana" },
        mercado: { nome: "Mercado Central" },
      },
      {
        id: 2,
        preco: 20,
        produto: { nome: "Maçã" },
        mercado: { nome: "Feira Livre" },
      },
    ];

    context("Dado uma lista de preços", function () {
      context("Quando busco por nome de produto", function () {
        it("Então deve retornar preços do produto", function () {
          const result = filterPrecosBySearch(precos, "Banana");
          expect(result).to.have.lengthOf(1);
          expect(result[0].produto.nome).to.equal("Banana");
        });
      });

      context("Quando busco por nome de mercado", function () {
        it("Então deve retornar preços do mercado", function () {
          const result = filterPrecosBySearch(precos, "Feira");
          expect(result).to.have.lengthOf(1);
          expect(result[0].mercado.nome).to.equal("Feira Livre");
        });
      });

      context("Quando busco com termo vazio", function () {
        it("Então deve retornar todos os preços", function () {
          const result = filterPrecosBySearch(precos, "");
          expect(result).to.have.lengthOf(2);
        });
      });

      context("Quando busco case insensitive", function () {
        it("Então deve encontrar independente de maiúsculas", function () {
          const result = filterPrecosBySearch(precos, "banana");
          expect(result).to.have.lengthOf(1);
        });
      });
    });
  });

  describe("sortPrecosByProdutoNome", function () {
    context("Dado uma lista de preços desordenada", function () {
      const precos = [
        { id: 1, produto: { nome: "Maçã" } },
        { id: 2, produto: { nome: "Banana" } },
        { id: 3, produto: { nome: "Uva" } },
      ];

      context("Quando ordeno por nome de produto", function () {
        it("Então deve retornar em ordem alfabética", function () {
          const result = sortPrecosByProdutoNome(precos);
          expect(result[0].produto.nome).to.equal("Banana");
          expect(result[1].produto.nome).to.equal("Maçã");
          expect(result[2].produto.nome).to.equal("Uva");
        });
      });

      context("Quando ordeno", function () {
        it("Então não deve modificar array original", function () {
          const result = sortPrecosByProdutoNome(precos);
          expect(precos[0].produto.nome).to.equal("Maçã");
        });
      });
    });
  });

  describe("sortPrecosByPreco", function () {
    const precos = [
      { id: 1, preco: 30 },
      { id: 2, preco: 10 },
      { id: 3, preco: 20 },
    ];

    context("Dado uma lista de preços", function () {
      context("Quando ordeno ascendente (padrão)", function () {
        it("Então deve ordenar do menor para o maior", function () {
          const result = sortPrecosByPreco(precos);
          expect(result[0].preco).to.equal(10);
          expect(result[1].preco).to.equal(20);
          expect(result[2].preco).to.equal(30);
        });
      });

      context("Quando ordeno descendente", function () {
        it("Então deve ordenar do maior para o menor", function () {
          const result = sortPrecosByPreco(precos, false);
          expect(result[0].preco).to.equal(30);
          expect(result[1].preco).to.equal(20);
          expect(result[2].preco).to.equal(10);
        });
      });
    });
  });

  describe("calculatePriceDifference", function () {
    context("Dado preços de mercado e referência", function () {
      context("Quando preço de mercado é maior", function () {
        it("Então deve calcular diferença positiva", function () {
          const result = calculatePriceDifference(15, 10);
          expect(result.difference).to.equal(5);
          expect(result.percentage).to.equal(50);
          expect(result.isHigher).to.be.true;
        });
      });

      context("Quando preço de mercado é menor", function () {
        it("Então deve calcular diferença negativa", function () {
          const result = calculatePriceDifference(8, 10);
          expect(result.difference).to.equal(-2);
          expect(result.percentage).to.equal(-20);
          expect(result.isHigher).to.be.false;
        });
      });

      context("Quando preço de referência é zero", function () {
        it("Então deve retornar percentual zero", function () {
          const result = calculatePriceDifference(10, 0);
          expect(result.percentage).to.equal(0);
        });
      });

      context("Quando preços são iguais", function () {
        it("Então diferença deve ser zero", function () {
          const result = calculatePriceDifference(10, 10);
          expect(result.difference).to.equal(0);
          expect(result.percentage).to.equal(0);
          expect(result.isHigher).to.be.false;
        });
      });
    });
  });

  describe("getPrecosPorMercado", function () {
    context("Dado uma lista de preços", function () {
      const precos = [
        { id: 1, mercadoId: 1, preco: 10 },
        { id: 2, mercadoId: 1, preco: 20 },
        { id: 3, mercadoId: 2, preco: 15 },
      ];

      context("Quando agrupo por mercado", function () {
        it("Então deve retornar Map agrupado por mercadoId", function () {
          const result = getPrecosPorMercado(precos);
          expect(result.size).to.equal(2);
          expect(result.get(1)).to.have.lengthOf(2);
          expect(result.get(2)).to.have.lengthOf(1);
        });
      });
    });
  });

  describe("getPrecosPorProduto", function () {
    context("Dado uma lista de preços", function () {
      const precos = [
        { id: 1, produtoId: 1, preco: 10 },
        { id: 2, produtoId: 1, preco: 20 },
        { id: 3, produtoId: 2, preco: 15 },
      ];

      context("Quando agrupo por produto", function () {
        it("Então deve retornar Map agrupado por produtoId", function () {
          const result = getPrecosPorProduto(precos);
          expect(result.size).to.equal(2);
          expect(result.get(1)).to.have.lengthOf(2);
          expect(result.get(2)).to.have.lengthOf(1);
        });
      });
    });
  });

  describe("validatePreco", function () {
    context("Dado um valor de preço", function () {
      context("Quando preço é positivo", function () {
        it("Então deve retornar true", function () {
          expect(validatePreco(10.5)).to.be.true;
        });
      });

      context("Quando preço é zero", function () {
        it("Então deve retornar false", function () {
          expect(validatePreco(0)).to.be.false;
        });
      });

      context("Quando preço é negativo", function () {
        it("Então deve retornar false", function () {
          expect(validatePreco(-5)).to.be.false;
        });
      });

      context("Quando preço é NaN", function () {
        it("Então deve retornar false", function () {
          expect(validatePreco(NaN)).to.be.false;
        });
      });

      context("Quando preço é Infinity", function () {
        it("Então deve retornar false", function () {
          expect(validatePreco(Infinity)).to.be.false;
        });
      });
    });
  });

  describe("isPrecoChanged", function () {
    const original = {
      id: 1,
      preco: 10,
      status: "ativo",
    };

    context("Dado um preço original e atualizado", function () {
      context("Quando preço mudou", function () {
        it("Então deve retornar true", function () {
          const updated = { preco: 15 };
          expect(isPrecoChanged(original, updated)).to.be.true;
        });
      });

      context("Quando status mudou", function () {
        it("Então deve retornar true", function () {
          const updated = { status: "inativo" };
          expect(isPrecoChanged(original, updated)).to.be.true;
        });
      });

      context("Quando nada mudou", function () {
        it("Então deve retornar false", function () {
          const updated = { preco: 10, status: "ativo" };
          expect(isPrecoChanged(original, updated)).to.be.false;
        });
      });

      context("Quando atualização está vazia", function () {
        it("Então deve retornar false", function () {
          const updated = {};
          expect(isPrecoChanged(original, updated)).to.be.false;
        });
      });
    });
  });
});
