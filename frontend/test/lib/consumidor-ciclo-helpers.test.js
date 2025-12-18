const {
  formatarDataBR,
  filtrarCiclosAtivos,
  ordenarCiclosPorData,
  obterCiclosDisponiveisParaConsumidor,
  formatarPeriodoOfertas,
  validarCicloDisponivel,
} = require("../../src/lib/consumidor-ciclo-helpers");

describe("consumidor-ciclo-helpers", () => {
  describe("formatarDataBR", () => {
    context("Given uma data em formato ISO", () => {
      context("When a data é válida", () => {
        it("Then retorna data formatada em pt-BR (dd/mm/yyyy)", () => {
          const resultado = formatarDataBR("2025-11-25T12:00:00Z");
          expect(resultado).to.match(/25\/11\/2025|24\/11\/2025/);
        });
      });

      context("When a data tem hora", () => {
        it("Then retorna apenas a data formatada", () => {
          const resultado = formatarDataBR("2025-11-25T14:30:00");
          expect(resultado).to.equal("25/11/2025");
        });
      });

      context("When a data está vazia", () => {
        it("Then retorna string vazia", () => {
          const resultado = formatarDataBR("");
          expect(resultado).to.equal("");
        });
      });

      context("When a data é null", () => {
        it("Then retorna string vazia", () => {
          const resultado = formatarDataBR(null);
          expect(resultado).to.equal("");
        });
      });
    });
  });

  describe("filtrarCiclosAtivos", () => {
    context("Given um array de ciclos", () => {
      context("When há ciclos com status 'oferta'", () => {
        it("Then retorna apenas ciclos ativos", () => {
          const ciclos = [
            { id: "1", status: "oferta", nome: "Ciclo 1" },
            { id: "2", status: "fechado", nome: "Ciclo 2" },
            { id: "3", status: "oferta", nome: "Ciclo 3" },
            { id: "4", status: "pendente", nome: "Ciclo 4" },
          ];

          const resultado = filtrarCiclosAtivos(ciclos);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
        });
      });

      context("When nenhum ciclo tem status 'oferta'", () => {
        it("Then retorna array vazio", () => {
          const ciclos = [
            { id: "1", status: "fechado", nome: "Ciclo 1" },
            { id: "2", status: "pendente", nome: "Ciclo 2" },
          ];

          const resultado = filtrarCiclosAtivos(ciclos);
          expect(resultado).to.have.lengthOf(0);
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna array vazio", () => {
          const resultado = filtrarCiclosAtivos([]);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("ordenarCiclosPorData", () => {
    context("Given um array de ciclos com datas", () => {
      context("When ordem é 'desc' (padrão)", () => {
        it("Then retorna ciclos ordenados do mais recente ao mais antigo", () => {
          const ciclos = [
            { id: "1", ofertaInicio: "2025-11-01", nome: "Ciclo 1" },
            { id: "2", ofertaInicio: "2025-11-15", nome: "Ciclo 2" },
            { id: "3", ofertaInicio: "2025-10-20", nome: "Ciclo 3" },
          ];

          const resultado = ordenarCiclosPorData(ciclos);

          expect(resultado).to.have.lengthOf(3);
          expect(resultado[0].id).to.equal("2"); // 2025-11-15
          expect(resultado[1].id).to.equal("1"); // 2025-11-01
          expect(resultado[2].id).to.equal("3"); // 2025-10-20
        });
      });

      context("When ordem é 'asc'", () => {
        it("Then retorna ciclos ordenados do mais antigo ao mais recente", () => {
          const ciclos = [
            { id: "1", ofertaInicio: "2025-11-01", nome: "Ciclo 1" },
            { id: "2", ofertaInicio: "2025-11-15", nome: "Ciclo 2" },
            { id: "3", ofertaInicio: "2025-10-20", nome: "Ciclo 3" },
          ];

          const resultado = ordenarCiclosPorData(ciclos, "asc");

          expect(resultado[0].id).to.equal("3"); // 2025-10-20
          expect(resultado[1].id).to.equal("1"); // 2025-11-01
          expect(resultado[2].id).to.equal("2"); // 2025-11-15
        });
      });

      context("When o array original não deve ser modificado", () => {
        it("Then retorna novo array sem modificar o original", () => {
          const ciclos = [
            { id: "1", ofertaInicio: "2025-11-01" },
            { id: "2", ofertaInicio: "2025-11-15" },
          ];

          const resultado = ordenarCiclosPorData(ciclos);

          expect(ciclos[0].id).to.equal("1");
          expect(resultado[0].id).to.equal("2");
        });
      });
    });
  });

  describe("obterCiclosDisponiveisParaConsumidor", () => {
    context("Given um array de ciclos com diferentes status", () => {
      context("When há ciclos ativos", () => {
        it("Then retorna apenas ciclos com status 'oferta' ordenados por data desc", () => {
          const ciclos = [
            {
              id: "1",
              status: "oferta",
              ofertaInicio: "2025-11-01",
              nome: "Ciclo 1",
            },
            {
              id: "2",
              status: "fechado",
              ofertaInicio: "2025-11-15",
              nome: "Ciclo 2",
            },
            {
              id: "3",
              status: "oferta",
              ofertaInicio: "2025-11-20",
              nome: "Ciclo 3",
            },
            {
              id: "4",
              status: "pendente",
              ofertaInicio: "2025-11-10",
              nome: "Ciclo 4",
            },
          ];

          const resultado = obterCiclosDisponiveisParaConsumidor(ciclos);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("3"); // mais recente
          expect(resultado[1].id).to.equal("1"); // mais antigo
        });
      });

      context("When não há ciclos ativos", () => {
        it("Then retorna array vazio", () => {
          const ciclos = [
            { id: "1", status: "fechado", ofertaInicio: "2025-11-01" },
            { id: "2", status: "pendente", ofertaInicio: "2025-11-15" },
          ];

          const resultado = obterCiclosDisponiveisParaConsumidor(ciclos);
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("formatarPeriodoOfertas", () => {
    context("Given datas de início e fim", () => {
      context("When ambas as datas são válidas", () => {
        it("Then retorna período formatado com travessão", () => {
          const resultado = formatarPeriodoOfertas(
            "2025-11-01T12:00:00Z",
            "2025-11-15T12:00:00Z",
          );
          expect(resultado).to.include("–");
          expect(resultado).to.include("/11/2025");
        });
      });

      context("When as datas estão vazias", () => {
        it("Then retorna travessão com espaços vazios", () => {
          const resultado = formatarPeriodoOfertas("", "");
          expect(resultado).to.equal(" – ");
        });
      });
    });
  });

  describe("validarCicloDisponivel", () => {
    context("Given um ciclo", () => {
      context("When o ciclo não tem status", () => {
        it("Then retorna indisponível com motivo", () => {
          const ciclo = {
            id: "1",
            status: null,
            ofertaInicio: "2025-11-01",
            ofertaFim: "2025-11-15",
          };

          const resultado = validarCicloDisponivel(ciclo);

          expect(resultado.disponivel).to.be.false;
          expect(resultado.motivo).to.equal("Ciclo sem status definido");
        });
      });

      context("When o status não é 'oferta'", () => {
        it("Then retorna indisponível com motivo", () => {
          const ciclo = {
            id: "1",
            status: "fechado",
            ofertaInicio: "2025-11-01",
            ofertaFim: "2025-11-15",
          };

          const resultado = validarCicloDisponivel(ciclo);

          expect(resultado.disponivel).to.be.false;
          expect(resultado.motivo).to.equal(
            "Ciclo não está em período de ofertas",
          );
        });
      });

      context("When o período ainda não iniciou", () => {
        it("Then retorna indisponível com motivo", () => {
          const amanha = new Date();
          amanha.setDate(amanha.getDate() + 1);
          const futuro = new Date();
          futuro.setDate(futuro.getDate() + 15);

          const ciclo = {
            id: "1",
            status: "oferta",
            ofertaInicio: amanha.toISOString().split("T")[0],
            ofertaFim: futuro.toISOString().split("T")[0],
          };

          const resultado = validarCicloDisponivel(ciclo);

          expect(resultado.disponivel).to.be.false;
          expect(resultado.motivo).to.equal(
            "Período de ofertas ainda não iniciou",
          );
        });
      });

      context("When o período já encerrou", () => {
        it("Then retorna indisponível com motivo", () => {
          const ciclo = {
            id: "1",
            status: "oferta",
            ofertaInicio: "2025-10-01",
            ofertaFim: "2025-10-15",
          };

          const resultado = validarCicloDisponivel(ciclo);

          expect(resultado.disponivel).to.be.false;
          expect(resultado.motivo).to.equal("Período de ofertas já encerrou");
        });
      });

      context("When o ciclo está em período válido", () => {
        it("Then retorna disponível", () => {
          const hoje = new Date();
          const ontem = new Date();
          ontem.setDate(ontem.getDate() - 1);
          const amanha = new Date();
          amanha.setDate(amanha.getDate() + 1);

          const ciclo = {
            id: "1",
            status: "oferta",
            ofertaInicio: ontem.toISOString().split("T")[0],
            ofertaFim: amanha.toISOString().split("T")[0],
          };

          const resultado = validarCicloDisponivel(ciclo);

          expect(resultado.disponivel).to.be.true;
          expect(resultado.motivo).to.be.undefined;
        });
      });
    });
  });
});
