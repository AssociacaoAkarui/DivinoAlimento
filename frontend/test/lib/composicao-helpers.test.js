const { expect } = require("chai");
const {
  transformarOfertasParaUI,
  calcularValorTotalComposicao,
  calcularTotalItens,
} = require("../../src/lib/composicao-helpers.ts");

describe("UC013: Gestão de Composição de Lotes - Composicao Helpers", () => {
  describe("transformarOfertasParaUI", () => {
    context("Dado ofertas da API GraphQL", () => {
      context("Quando a oferta tem produto com todos os campos", () => {
        it("Então deve transformar para formato UI corretamente", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor A" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op1",
                  produtoId: 1,
                  produto: { id: "1", nome: "Tomate", medida: "kg" },
                  quantidade: 50,
                  valorReferencia: 5.0,
                  valorOferta: 4.5,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].id).to.equal("op1");
          expect(resultado[0].produto_base).to.equal("Tomate");
          expect(resultado[0].nome).to.equal("Tomate (kg)");
          expect(resultado[0].unidade).to.equal("kg");
          expect(resultado[0].valor).to.equal(4.5);
          expect(resultado[0].fornecedor).to.equal("Fornecedor A");
          expect(resultado[0].quantidadeOfertada).to.equal(50);
          expect(resultado[0].certificacao).to.equal("convencional");
          expect(resultado[0].tipo_agricultura).to.equal("familiar");
        });
      });

      context("Quando a oferta não tem valorOferta", () => {
        it("Então deve usar valorReferencia", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor B" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op2",
                  produtoId: 2,
                  produto: { id: "2", nome: "Batata", medida: "kg" },
                  quantidade: 100,
                  valorReferencia: 3.0,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].valor).to.equal(3.0);
        });
      });

      context("Quando a oferta não tem medida do produto", () => {
        it("Então deve usar 'un' como unidade padrão", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor C" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op3",
                  produtoId: 3,
                  produto: { id: "3", nome: "Alface" },
                  quantidade: 20,
                  valorOferta: 2.5,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].unidade).to.equal("un");
          expect(resultado[0].nome).to.equal("Alface (un)");
        });
      });

      context("Quando a oferta não tem usuário", () => {
        it("Então deve usar 'Fornecedor' como padrão", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op4",
                  produtoId: 4,
                  produto: { id: "4", nome: "Cenoura", medida: "kg" },
                  quantidade: 30,
                  valorOferta: 3.5,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].fornecedor).to.equal("Fornecedor");
        });
      });

      context("Quando a oferta tem múltiplos produtos", () => {
        it("Então deve transformar todos os produtos", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor D" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op5",
                  produtoId: 5,
                  produto: { id: "5", nome: "Tomate", medida: "kg" },
                  quantidade: 50,
                  valorOferta: 4.0,
                },
                {
                  id: "op6",
                  produtoId: 6,
                  produto: { id: "6", nome: "Cebola", medida: "kg" },
                  quantidade: 40,
                  valorOferta: 3.0,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].produto_base).to.equal("Tomate");
          expect(resultado[1].produto_base).to.equal("Cebola");
        });
      });

      context("Quando há múltiplas ofertas", () => {
        it("Então deve transformar todas as ofertas", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor E" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op7",
                  produtoId: 7,
                  produto: { id: "7", nome: "Maçã", medida: "kg" },
                  quantidade: 25,
                  valorOferta: 5.0,
                },
              ],
            },
            {
              id: "2",
              cicloId: 1,
              usuarioId: 2,
              usuario: { id: "2", nome: "Fornecedor F" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op8",
                  produtoId: 8,
                  produto: { id: "8", nome: "Banana", medida: "kg" },
                  quantidade: 30,
                  valorOferta: 4.0,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].fornecedor).to.equal("Fornecedor E");
          expect(resultado[1].fornecedor).to.equal("Fornecedor F");
        });
      });

      context("Quando o produto não existe no ofertaProduto", () => {
        it("Então deve ignorar o ofertaProduto", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor G" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op9",
                  produtoId: 9,
                  quantidade: 10,
                  valorOferta: 2.0,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(0);
        });
      });

      context("Quando não há valorOferta nem valorReferencia", () => {
        it("Então deve usar 0 como valor padrão", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor H" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op10",
                  produtoId: 10,
                  produto: { id: "10", nome: "Pimentão", medida: "kg" },
                  quantidade: 15,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaUI(ofertasAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].valor).to.equal(0);
        });
      });

      context("Quando a lista de ofertas está vazia", () => {
        it("Então deve retornar array vazio", () => {
          const resultado = transformarOfertasParaUI([]);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("calcularValorTotalComposicao", () => {
    context("Dado uma lista de itens selecionados", () => {
      context("Quando há múltiplos itens", () => {
        it("Então deve calcular valor total corretamente", () => {
          const selectedItems = [
            { valor: 5.0, quantidade: 10 },
            { valor: 3.0, quantidade: 20 },
            { valor: 4.5, quantidade: 15 },
          ];

          const total = calcularValorTotalComposicao(selectedItems);

          expect(total).to.equal(177.5);
        });
      });

      context("Quando há um único item", () => {
        it("Então deve calcular valor corretamente", () => {
          const selectedItems = [{ valor: 7.5, quantidade: 8 }];

          const total = calcularValorTotalComposicao(selectedItems);

          expect(total).to.equal(60.0);
        });
      });

      context("Quando a lista está vazia", () => {
        it("Então deve retornar zero", () => {
          const total = calcularValorTotalComposicao([]);
          expect(total).to.equal(0);
        });
      });

      context("Quando há itens com quantidade zero", () => {
        it("Então deve ignorar itens com quantidade zero", () => {
          const selectedItems = [
            { valor: 5.0, quantidade: 10 },
            { valor: 3.0, quantidade: 0 },
          ];

          const total = calcularValorTotalComposicao(selectedItems);

          expect(total).to.equal(50.0);
        });
      });

      context("Quando há valores decimais", () => {
        it("Então deve calcular corretamente com valores decimais", () => {
          const selectedItems = [
            { valor: 2.75, quantidade: 12 },
            { valor: 1.5, quantidade: 8 },
          ];

          const total = calcularValorTotalComposicao(selectedItems);

          expect(total).to.equal(45.0);
        });
      });
    });
  });

  describe("calcularTotalItens", () => {
    context("Dado uma lista de itens selecionados", () => {
      context("Quando há múltiplos itens", () => {
        it("Então deve somar todas as quantidades", () => {
          const selectedItems = [
            { quantidade: 10 },
            { quantidade: 20 },
            { quantidade: 15 },
          ];

          const total = calcularTotalItens(selectedItems);

          expect(total).to.equal(45);
        });
      });

      context("Quando há um único item", () => {
        it("Então deve retornar a quantidade do item", () => {
          const selectedItems = [{ quantidade: 25 }];

          const total = calcularTotalItens(selectedItems);

          expect(total).to.equal(25);
        });
      });

      context("Quando a lista está vazia", () => {
        it("Então deve retornar zero", () => {
          const total = calcularTotalItens([]);
          expect(total).to.equal(0);
        });
      });

      context("Quando há itens com quantidade zero", () => {
        it("Então deve incluir zeros no cálculo", () => {
          const selectedItems = [
            { quantidade: 10 },
            { quantidade: 0 },
            { quantidade: 5 },
          ];

          const total = calcularTotalItens(selectedItems);

          expect(total).to.equal(15);
        });
      });
    });
  });
});
