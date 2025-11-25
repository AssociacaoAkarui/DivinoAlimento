const { expect } = require("chai");
const {
  transformarOfertasParaRelatorio,
  consolidarOfertasPorFornecedor,
  calcularResumoConsolidado,
  filtrarEntregas,
  ordenarEntregas,
} = require("../../src/lib/relatorio-fornecedores-helpers.ts");

describe("UC019: Relatórios Consolidados Fornecedores - Helpers", () => {
  describe("transformarOfertasParaRelatorio", () => {
    context("Dado ofertas da API GraphQL", () => {
      context("Quando a oferta tem todos os campos", () => {
        it("Então deve transformar para formato de relatório corretamente", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fazenda Verde" },
              ciclo: { id: "1", nome: "1º Ciclo de Outubro" },
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

          const resultado = transformarOfertasParaRelatorio(ofertasAPI);

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].id).to.equal("op1");
          expect(resultado[0].fornecedor).to.equal("Fazenda Verde");
          expect(resultado[0].produto).to.equal("Tomate");
          expect(resultado[0].unidade_medida).to.equal("kg");
          expect(resultado[0].valor_unitario).to.equal(4.5);
          expect(resultado[0].quantidade_entregue).to.equal(50);
          expect(resultado[0].valor_total).to.equal(225);
          expect(resultado[0].ciclo).to.equal("1º Ciclo de Outubro");
          expect(resultado[0].agricultura_familiar).to.be.true;
          expect(resultado[0].certificacao).to.equal("convencional");
        });
      });

      context("Quando a oferta não tem ciclo nome", () => {
        it("Então deve usar 'Ciclo {id}' como padrão", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 5,
              usuarioId: 1,
              usuario: { id: "1", nome: "Sítio do Sol" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op2",
                  produtoId: 2,
                  produto: { id: "2", nome: "Batata", medida: "kg" },
                  quantidade: 30,
                  valorOferta: 3.0,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaRelatorio(ofertasAPI);
          expect(resultado[0].ciclo).to.equal("Ciclo 5");
        });
      });

      context("Quando não há valorOferta", () => {
        it("Então deve usar valorReferencia", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Horta Orgânica" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op3",
                  produtoId: 3,
                  produto: { id: "3", nome: "Alface", medida: "un" },
                  quantidade: 100,
                  valorReferencia: 2.5,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaRelatorio(ofertasAPI);
          expect(resultado[0].valor_unitario).to.equal(2.5);
          expect(resultado[0].valor_total).to.equal(250);
        });
      });

      context("Quando a oferta tem múltiplos produtos", () => {
        it("Então deve transformar todos os produtos", () => {
          const ofertasAPI = [
            {
              id: "1",
              cicloId: 1,
              usuarioId: 1,
              usuario: { id: "1", nome: "Fazenda ABC" },
              ciclo: { id: "1", nome: "Ciclo Teste" },
              status: "ativo",
              ofertaProdutos: [
                {
                  id: "op4",
                  produtoId: 4,
                  produto: { id: "4", nome: "Tomate", medida: "kg" },
                  quantidade: 50,
                  valorOferta: 4.0,
                },
                {
                  id: "op5",
                  produtoId: 5,
                  produto: { id: "5", nome: "Cebola", medida: "kg" },
                  quantidade: 30,
                  valorOferta: 3.0,
                },
              ],
            },
          ];

          const resultado = transformarOfertasParaRelatorio(ofertasAPI);
          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].produto).to.equal("Tomate");
          expect(resultado[1].produto).to.equal("Cebola");
        });
      });

      context("Quando a lista está vazia", () => {
        it("Então deve retornar array vazio", () => {
          const resultado = transformarOfertasParaRelatorio([]);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("consolidarOfertasPorFornecedor", () => {
    context("Dado ofertas de múltiplos fornecedores", () => {
      context("Quando há ofertas de 2 fornecedores", () => {
        it("Então deve consolidar por fornecedor", () => {
          const ofertasAPI = [
            {
              id: "1",
              usuarioId: 1,
              usuario: { id: "1", nome: "Fornecedor A" },
              ofertaProdutos: [
                {
                  id: "op1",
                  produtoId: 1,
                  produto: { id: "1", nome: "Tomate" },
                  quantidade: 50,
                  valorOferta: 4.0,
                },
                {
                  id: "op2",
                  produtoId: 2,
                  produto: { id: "2", nome: "Batata" },
                  quantidade: 30,
                  valorOferta: 3.0,
                },
              ],
            },
            {
              id: "2",
              usuarioId: 2,
              usuario: { id: "2", nome: "Fornecedor B" },
              ofertaProdutos: [
                {
                  id: "op3",
                  produtoId: 3,
                  produto: { id: "3", nome: "Alface" },
                  quantidade: 20,
                  valorOferta: 2.0,
                },
              ],
            },
          ];

          const consolidado = consolidarOfertasPorFornecedor(ofertasAPI);

          expect(consolidado.size).to.equal(2);
          expect(consolidado.get("Fornecedor A").total).to.equal(290);
          expect(consolidado.get("Fornecedor A").quantidadeRegistros).to.equal(2);
          expect(consolidado.get("Fornecedor B").total).to.equal(40);
          expect(consolidado.get("Fornecedor B").quantidadeRegistros).to.equal(1);
        });
      });
    });
  });

  describe("calcularResumoConsolidado", () => {
    context("Dado uma lista de entregas", () => {
      context("Quando há múltiplas entregas", () => {
        it("Então deve calcular resumo corretamente", () => {
          const entregas = [
            {
              id: "1",
              fornecedor: "Fornecedor A",
              produto: "Tomate",
              unidade_medida: "kg",
              valor_unitario: 4.0,
              quantidade_entregue: 50,
              valor_total: 200,
              ciclo: "Ciclo 1",
              agricultura_familiar: true,
              certificacao: "organico",
            },
            {
              id: "2",
              fornecedor: "Fornecedor B",
              produto: "Batata",
              unidade_medida: "kg",
              valor_unitario: 3.0,
              quantidade_entregue: 30,
              valor_total: 90,
              ciclo: "Ciclo 1",
              agricultura_familiar: true,
              certificacao: "convencional",
            },
          ];

          const resumo = calcularResumoConsolidado(entregas);

          expect(resumo.totalQuantidade).to.equal(80);
          expect(resumo.valorTotal).to.equal(290);
          expect(resumo.quantidadeRegistros).to.equal(2);
        });
      });

      context("Quando a lista está vazia", () => {
        it("Então deve retornar zeros", () => {
          const resumo = calcularResumoConsolidado([]);
          expect(resumo.totalQuantidade).to.equal(0);
          expect(resumo.valorTotal).to.equal(0);
          expect(resumo.quantidadeRegistros).to.equal(0);
        });
      });
    });
  });

  describe("filtrarEntregas", () => {
    const entregas = [
      {
        id: "1",
        fornecedor: "Fazenda Verde",
        produto: "Tomate",
        unidade_medida: "kg",
        valor_unitario: 4.0,
        quantidade_entregue: 50,
        valor_total: 200,
        ciclo: "1º Ciclo",
        agricultura_familiar: true,
        certificacao: "organico",
      },
      {
        id: "2",
        fornecedor: "Sítio do Sol",
        produto: "Batata",
        unidade_medida: "kg",
        valor_unitario: 3.0,
        quantidade_entregue: 30,
        valor_total: 90,
        ciclo: "2º Ciclo",
        agricultura_familiar: false,
        certificacao: "convencional",
      },
      {
        id: "3",
        fornecedor: "Horta Orgânica",
        produto: "Alface",
        unidade_medida: "un",
        valor_unitario: 2.0,
        quantidade_entregue: 100,
        valor_total: 200,
        ciclo: "1º Ciclo",
        agricultura_familiar: true,
        certificacao: "transicao",
      },
    ];

    context("Quando filtrado por termo de busca", () => {
      it("Então deve retornar entregas que contém o termo no fornecedor", () => {
        const resultado = filtrarEntregas(entregas, { searchTerm: "Verde" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].fornecedor).to.equal("Fazenda Verde");
      });

      it("Então deve retornar entregas que contém o termo no produto", () => {
        const resultado = filtrarEntregas(entregas, { searchTerm: "Batata" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].produto).to.equal("Batata");
      });

      it("Então deve retornar entregas que contém o termo no ciclo", () => {
        const resultado = filtrarEntregas(entregas, { searchTerm: "2º" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].ciclo).to.equal("2º Ciclo");
      });
    });

    context("Quando filtrado por agricultura familiar", () => {
      it("Então deve retornar apenas agricultura familiar", () => {
        const resultado = filtrarEntregas(entregas, { agriculturaFamiliar: "sim" });
        expect(resultado).to.have.lengthOf(2);
        expect(resultado.every((e) => e.agricultura_familiar)).to.be.true;
      });

      it("Então deve retornar apenas não agricultura familiar", () => {
        const resultado = filtrarEntregas(entregas, { agriculturaFamiliar: "nao" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].agricultura_familiar).to.be.false;
      });
    });

    context("Quando filtrado por certificação", () => {
      it("Então deve retornar apenas orgânicos", () => {
        const resultado = filtrarEntregas(entregas, { certificacao: "organico" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].certificacao).to.equal("organico");
      });

      it("Então deve retornar apenas transição", () => {
        const resultado = filtrarEntregas(entregas, { certificacao: "transicao" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].certificacao).to.equal("transicao");
      });

      it("Então deve retornar apenas convencionais", () => {
        const resultado = filtrarEntregas(entregas, { certificacao: "convencional" });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].certificacao).to.equal("convencional");
      });
    });

    context("Quando filtros combinados", () => {
      it("Então deve aplicar todos os filtros", () => {
        const resultado = filtrarEntregas(entregas, {
          searchTerm: "1º",
          agriculturaFamiliar: "sim",
          certificacao: "organico",
        });
        expect(resultado).to.have.lengthOf(1);
        expect(resultado[0].fornecedor).to.equal("Fazenda Verde");
      });
    });

    context("Quando sem filtros", () => {
      it("Então deve retornar todas as entregas", () => {
        const resultado = filtrarEntregas(entregas, {});
        expect(resultado).to.have.lengthOf(3);
      });
    });
  });

  describe("ordenarEntregas", () => {
    const entregas = [
      {
        id: "1",
        fornecedor: "Fazenda Verde",
        produto: "Tomate",
        unidade_medida: "kg",
        valor_unitario: 4.0,
        quantidade_entregue: 50,
        valor_total: 200,
        ciclo: "Ciclo 1",
        agricultura_familiar: true,
        certificacao: "organico",
      },
      {
        id: "2",
        fornecedor: "Sítio do Sol",
        produto: "Batata",
        unidade_medida: "kg",
        valor_unitario: 3.0,
        quantidade_entregue: 30,
        valor_total: 90,
        ciclo: "Ciclo 1",
        agricultura_familiar: false,
        certificacao: "convencional",
      },
      {
        id: "3",
        fornecedor: "Horta Orgânica",
        produto: "Alface",
        unidade_medida: "un",
        valor_unitario: 2.0,
        quantidade_entregue: 100,
        valor_total: 200,
        ciclo: "Ciclo 1",
        agricultura_familiar: true,
        certificacao: "transicao",
      },
    ];

    context("Quando ordenado por fornecedor ascendente", () => {
      it("Então deve ordenar A-Z", () => {
        const resultado = ordenarEntregas(entregas, "fornecedor", "asc");
        expect(resultado[0].fornecedor).to.equal("Fazenda Verde");
        expect(resultado[1].fornecedor).to.equal("Horta Orgânica");
        expect(resultado[2].fornecedor).to.equal("Sítio do Sol");
      });
    });

    context("Quando ordenado por fornecedor descendente", () => {
      it("Então deve ordenar Z-A", () => {
        const resultado = ordenarEntregas(entregas, "fornecedor", "desc");
        expect(resultado[0].fornecedor).to.equal("Sítio do Sol");
        expect(resultado[1].fornecedor).to.equal("Horta Orgânica");
        expect(resultado[2].fornecedor).to.equal("Fazenda Verde");
      });
    });

    context("Quando sortBy é null", () => {
      it("Então deve retornar ordem original", () => {
        const resultado = ordenarEntregas(entregas, null, "asc");
        expect(resultado[0].fornecedor).to.equal("Fazenda Verde");
        expect(resultado[1].fornecedor).to.equal("Sítio do Sol");
        expect(resultado[2].fornecedor).to.equal("Horta Orgânica");
      });
    });
  });
});
