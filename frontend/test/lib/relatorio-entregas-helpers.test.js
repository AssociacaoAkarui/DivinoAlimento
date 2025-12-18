const {
  filtrarEntregas,
  ordenarEntregas,
  ordenarEntregasPorData,
  calcularTotaisEntregas,
  filtrarCiclosActivos,
  formatarCertificacao,
  formatarAgriculturaFamiliar,
} = require("../../src/lib/relatorio-entregas-helpers.ts");

describe("Relatório Entregas Helpers", function () {
  describe("filtrarEntregas", function () {
    const entregas = [
      {
        id: "1",
        fornecedor: "Fazenda Verde",
        produto: "Tomate",
        unidade_medida: "kg",
        valor_unitario: 5.5,
        quantidade_entregue: 120,
        valor_total: 660.0,
        agricultura_familiar: true,
        certificacao: "organico",
      },
      {
        id: "2",
        fornecedor: "Sítio do Sol",
        produto: "Cenoura",
        unidade_medida: "kg",
        valor_unitario: 4.0,
        quantidade_entregue: 80,
        valor_total: 320.0,
        agricultura_familiar: false,
        certificacao: "convencional",
      },
      {
        id: "3",
        fornecedor: "Horta Orgânica",
        produto: "Alface",
        unidade_medida: "maço",
        valor_unitario: 3.5,
        quantidade_entregue: 150,
        valor_total: 525.0,
        agricultura_familiar: true,
        certificacao: "transicao",
      },
    ];

    context("Dado uma lista de entregas", function () {
      context("Quando filtro por busca de fornecedor", function () {
        it("Então deve retornar entregas do fornecedor", function () {
          const result = filtrarEntregas(entregas, { busca: "Verde" });

          expect(result).to.have.lengthOf(1);
          expect(result[0].fornecedor).to.equal("Fazenda Verde");
        });
      });

      context("Quando filtro por busca de produto", function () {
        it("Então deve retornar entregas do produto", function () {
          const result = filtrarEntregas(entregas, { busca: "tomate" });

          expect(result).to.have.lengthOf(1);
          expect(result[0].produto).to.equal("Tomate");
        });
      });

      context("Quando filtro por agricultura familiar sim", function () {
        it("Então deve retornar apenas agricultores familiares", function () {
          const result = filtrarEntregas(entregas, {
            agriculturaFamiliar: "sim",
          });

          expect(result).to.have.lengthOf(2);
          expect(result.every((e) => e.agricultura_familiar)).to.be.true;
        });
      });

      context("Quando filtro por agricultura familiar não", function () {
        it("Então deve retornar apenas não familiares", function () {
          const result = filtrarEntregas(entregas, {
            agriculturaFamiliar: "nao",
          });

          expect(result).to.have.lengthOf(1);
          expect(result[0].agricultura_familiar).to.be.false;
        });
      });

      context("Quando filtro por certificação orgânico", function () {
        it("Então deve retornar apenas orgânicos", function () {
          const result = filtrarEntregas(entregas, {
            certificacao: "organico",
          });

          expect(result).to.have.lengthOf(1);
          expect(result[0].certificacao).to.equal("organico");
        });
      });

      context("Quando filtro por certificação transição", function () {
        it("Então deve retornar apenas em transição", function () {
          const result = filtrarEntregas(entregas, {
            certificacao: "transicao",
          });

          expect(result).to.have.lengthOf(1);
          expect(result[0].certificacao).to.equal("transicao");
        });
      });

      context("Quando filtro por múltiplos critérios", function () {
        it("Então deve aplicar todos os filtros", function () {
          const result = filtrarEntregas(entregas, {
            agriculturaFamiliar: "sim",
            certificacao: "organico",
          });

          expect(result).to.have.lengthOf(1);
          expect(result[0].fornecedor).to.equal("Fazenda Verde");
        });
      });

      context("Quando filtro com todos", function () {
        it("Então deve retornar todas as entregas", function () {
          const result = filtrarEntregas(entregas, {
            agriculturaFamiliar: "todos",
            certificacao: "todos",
          });

          expect(result).to.have.lengthOf(3);
        });
      });

      context("Quando busca não encontra resultados", function () {
        it("Então deve retornar array vazio", function () {
          const result = filtrarEntregas(entregas, { busca: "xyz" });

          expect(result).to.be.empty;
        });
      });
    });
  });

  describe("ordenarEntregas", function () {
    const entregas = [
      {
        id: "1",
        fornecedor: "Sítio do Sol",
        produto: "Cenoura",
        unidade_medida: "kg",
        valor_unitario: 4.0,
        quantidade_entregue: 80,
        valor_total: 320.0,
      },
      {
        id: "2",
        fornecedor: "Fazenda Verde",
        produto: "Tomate",
        unidade_medida: "kg",
        valor_unitario: 5.5,
        quantidade_entregue: 120,
        valor_total: 660.0,
      },
      {
        id: "3",
        fornecedor: "Horta Orgânica",
        produto: "Alface",
        unidade_medida: "maço",
        valor_unitario: 3.5,
        quantidade_entregue: 150,
        valor_total: 525.0,
      },
    ];

    context("Dado uma lista de entregas", function () {
      context("Quando ordeno ascendente", function () {
        it("Então deve ordenar de A-Z", function () {
          const result = ordenarEntregas(entregas, "asc");

          expect(result[0].fornecedor).to.equal("Fazenda Verde");
          expect(result[1].fornecedor).to.equal("Horta Orgânica");
          expect(result[2].fornecedor).to.equal("Sítio do Sol");
        });
      });

      context("Quando ordeno descendente", function () {
        it("Então deve ordenar de Z-A", function () {
          const result = ordenarEntregas(entregas, "desc");

          expect(result[0].fornecedor).to.equal("Sítio do Sol");
          expect(result[1].fornecedor).to.equal("Horta Orgânica");
          expect(result[2].fornecedor).to.equal("Fazenda Verde");
        });
      });

      context("Quando entregas têm fornecedor vazio", function () {
        it("Então deve tratar como string vazia", function () {
          const entregasComVazio = [
            { ...entregas[0] },
            { ...entregas[1], fornecedor: undefined },
          ];

          const result = ordenarEntregas(entregasComVazio, "asc");

          expect(result).to.have.lengthOf(2);
        });
      });
    });
  });

  describe("ordenarEntregasPorData", function () {
    const entregas = [
      {
        id: "1",
        produto: "Tomate",
        unidade_medida: "kg",
        valor_unitario: 5.5,
        quantidade_entregue: 120,
        valor_total: 660.0,
        data_hora_entrega: "15/11/2025 14:00",
      },
      {
        id: "2",
        produto: "Cenoura",
        unidade_medida: "kg",
        valor_unitario: 4.0,
        quantidade_entregue: 80,
        valor_total: 320.0,
        data_hora_entrega: "17/11/2025 09:30",
      },
      {
        id: "3",
        produto: "Alface",
        unidade_medida: "maço",
        valor_unitario: 3.5,
        quantidade_entregue: 150,
        valor_total: 525.0,
        data_hora_entrega: "13/11/2025 08:00",
      },
    ];

    context("Dado uma lista de entregas com datas", function () {
      context("Quando ordeno por urgente", function () {
        it("Então deve ordenar da mais próxima para a mais distante", function () {
          const result = ordenarEntregasPorData(entregas, "urgente");

          expect(result[0].data_hora_entrega).to.equal("13/11/2025 08:00");
          expect(result[1].data_hora_entrega).to.equal("15/11/2025 14:00");
          expect(result[2].data_hora_entrega).to.equal("17/11/2025 09:30");
        });
      });

      context("Quando ordeno por antiga", function () {
        it("Então deve ordenar da mais distante para a mais próxima", function () {
          const result = ordenarEntregasPorData(entregas, "antiga");

          expect(result[0].data_hora_entrega).to.equal("17/11/2025 09:30");
          expect(result[1].data_hora_entrega).to.equal("15/11/2025 14:00");
          expect(result[2].data_hora_entrega).to.equal("13/11/2025 08:00");
        });
      });

      context("Quando entregas não têm data", function () {
        it("Então deve manter ordem original", function () {
          const entregasSemData = [
            { ...entregas[0], data_hora_entrega: undefined },
            { ...entregas[1], data_hora_entrega: undefined },
          ];

          const result = ordenarEntregasPorData(entregasSemData, "urgente");

          expect(result).to.have.lengthOf(2);
        });
      });
    });
  });

  describe("calcularTotaisEntregas", function () {
    const entregas = [
      {
        id: "1",
        produto: "Tomate",
        unidade_medida: "kg",
        valor_unitario: 5.5,
        quantidade_entregue: 120,
        valor_total: 660.0,
      },
      {
        id: "2",
        produto: "Cenoura",
        unidade_medida: "kg",
        valor_unitario: 4.0,
        quantidade_entregue: 80,
        valor_total: 320.0,
      },
    ];

    context("Dado uma lista de entregas", function () {
      context("Quando calculo os totais", function () {
        it("Então deve somar quantidades, valores e contar itens", function () {
          const result = calcularTotaisEntregas(entregas);

          expect(result.totalQuantidade).to.equal(200);
          expect(result.valorTotal).to.equal(980.0);
          expect(result.totalItens).to.equal(2);
        });
      });

      context("Quando lista está vazia", function () {
        it("Então deve retornar totais zerados", function () {
          const result = calcularTotaisEntregas([]);

          expect(result.totalQuantidade).to.equal(0);
          expect(result.valorTotal).to.equal(0);
          expect(result.totalItens).to.equal(0);
        });
      });
    });
  });

  describe("filtrarCiclosActivos", function () {
    const ciclos = [
      {
        id: "1",
        nome: "1º Ciclo de Novembro 2025",
        inicio_ofertas: "2025-11-03",
        fim_ofertas: "2025-11-18",
        status: "ativo",
      },
      {
        id: "2",
        nome: "2º Ciclo de Outubro 2025",
        inicio_ofertas: "2025-10-22",
        fim_ofertas: "2025-10-30",
        status: "inativo",
      },
      {
        id: "3",
        nome: "1º Ciclo de Outubro 2025",
        inicio_ofertas: "2025-10-13",
        fim_ofertas: "2025-10-20",
        status: "ativo",
      },
    ];

    context("Dado uma lista de ciclos", function () {
      context("Quando filtro ciclos ativos", function () {
        it("Então deve retornar apenas ativos ordenados por data", function () {
          const result = filtrarCiclosActivos(ciclos);

          expect(result).to.have.lengthOf(2);
          expect(result[0].nome).to.equal("1º Ciclo de Novembro 2025");
          expect(result[1].nome).to.equal("1º Ciclo de Outubro 2025");
        });
      });

      context("Quando todos os ciclos são inativos", function () {
        it("Então deve retornar array vazio", function () {
          const ciclosInativos = ciclos.map((c) => ({
            ...c,
            status: "inativo",
          }));

          const result = filtrarCiclosActivos(ciclosInativos);

          expect(result).to.be.empty;
        });
      });

      context("Quando todos os ciclos são ativos", function () {
        it("Então deve retornar todos ordenados", function () {
          const ciclosAtivos = ciclos.map((c) => ({ ...c, status: "ativo" }));

          const result = filtrarCiclosActivos(ciclosAtivos);

          expect(result).to.have.lengthOf(3);
        });
      });
    });
  });

  describe("formatarCertificacao", function () {
    context("Dado um tipo de certificação", function () {
      context("Quando formato orgânico", function () {
        it("Então deve retornar 'Orgânico'", function () {
          const result = formatarCertificacao("organico");

          expect(result).to.equal("Orgânico");
        });
      });

      context("Quando formato transição", function () {
        it("Então deve retornar 'Transição'", function () {
          const result = formatarCertificacao("transicao");

          expect(result).to.equal("Transição");
        });
      });

      context("Quando formato convencional", function () {
        it("Então deve retornar 'Convencional'", function () {
          const result = formatarCertificacao("convencional");

          expect(result).to.equal("Convencional");
        });
      });
    });
  });

  describe("formatarAgriculturaFamiliar", function () {
    context("Dado um valor de agricultura familiar", function () {
      context("Quando é true", function () {
        it("Então deve retornar 'Agricultura Familiar'", function () {
          const result = formatarAgriculturaFamiliar(true);

          expect(result).to.equal("Agricultura Familiar");
        });
      });

      context("Quando é false", function () {
        it("Então deve retornar 'Não Familiar'", function () {
          const result = formatarAgriculturaFamiliar(false);

          expect(result).to.equal("Não Familiar");
        });
      });
    });
  });
});
