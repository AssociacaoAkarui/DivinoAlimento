const { expect } = require("chai");
const {
  transformarPedidosParaRelatorio,
  consolidarPedidosPorConsumidor,
  calcularResumoConsolidadoPedidos,
  filtrarPedidos,
  ordenarPedidos,
} = require("../../src/lib/relatorio-consumidores-helpers.ts");

describe("UC020: Relatórios Consolidados Consumidores - Helpers", () => {
  describe("transformarPedidosParaRelatorio", () => {
    context("Dado pedidos da API GraphQL", () => {
      context("Quando o pedido tem todos os campos", () => {
        it("Então deve transformar para formato de relatório corretamente", () => {
          const pedidosAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Maria Silva" },
              ciclo: { id: "1", nome: "1º Ciclo de Outubro" },
              status: "confirmado",
              pedidoConsumidoresProdutos: [
                {
                  id: "p1",
                  produtoId: 1,
                  produto: { id: "1", nome: "Tomate", medida: "kg" },
                  quantidade: 3,
                  valorOferta: 5.0,
                  valorCompra: 4.5,
                },
              ],
            },
          ];

          const resultado = transformarPedidosParaRelatorio(pedidosAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].id).to.equal("1-p1");
          expect(resultado[0].consumidor).to.equal("Maria Silva");
          expect(resultado[0].produto).to.equal("Tomate");
          expect(resultado[0].medida).to.equal("kg");
          expect(resultado[0].valor_unitario).to.equal(4.5);
          expect(resultado[0].quantidade).to.equal(3);
          expect(resultado[0].total).to.equal(13.5);
          expect(resultado[0].ciclo).to.equal("1º Ciclo de Outubro");
        });
      });

      context("Quando não há ciclo nome", () => {
        it("Então deve usar 'Ciclo {id}' como padrão", () => {
          const pedidosAPI = [
            {
              id: "2",
              cicloId: 5,
              usuarioId: 2,
              usuario: { id: "2", nome: "João Santos" },
              status: "confirmado",
              pedidoConsumidoresProdutos: [
                {
                  id: "p2",
                  produtoId: 2,
                  produto: { id: "2", nome: "Batata", medida: "kg" },
                  quantidade: 2,
                  valorCompra: 3.0,
                },
              ],
            },
          ];

          const resultado = transformarPedidosParaRelatorio(pedidosAPI);
          expect(resultado[0].ciclo).to.equal("Ciclo 5");
        });
      });

      context("Quando não há valorCompra", () => {
        it("Então deve usar valorOferta", () => {
          const pedidosAPI = [
            {
              id: "3",
              cicloId: 1,
              usuarioId: 3,
              usuario: { id: "3", nome: "Ana Costa" },
              status: "confirmado",
              pedidoConsumidoresProdutos: [
                {
                  id: "p3",
                  produtoId: 3,
                  produto: { id: "3", nome: "Alface", medida: "un" },
                  quantidade: 5,
                  valorOferta: 2.5,
                },
              ],
            },
          ];

          const resultado = transformarPedidosParaRelatorio(pedidosAPI);
          expect(resultado[0].valor_unitario).to.equal(2.5);
          expect(resultado[0].total).to.equal(12.5);
        });
      });

      context("Quando o pedido tem múltiplos produtos", () => {
        it("Então deve transformar todos os produtos", () => {
          const pedidosAPI = [
            {
              id: "4",
              cicloId: 1,
              usuarioId: 4,
              usuario: { id: "4", nome: "Pedro Lima" },
              status: "confirmado",
              pedidoConsumidoresProdutos: [
                {
                  id: "p4",
                  produtoId: 4,
                  produto: { id: "4", nome: "Tomate", medida: "kg" },
                  quantidade: 2,
                  valorCompra: 4.0,
                },
                {
                  id: "p5",
                  produtoId: 5,
                  produto: { id: "5", nome: "Cebola", medida: "kg" },
                  quantidade: 1,
                  valorCompra: 3.0,
                },
              ],
            },
          ];

          const resultado = transformarPedidosParaRelatorio(pedidosAPI);
          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].produto).to.equal("Tomate");
          expect(resultado[1].produto).to.equal("Cebola");
        });
      });

      context("Quando a lista está vazia", () => {
        it("Então deve retornar array vazio", () => {
          const resultado = transformarPedidosParaRelatorio([]);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("consolidarPedidosPorConsumidor", () => {
    context("Dado pedidos de múltiplos consumidores", () => {
      context("Quando há pedidos de 2 consumidores", () => {
        it("Então deve consolidar por consumidor", () => {
          const pedidosAPI = [
            {
              id: "1",
              usuarioId: 1,
              usuario: { id: "1", nome: "Maria Silva" },
              pedidoConsumidoresProdutos: [
                {
                  id: "p1",
                  produtoId: 1,
                  produto: { id: "1", nome: "Tomate" },
                  quantidade: 3,
                  valorCompra: 5.0,
                },
                {
                  id: "p2",
                  produtoId: 2,
                  produto: { id: "2", nome: "Batata" },
                  quantidade: 2,
                  valorCompra: 3.0,
                },
              ],
            },
            {
              id: "2",
              usuarioId: 2,
              usuario: { id: "2", nome: "João Santos" },
              pedidoConsumidoresProdutos: [
                {
                  id: "p3",
                  produtoId: 3,
                  produto: { id: "3", nome: "Alface" },
                  quantidade: 4,
                  valorCompra: 2.0,
                },
              ],
            },
          ];

          const consolidado = consolidarPedidosPorConsumidor(pedidosAPI);

          expect(consolidado.size).to.equal(2);
          expect(consolidado.get("Maria Silva").total).to.equal(21);
          expect(consolidado.get("Maria Silva").quantidadeItens).to.equal(2);
          expect(consolidado.get("João Santos").total).to.equal(8);
          expect(consolidado.get("João Santos").quantidadeItens).to.equal(1);
        });
      });
    });
  });

  describe("calcularResumoConsolidadoPedidos", () => {
    context("Dado uma lista de pedidos", () => {
      context("Quando há múltiplos pedidos", () => {
        it("Então deve calcular resumo corretamente", () => {
          const pedidos = [
            {
              id: "1",
              consumidor: "Maria Silva",
              produto: "Tomate",
              fornecedor: "Sítio Verde",
              medida: "kg",
              valor_unitario: 5.0,
              quantidade: 3,
              total: 15.0,
              ciclo: "Ciclo 1",
              agricultura_familiar: true,
              certificacao: "organico",
            },
            {
              id: "2",
              consumidor: "João Santos",
              produto: "Batata",
              fornecedor: "Fazenda ABC",
              medida: "kg",
              valor_unitario: 3.0,
              quantidade: 2,
              total: 6.0,
              ciclo: "Ciclo 1",
              agricultura_familiar: true,
              certificacao: "convencional",
            },
            {
              id: "3",
              consumidor: "Maria Silva",
              produto: "Alface",
              fornecedor: "Horta Orgânica",
              medida: "un",
              valor_unitario: 2.0,
              quantidade: 5,
              total: 10.0,
              ciclo: "Ciclo 1",
              agricultura_familiar: true,
              certificacao: "transicao",
            },
          ];

          const resumo = calcularResumoConsolidadoPedidos(pedidos);

          expect(resumo.totalConsumidores).to.equal(2);
          expect(resumo.totalKg).to.equal(5);
          expect(resumo.valorTotal).to.equal(31.0);
          expect(resumo.quantidadeRegistros).to.equal(3);
        });
      });

      context("Quando a lista está vazia", () => {
        it("Então deve retornar zeros", () => {
          const resumo = calcularResumoConsolidadoPedidos([]);
          expect(resumo.totalConsumidores).to.equal(0);
          expect(resumo.totalKg).to.equal(0);
          expect(resumo.valorTotal).to.equal(0);
          expect(resumo.quantidadeRegistros).to.equal(0);
        });
      });
    });
  });

  describe("filtrarPedidos", () => {
    const pedidos = [
      {
        id: "1",
        consumidor: "Maria Silva",
        produto: "Tomate",
        fornecedor: "Sítio Verde",
        medida: "kg",
        valor_unitario: 5.0,
        quantidade: 3,
        total: 15.0,
        ciclo: "1º Ciclo",
        agricultura_familiar: true,
        certificacao: "organico",
      },
      {
        id: "2",
        consumidor: "João Santos",
        produto: "Batata",
        fornecedor: "Fazenda ABC",
        medida: "kg",
        valor_unitario: 3.0,
        quantidade: 2,
        total: 6.0,
        ciclo: "2º Ciclo",
        agricultura_familiar: false,
        certificacao: "convencional",
      },
      {
        id: "3",
        consumidor: "Ana Costa",
        produto: "Alface",
        fornecedor: "Horta Orgânica",
        medida: "un",
        valor_unitario: 2.0,
        quantidade: 5,
        total: 10.0,
        ciclo: "1º Ciclo",
        agricultura_familiar: true,
        certificacao: "transicao",
      },
    ];

    context("Quando filtrado por termo de busca", () => {
      it("Então deve retornar pedidos que contém o termo no consumidor", () => {
        const resultado = filtrarPedidos(pedidos, { searchTerm: "Maria" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].consumidor).to.equal("Maria Silva");
      });

      it("Então deve retornar pedidos que contém o termo no produto", () => {
        const resultado = filtrarPedidos(pedidos, { searchTerm: "Batata" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].produto).to.equal("Batata");
      });

      it("Então deve retornar pedidos que contém o termo no ciclo", () => {
        const resultado = filtrarPedidos(pedidos, { searchTerm: "2º" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].ciclo).to.equal("2º Ciclo");
      });
    });

    context("Quando filtrado por agricultura familiar", () => {
      it("Então deve retornar apenas agricultura familiar", () => {
        const resultado = filtrarPedidos(pedidos, { agriculturaFamiliar: "sim" });
        expect(resultado).to.have.lengthOf(2);
        expect(resultado.every((p) => p.agricultura_familiar)).to.be.true;
      });

      it("Então deve retornar apenas não agricultura familiar", () => {
        const resultado = filtrarPedidos(pedidos, { agriculturaFamiliar: "nao" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].agricultura_familiar).to.be.false;
      });
    });

    context("Quando filtrado por certificação", () => {
      it("Então deve retornar apenas orgânicos", () => {
        const resultado = filtrarPedidos(pedidos, { certificacao: "organico" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].certificacao).to.equal("organico");
      });

      it("Então deve retornar apenas transição", () => {
        const resultado = filtrarPedidos(pedidos, { certificacao: "transicao" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].certificacao).to.equal("transicao");
      });

      it("Então deve retornar apenas convencionais", () => {
        const resultado = filtrarPedidos(pedidos, { certificacao: "convencional" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].certificacao).to.equal("convencional");
      });
    });

    context("Quando filtros combinados", () => {
      it("Então deve aplicar todos os filtros", () => {
        const resultado = filtrarPedidos(pedidos, {
          searchTerm: "1º",
          agriculturaFamiliar: "sim",
          certificacao: "organico",
        });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].consumidor).to.equal("Maria Silva");
      });
    });

    context("Quando sem filtros", () => {
      it("Então deve retornar todos os pedidos", () => {
        const resultado = filtrarPedidos(pedidos, {});
        expect(resultado).to.have.lengthOf(3);
      });
    });
  });

  describe("ordenarPedidos", () => {
    const pedidos = [
      {
        id: "1",
        consumidor: "Maria Silva",
        produto: "Tomate",
        fornecedor: "Sítio Verde",
        medida: "kg",
        valor_unitario: 5.0,
        quantidade: 3,
        total: 15.0,
        ciclo: "Ciclo 1",
        agricultura_familiar: true,
        certificacao: "organico",
      },
      {
        id: "2",
        consumidor: "João Santos",
        produto: "Batata",
        fornecedor: "Fazenda ABC",
        medida: "kg",
        valor_unitario: 3.0,
        quantidade: 2,
        total: 6.0,
        ciclo: "Ciclo 1",
        agricultura_familiar: false,
        certificacao: "convencional",
      },
      {
        id: "3",
        consumidor: "Ana Costa",
        produto: "Alface",
        fornecedor: "Horta Orgânica",
        medida: "un",
        valor_unitario: 2.0,
        quantidade: 5,
        total: 10.0,
        ciclo: "Ciclo 1",
        agricultura_familiar: true,
        certificacao: "transicao",
      },
    ];

    context("Quando ordenado por fornecedor ascendente", () => {
      it("Então deve ordenar A-Z", () => {
        const resultado = ordenarPedidos(pedidos, "fornecedor", "asc");
        expect(resultado[0].fornecedor).to.equal("Fazenda ABC");
        expect(resultado[1].fornecedor).to.equal("Horta Orgânica");
        expect(resultado[2].fornecedor).to.equal("Sítio Verde");
      });
    });

    context("Quando ordenado por fornecedor descendente", () => {
      it("Então deve ordenar Z-A", () => {
        const resultado = ordenarPedidos(pedidos, "fornecedor", "desc");
        expect(resultado[0].fornecedor).to.equal("Sítio Verde");
        expect(resultado[1].fornecedor).to.equal("Horta Orgânica");
        expect(resultado[2].fornecedor).to.equal("Fazenda ABC");
      });
    });

    context("Quando sortBy é null", () => {
      it("Então deve retornar ordem original", () => {
        const resultado = ordenarPedidos(pedidos, null, "asc");
        expect(resultado[0].fornecedor).to.equal("Sítio Verde");
        expect(resultado[1].fornecedor).to.equal("Fazenda ABC");
        expect(resultado[2].fornecedor).to.equal("Horta Orgânica");
      });
    });
  });
});
