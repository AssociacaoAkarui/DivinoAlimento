const { describe, it } = require("mocha");
const { expect } = require("chai");

const {
  isStatusAtivo,
  isStatusInativo,
  formatStatusDisplay,
  parseStatusFromDisplay,
  filterProdutosByStatus,
  filterProdutosAtivos,
  filterProdutosInativos,
  filterProdutosByCategoria,
  searchProdutosByNome,
  sortProdutosByNome,
  sortProdutosByValorReferencia,
  countProdutosAtivos,
  countProdutosInativos,
  isProdutoNomeValid,
  formatProdutoNome,
  hasDescritivo,
  formatValorReferencia,
  parseValorReferencia,
  formatMedida,
  formatPesoGrama,
} = require("../../src/lib/produto-helpers");

describe("UC008: Gestão de Produtos - Produto Helpers", () => {
  describe("isStatusAtivo", () => {
    it('deve retornar true para status "ativo"', () => {
      expect(isStatusAtivo("ativo")).to.be.true;
    });

    it('deve retornar false para status "inativo"', () => {
      expect(isStatusAtivo("inativo")).to.be.false;
    });
  });

  describe("isStatusInativo", () => {
    it('deve retornar true para status "inativo"', () => {
      expect(isStatusInativo("inativo")).to.be.true;
    });

    it('deve retornar false para status "ativo"', () => {
      expect(isStatusInativo("ativo")).to.be.false;
    });
  });

  describe("formatStatusDisplay", () => {
    it('deve retornar "Ativo" para status "ativo"', () => {
      expect(formatStatusDisplay("ativo")).to.equal("Ativo");
    });

    it('deve retornar "Inativo" para status "inativo"', () => {
      expect(formatStatusDisplay("inativo")).to.equal("Inativo");
    });
  });

  describe("parseStatusFromDisplay", () => {
    it('deve retornar "ativo" para "Ativo"', () => {
      expect(parseStatusFromDisplay("Ativo")).to.equal("ativo");
    });

    it('deve retornar "inativo" para "Inativo"', () => {
      expect(parseStatusFromDisplay("Inativo")).to.equal("inativo");
    });
  });

  describe("filterProdutosByStatus", () => {
    const produtos = [
      { id: "1", nome: "Maçã", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "inativo", categoriaId: "1" },
      { id: "3", nome: "Pera", status: "ativo", categoriaId: "2" },
    ];

    it("deve filtrar produtos ativos", () => {
      const resultado = filterProdutosByStatus(produtos, "ativo");
      expect(resultado).to.have.lengthOf(2);
      expect(resultado[0].nome).to.equal("Maçã");
      expect(resultado[1].nome).to.equal("Pera");
    });

    it("deve filtrar produtos inativos", () => {
      const resultado = filterProdutosByStatus(produtos, "inativo");
      expect(resultado).to.have.lengthOf(1);
      expect(resultado[0].nome).to.equal("Banana");
    });
  });

  describe("filterProdutosAtivos", () => {
    const produtos = [
      { id: "1", nome: "Maçã", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "inativo", categoriaId: "1" },
      { id: "3", nome: "Pera", status: "ativo", categoriaId: "2" },
    ];

    it("deve retornar apenas produtos ativos", () => {
      const resultado = filterProdutosAtivos(produtos);
      expect(resultado).to.have.lengthOf(2);
    });
  });

  describe("filterProdutosInativos", () => {
    const produtos = [
      { id: "1", nome: "Maçã", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "inativo", categoriaId: "1" },
      { id: "3", nome: "Pera", status: "ativo", categoriaId: "2" },
    ];

    it("deve retornar apenas produtos inativos", () => {
      const resultado = filterProdutosInativos(produtos);
      expect(resultado).to.have.lengthOf(1);
    });
  });

  describe("filterProdutosByCategoria", () => {
    const produtos = [
      { id: "1", nome: "Maçã", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "ativo", categoriaId: "1" },
      { id: "3", nome: "Pera", status: "ativo", categoriaId: "2" },
    ];

    it("deve filtrar produtos pela categoria", () => {
      const resultado = filterProdutosByCategoria(produtos, "1");
      expect(resultado).to.have.lengthOf(2);
      expect(resultado[0].nome).to.equal("Maçã");
      expect(resultado[1].nome).to.equal("Banana");
    });
  });

  describe("searchProdutosByNome", () => {
    const produtos = [
      { id: "1", nome: "Maçã Fuji", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana Prata", status: "ativo", categoriaId: "1" },
      { id: "3", nome: "Maçã Verde", status: "ativo", categoriaId: "1" },
    ];

    it("deve buscar produtos por nome", () => {
      const resultado = searchProdutosByNome(produtos, "maçã");
      expect(resultado).to.have.lengthOf(2);
      expect(resultado[0].nome).to.include("Maçã");
      expect(resultado[1].nome).to.include("Maçã");
    });

    it("deve retornar todos com termo vazio", () => {
      const resultado = searchProdutosByNome(produtos, "");
      expect(resultado).to.have.lengthOf(3);
    });
  });

  describe("sortProdutosByNome", () => {
    const produtos = [
      { id: "1", nome: "Pera", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "ativo", categoriaId: "1" },
      { id: "3", nome: "Maçã", status: "ativo", categoriaId: "1" },
    ];

    it("deve ordenar produtos alfabeticamente", () => {
      const resultado = sortProdutosByNome(produtos);
      expect(resultado[0].nome).to.equal("Banana");
      expect(resultado[1].nome).to.equal("Maçã");
      expect(resultado[2].nome).to.equal("Pera");
    });
  });

  describe("sortProdutosByValorReferencia", () => {
    const produtos = [
      {
        id: "1",
        nome: "Pera",
        valorReferencia: 5.0,
        status: "ativo",
        categoriaId: "1",
      },
      {
        id: "2",
        nome: "Banana",
        valorReferencia: 2.5,
        status: "ativo",
        categoriaId: "1",
      },
      {
        id: "3",
        nome: "Maçã",
        valorReferencia: 3.0,
        status: "ativo",
        categoriaId: "1",
      },
    ];

    it("deve ordenar produtos por valor", () => {
      const resultado = sortProdutosByValorReferencia(produtos);
      expect(resultado[0].nome).to.equal("Banana");
      expect(resultado[1].nome).to.equal("Maçã");
      expect(resultado[2].nome).to.equal("Pera");
    });
  });

  describe("countProdutosAtivos", () => {
    const produtos = [
      { id: "1", nome: "Maçã", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "inativo", categoriaId: "1" },
      { id: "3", nome: "Pera", status: "ativo", categoriaId: "2" },
    ];

    it("deve contar produtos ativos", () => {
      const resultado = countProdutosAtivos(produtos);
      expect(resultado).to.equal(2);
    });
  });

  describe("countProdutosInativos", () => {
    const produtos = [
      { id: "1", nome: "Maçã", status: "ativo", categoriaId: "1" },
      { id: "2", nome: "Banana", status: "inativo", categoriaId: "1" },
      { id: "3", nome: "Pera", status: "ativo", categoriaId: "2" },
    ];

    it("deve contar produtos inativos", () => {
      const resultado = countProdutosInativos(produtos);
      expect(resultado).to.equal(1);
    });
  });

  describe("isProdutoNomeValid", () => {
    it("deve retornar true para nome válido", () => {
      expect(isProdutoNomeValid("Maçã Fuji")).to.be.true;
    });

    it("deve retornar false para nome vazio", () => {
      expect(isProdutoNomeValid("   ")).to.be.false;
    });
  });

  describe("formatProdutoNome", () => {
    it("deve remover espaços extras", () => {
      expect(formatProdutoNome("  Maçã Fuji  ")).to.equal("Maçã Fuji");
    });
  });

  describe("hasDescritivo", () => {
    it("deve retornar true para produto com descritivo", () => {
      const produto = {
        id: "1",
        nome: "Maçã",
        descritivo: "Maçã fresca",
        categoriaId: "1",
      };
      expect(hasDescritivo(produto)).to.be.true;
    });

    it("deve retornar false para produto sem descritivo", () => {
      const produto = {
        id: "1",
        nome: "Maçã",
        descritivo: null,
        categoriaId: "1",
      };
      expect(hasDescritivo(produto)).to.be.false;
    });
  });

  describe("formatValorReferencia", () => {
    it("deve formatar valor em reais", () => {
      expect(formatValorReferencia(10.5)).to.equal("R$ 10,50");
    });

    it("deve retornar R$ 0,00 para valor nulo", () => {
      expect(formatValorReferencia(null)).to.equal("R$ 0,00");
    });
  });

  describe("parseValorReferencia", () => {
    it("deve converter string para número", () => {
      expect(parseValorReferencia("R$ 10,50")).to.equal(10.5);
    });
  });

  describe("formatMedida", () => {
    it("deve retornar medida em maiúsculas", () => {
      expect(formatMedida("kg")).to.equal("KG");
    });

    it('deve retornar "-" para medida nula', () => {
      expect(formatMedida(null)).to.equal("-");
    });
  });

  describe("formatPesoGrama", () => {
    it('deve formatar peso com "g"', () => {
      expect(formatPesoGrama(500)).to.equal("500g");
    });

    it('deve retornar "0g" para peso nulo', () => {
      expect(formatPesoGrama(null)).to.equal("0g");
    });
  });
});
