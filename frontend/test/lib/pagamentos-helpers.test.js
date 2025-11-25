const {
  filtrarCiclosFinalizados,
  calcularTotaisCiclos,
  todosOsCiclosFinalizados,
  formatarValorMonetario,
  parseValorMonetario,
  validarValorPagamento,
  filtrarPagamentosPorTipo,
  filtrarPagamentosPorStatus,
  calcularTotalPagamentos,
  contarPagamentosPorStatus,
  validarDataPagamento,
  agruparPagamentosPorCiclo,
  obterPagamentosPendentes,
} = require("../../src/lib/pagamentos-helpers");

describe("pagamentos-helpers", () => {
  describe("filtrarCiclosFinalizados", () => {
    context("Given um array de ciclos", () => {
      context("When há ciclos finalizados e ativos", () => {
        it("Then retorna apenas ciclos finalizados", () => {
          const ciclos = [
            { id: "1", nome: "Ciclo 1", status: "Finalizado" },
            { id: "2", nome: "Ciclo 2", status: "Ativo" },
            { id: "3", nome: "Ciclo 3", status: "Finalizado" },
          ];

          const resultado = filtrarCiclosFinalizados(ciclos);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
        });
      });

      context("When não há ciclos finalizados", () => {
        it("Then retorna array vazio", () => {
          const ciclos = [
            { id: "1", status: "Ativo" },
            { id: "2", status: "Pendente" },
          ];

          const resultado = filtrarCiclosFinalizados(ciclos);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("calcularTotaisCiclos", () => {
    context("Given um array de ciclos", () => {
      context("When há ciclos com fornecedores e consumidores", () => {
        it("Then retorna soma total", () => {
          const ciclos = [
            { id: "1", totalFornecedores: 10, totalConsumidores: 50 },
            { id: "2", totalFornecedores: 15, totalConsumidores: 60 },
            { id: "3", totalFornecedores: 5, totalConsumidores: 30 },
          ];

          const resultado = calcularTotaisCiclos(ciclos);

          expect(resultado.totalFornecedores).to.equal(30);
          expect(resultado.totalConsumidores).to.equal(140);
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna zeros", () => {
          const resultado = calcularTotaisCiclos([]);

          expect(resultado.totalFornecedores).to.equal(0);
          expect(resultado.totalConsumidores).to.equal(0);
        });
      });
    });
  });

  describe("todosOsCiclosFinalizados", () => {
    context("Given um array de ciclos", () => {
      context("When todos os ciclos estão finalizados", () => {
        it("Then retorna true", () => {
          const ciclos = [
            { id: "1", status: "Finalizado" },
            { id: "2", status: "Finalizado" },
          ];

          const resultado = todosOsCiclosFinalizados(ciclos);
          expect(resultado).to.be.true;
        });
      });

      context("When há ciclos não finalizados", () => {
        it("Then retorna false", () => {
          const ciclos = [
            { id: "1", status: "Finalizado" },
            { id: "2", status: "Ativo" },
          ];

          const resultado = todosOsCiclosFinalizados(ciclos);
          expect(resultado).to.be.false;
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna false", () => {
          const resultado = todosOsCiclosFinalizados([]);
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe("formatarValorMonetario", () => {
    context("Given um valor numérico", () => {
      context("When o valor tem decimais", () => {
        it("Then retorna formatado em BRL", () => {
          const resultado = formatarValorMonetario(123.45);
          expect(resultado).to.include("123,45");
          expect(resultado).to.include("R$");
        });
      });

      context("When o valor é inteiro", () => {
        it("Then retorna com dois decimais", () => {
          const resultado = formatarValorMonetario(100);
          expect(resultado).to.include("100,00");
        });
      });

      context("When o valor é zero", () => {
        it("Then retorna zero formatado", () => {
          const resultado = formatarValorMonetario(0);
          expect(resultado).to.include("0,00");
        });
      });
    });
  });

  describe("parseValorMonetario", () => {
    context("Given um valor formatado", () => {
      context("When o valor tem formato BRL", () => {
        it("Then retorna número parseado", () => {
          const resultado = parseValorMonetario("R$ 123,45");
          expect(resultado).to.equal(123.45);
        });
      });

      context("When o valor tem apenas vírgula", () => {
        it("Then retorna número parseado", () => {
          const resultado = parseValorMonetario("100,50");
          expect(resultado).to.equal(100.5);
        });
      });

      context("When o valor tem caracteres extras", () => {
        it("Then remove caracteres e parseia", () => {
          const resultado = parseValorMonetario("R$   200,00");
          expect(resultado).to.equal(200);
        });
      });
    });
  });

  describe("validarValorPagamento", () => {
    context("Given um valor de pagamento", () => {
      context("When o valor é válido e positivo", () => {
        it("Then retorna válido true", () => {
          const resultado = validarValorPagamento(100.50);

          expect(resultado.valido).to.be.true;
          expect(resultado.erro).to.be.undefined;
        });
      });

      context("When o valor é NaN", () => {
        it("Then retorna válido false com erro", () => {
          const resultado = validarValorPagamento(NaN);

          expect(resultado.valido).to.be.false;
          expect(resultado.erro).to.equal("Valor inválido");
        });
      });

      context("When o valor é negativo", () => {
        it("Then retorna válido false com erro", () => {
          const resultado = validarValorPagamento(-50);

          expect(resultado.valido).to.be.false;
          expect(resultado.erro).to.include("negativo");
        });
      });

      context("When o valor é zero", () => {
        it("Then retorna válido false com erro", () => {
          const resultado = validarValorPagamento(0);

          expect(resultado.valido).to.be.false;
          expect(resultado.erro).to.include("maior que zero");
        });
      });
    });
  });

  describe("filtrarPagamentosPorTipo", () => {
    context("Given um array de pagamentos", () => {
      const pagamentos = [
        { id: "1", tipo: "Fornecedor", valorTotal: 100 },
        { id: "2", tipo: "Consumidor", valorTotal: 50 },
        { id: "3", tipo: "Fornecedor", valorTotal: 200 },
      ];

      context("When filtra por Fornecedor", () => {
        it("Then retorna apenas pagamentos de fornecedores", () => {
          const resultado = filtrarPagamentosPorTipo(pagamentos, "Fornecedor");

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
        });
      });

      context("When filtra por Consumidor", () => {
        it("Then retorna apenas pagamentos de consumidores", () => {
          const resultado = filtrarPagamentosPorTipo(
            pagamentos,
            "Consumidor",
          );

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].id).to.equal("2");
        });
      });
    });
  });

  describe("filtrarPagamentosPorStatus", () => {
    context("Given um array de pagamentos", () => {
      const pagamentos = [
        { id: "1", status: "A receber" },
        { id: "2", status: "Pago" },
        { id: "3", status: "A receber" },
        { id: "4", status: "Cancelado" },
      ];

      context("When filtra por 'A receber'", () => {
        it("Then retorna apenas pagamentos a receber", () => {
          const resultado = filtrarPagamentosPorStatus(pagamentos, "A receber");

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
        });
      });

      context("When filtra por 'Pago'", () => {
        it("Then retorna apenas pagamentos pagos", () => {
          const resultado = filtrarPagamentosPorStatus(pagamentos, "Pago");

          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].id).to.equal("2");
        });
      });
    });
  });

  describe("calcularTotalPagamentos", () => {
    context("Given um array de pagamentos", () => {
      context("When há pagamentos", () => {
        it("Then retorna soma total dos valores", () => {
          const pagamentos = [
            { id: "1", valorTotal: 100.0 },
            { id: "2", valorTotal: 50.5 },
            { id: "3", valorTotal: 200.75 },
          ];

          const resultado = calcularTotalPagamentos(pagamentos);
          expect(resultado).to.be.closeTo(351.25, 0.01);
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna zero", () => {
          const resultado = calcularTotalPagamentos([]);
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe("contarPagamentosPorStatus", () => {
    context("Given um array de pagamentos", () => {
      context("When há pagamentos com diferentes status", () => {
        it("Then retorna contagem por status", () => {
          const pagamentos = [
            { id: "1", status: "A receber" },
            { id: "2", status: "A pagar" },
            { id: "3", status: "Pago" },
            { id: "4", status: "A receber" },
            { id: "5", status: "Cancelado" },
            { id: "6", status: "Pago" },
          ];

          const resultado = contarPagamentosPorStatus(pagamentos);

          expect(resultado.aReceber).to.equal(2);
          expect(resultado.aPagar).to.equal(1);
          expect(resultado.pago).to.equal(2);
          expect(resultado.cancelado).to.equal(1);
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna todas contagens zero", () => {
          const resultado = contarPagamentosPorStatus([]);

          expect(resultado.aReceber).to.equal(0);
          expect(resultado.aPagar).to.equal(0);
          expect(resultado.pago).to.equal(0);
          expect(resultado.cancelado).to.equal(0);
        });
      });
    });
  });

  describe("validarDataPagamento", () => {
    context("Given uma data de pagamento", () => {
      context("When a data está vazia", () => {
        it("Then retorna válido true (data opcional)", () => {
          const resultado = validarDataPagamento("");

          expect(resultado.valido).to.be.true;
          expect(resultado.erro).to.be.undefined;
        });
      });

      context("When a data é inválida", () => {
        it("Then retorna válido false com erro", () => {
          const resultado = validarDataPagamento("data-invalida");

          expect(resultado.valido).to.be.false;
          expect(resultado.erro).to.equal("Data inválida");
        });
      });

      context("When a data é futura", () => {
        it("Then retorna válido false com erro", () => {
          const amanha = new Date();
          amanha.setDate(amanha.getDate() + 1);
          const dataFutura = amanha.toISOString().split("T")[0];

          const resultado = validarDataPagamento(dataFutura);

          expect(resultado.valido).to.be.false;
          expect(resultado.erro).to.include("futura");
        });
      });

      context("When a data é passada", () => {
        it("Then retorna válido true", () => {
          const resultado = validarDataPagamento("2025-01-01");

          expect(resultado.valido).to.be.true;
          expect(resultado.erro).to.be.undefined;
        });
      });
    });
  });

  describe("agruparPagamentosPorCiclo", () => {
    context("Given um array de pagamentos", () => {
      context("When há pagamentos de diferentes ciclos", () => {
        it("Then retorna agrupados por ciclo", () => {
          const pagamentos = [
            { id: "1", ciclo: "Ciclo 1", nome: "Pag 1" },
            { id: "2", ciclo: "Ciclo 2", nome: "Pag 2" },
            { id: "3", ciclo: "Ciclo 1", nome: "Pag 3" },
            { id: "4", ciclo: "Ciclo 2", nome: "Pag 4" },
          ];

          const resultado = agruparPagamentosPorCiclo(pagamentos);

          expect(resultado["Ciclo 1"]).to.have.lengthOf(2);
          expect(resultado["Ciclo 2"]).to.have.lengthOf(2);
          expect(resultado["Ciclo 1"][0].id).to.equal("1");
          expect(resultado["Ciclo 1"][1].id).to.equal("3");
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna objeto vazio", () => {
          const resultado = agruparPagamentosPorCiclo([]);
          expect(Object.keys(resultado)).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("obterPagamentosPendentes", () => {
    context("Given um array de pagamentos", () => {
      context("When há pagamentos pendentes", () => {
        it("Then retorna apenas A receber e A pagar", () => {
          const pagamentos = [
            { id: "1", status: "A receber" },
            { id: "2", status: "Pago" },
            { id: "3", status: "A pagar" },
            { id: "4", status: "Cancelado" },
            { id: "5", status: "A receber" },
          ];

          const resultado = obterPagamentosPendentes(pagamentos);

          expect(resultado).to.have.lengthOf(3);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
          expect(resultado[2].id).to.equal("5");
        });
      });

      context("When não há pagamentos pendentes", () => {
        it("Then retorna array vazio", () => {
          const pagamentos = [
            { id: "1", status: "Pago" },
            { id: "2", status: "Cancelado" },
          ];

          const resultado = obterPagamentosPendentes(pagamentos);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });
});
