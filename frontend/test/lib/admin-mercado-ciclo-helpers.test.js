const {
  filtrarCiclosPorAdmin,
  obterMercadoAtual,
  isMercadoBloqueado,
  validarLiberacaoVendaDireta,
  ordenarCiclosPorData,
  obterProximoMercadoPendente,
  contarMercadosPorStatus,
  todosOsMercadosConcluidos,
} = require("../../src/lib/admin-mercado-ciclo-helpers");

describe("admin-mercado-ciclo-helpers", () => {
  describe("filtrarCiclosPorAdmin", () => {
    context("Given um array de ciclos", () => {
      context("When há ciclos do admin especificado", () => {
        it("Then retorna apenas ciclos do admin", () => {
          const ciclos = [
            {
              id: "1",
              admin_responsavel_nome: "João Silva",
              nome: "Ciclo 1",
            },
            {
              id: "2",
              admin_responsavel_nome: "Maria Santos",
              nome: "Ciclo 2",
            },
            {
              id: "3",
              admin_responsavel_nome: "João Silva",
              nome: "Ciclo 3",
            },
          ];

          const resultado = filtrarCiclosPorAdmin(ciclos, "João Silva");

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
        });
      });

      context("When não há ciclos do admin", () => {
        it("Then retorna array vazio", () => {
          const ciclos = [
            { id: "1", admin_responsavel_nome: "Maria Santos" },
            { id: "2", admin_responsavel_nome: "Pedro Costa" },
          ];

          const resultado = filtrarCiclosPorAdmin(ciclos, "João Silva");
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("obterMercadoAtual", () => {
    context("Given um ciclo com mercados", () => {
      const ciclo = {
        id: "1",
        mercados: [
          { id: "m1", ordem: 1, status_composicao: "concluida" },
          { id: "m2", ordem: 2, status_composicao: "em_andamento" },
          { id: "m3", ordem: 3, status_composicao: "pendente" },
        ],
      };

      context("When há mercadoSelecionadoId válido", () => {
        it("Then retorna o mercado selecionado", () => {
          const resultado = obterMercadoAtual(ciclo, "m3");
          expect(resultado.id).to.equal("m3");
        });
      });

      context("When mercadoSelecionadoId não existe", () => {
        it("Then retorna mercado em_andamento", () => {
          const resultado = obterMercadoAtual(ciclo, "inexistente");
          expect(resultado.id).to.equal("m2");
        });
      });

      context("When não há mercadoSelecionadoId", () => {
        it("Then retorna mercado em_andamento", () => {
          const resultado = obterMercadoAtual(ciclo);
          expect(resultado.id).to.equal("m2");
        });
      });

      context("When não há em_andamento", () => {
        it("Then retorna mercado pendente", () => {
          const cicloSemAndamento = {
            id: "1",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "concluida" },
              { id: "m2", ordem: 2, status_composicao: "pendente" },
            ],
          };

          const resultado = obterMercadoAtual(cicloSemAndamento);
          expect(resultado.id).to.equal("m2");
        });
      });

      context("When todos concluídos", () => {
        it("Then retorna undefined", () => {
          const cicloCompleto = {
            id: "1",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "concluida" },
              { id: "m2", ordem: 2, status_composicao: "concluida" },
            ],
          };

          const resultado = obterMercadoAtual(cicloCompleto);
          expect(resultado).to.be.undefined;
        });
      });
    });
  });

  describe("isMercadoBloqueado", () => {
    context("Given um ciclo e mercado", () => {
      context("When o ciclo está inativo", () => {
        it("Then retorna true", () => {
          const ciclo = {
            id: "1",
            status: "inativo",
            mercados: [{ id: "m1", ordem: 1, status_composicao: "pendente" }],
          };

          const resultado = isMercadoBloqueado(ciclo, ciclo.mercados[0]);
          expect(resultado).to.be.true;
        });
      });

      context("When o mercado é o primeiro (ordem 1)", () => {
        it("Then retorna false", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [{ id: "m1", ordem: 1, status_composicao: "pendente" }],
          };

          const resultado = isMercadoBloqueado(ciclo, ciclo.mercados[0]);
          expect(resultado).to.be.false;
        });
      });

      context("When o mercado anterior está concluído", () => {
        it("Then retorna false", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "concluida" },
              { id: "m2", ordem: 2, status_composicao: "pendente" },
            ],
          };

          const resultado = isMercadoBloqueado(ciclo, ciclo.mercados[1]);
          expect(resultado).to.be.false;
        });
      });

      context("When o mercado anterior não está concluído", () => {
        it("Then retorna true", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "em_andamento" },
              { id: "m2", ordem: 2, status_composicao: "pendente" },
            ],
          };

          const resultado = isMercadoBloqueado(ciclo, ciclo.mercados[1]);
          expect(resultado).to.be.true;
        });
      });

      context("When não há mercado anterior", () => {
        it("Then retorna true", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [{ id: "m2", ordem: 2, status_composicao: "pendente" }],
          };

          const resultado = isMercadoBloqueado(ciclo, ciclo.mercados[0]);
          expect(resultado).to.be.true;
        });
      });
    });
  });

  describe("validarLiberacaoVendaDireta", () => {
    context("Given um ciclo e mercado", () => {
      context("When o tipo não é venda_direta", () => {
        it("Then retorna can false com motivo", () => {
          const ciclo = { id: "1", status: "ativo", mercados: [] };
          const mercado = {
            id: "m1",
            tipo_venda: "cesta",
            status_composicao: "concluida",
          };

          const resultado = validarLiberacaoVendaDireta(ciclo, mercado);

          expect(resultado.can).to.be.false;
          expect(resultado.reason).to.equal("Não é venda direta");
        });
      });

      context("When o ciclo está inativo", () => {
        it("Then retorna can false com motivo", () => {
          const ciclo = { id: "1", status: "inativo", mercados: [] };
          const mercado = {
            id: "m1",
            tipo_venda: "venda_direta",
            status_composicao: "concluida",
          };

          const resultado = validarLiberacaoVendaDireta(ciclo, mercado);

          expect(resultado.can).to.be.false;
          expect(resultado.reason).to.equal("Ciclo inativo");
        });
      });

      context("When o mercado está pendente (sem items)", () => {
        it("Then retorna can false com motivo", () => {
          const ciclo = { id: "1", status: "ativo", mercados: [] };
          const mercado = {
            id: "m1",
            tipo_venda: "venda_direta",
            status_composicao: "pendente",
          };

          const resultado = validarLiberacaoVendaDireta(ciclo, mercado);

          expect(resultado.can).to.be.false;
          expect(resultado.reason).to.include("Adicione pelo menos 1 item");
        });
      });

      context("When todas as condições são válidas", () => {
        it("Then retorna can true", () => {
          const ciclo = { id: "1", status: "ativo", mercados: [] };
          const mercado = {
            id: "m1",
            tipo_venda: "venda_direta",
            status_composicao: "em_andamento",
          };

          const resultado = validarLiberacaoVendaDireta(ciclo, mercado);

          expect(resultado.can).to.be.true;
          expect(resultado.reason).to.be.undefined;
        });
      });
    });
  });

  describe("ordenarCiclosPorData", () => {
    context("Given um array de ciclos", () => {
      const ciclos = [
        { id: "1", inicio_ofertas: "2025-11-01", nome: "Ciclo 1" },
        { id: "2", inicio_ofertas: "2025-11-15", nome: "Ciclo 2" },
        { id: "3", inicio_ofertas: "2025-10-20", nome: "Ciclo 3" },
      ];

      context("When ordem é desc (padrão)", () => {
        it("Then retorna ciclos do mais recente ao mais antigo", () => {
          const resultado = ordenarCiclosPorData(ciclos);

          expect(resultado[0].id).to.equal("2");
          expect(resultado[1].id).to.equal("1");
          expect(resultado[2].id).to.equal("3");
        });
      });

      context("When ordem é asc", () => {
        it("Then retorna ciclos do mais antigo ao mais recente", () => {
          const resultado = ordenarCiclosPorData(ciclos, "asc");

          expect(resultado[0].id).to.equal("3");
          expect(resultado[1].id).to.equal("1");
          expect(resultado[2].id).to.equal("2");
        });
      });

      context("When não modifica array original", () => {
        it("Then retorna novo array", () => {
          const resultado = ordenarCiclosPorData(ciclos);

          expect(ciclos[0].id).to.equal("1");
          expect(resultado[0].id).to.equal("2");
        });
      });
    });
  });

  describe("obterProximoMercadoPendente", () => {
    context("Given um ciclo com mercados", () => {
      context("When há mercado pendente não bloqueado", () => {
        it("Then retorna o próximo mercado pendente", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "concluida" },
              { id: "m2", ordem: 2, status_composicao: "pendente" },
              { id: "m3", ordem: 3, status_composicao: "pendente" },
            ],
          };

          const resultado = obterProximoMercadoPendente(ciclo);

          expect(resultado.id).to.equal("m2");
        });
      });

      context("When há mercado em_andamento", () => {
        it("Then retorna o mercado em_andamento", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "concluida" },
              { id: "m2", ordem: 2, status_composicao: "em_andamento" },
            ],
          };

          const resultado = obterProximoMercadoPendente(ciclo);

          expect(resultado.id).to.equal("m2");
        });
      });

      context("When todos mercados estão concluídos", () => {
        it("Then retorna undefined", () => {
          const ciclo = {
            id: "1",
            status: "ativo",
            mercados: [
              { id: "m1", ordem: 1, status_composicao: "concluida" },
              { id: "m2", ordem: 2, status_composicao: "concluida" },
            ],
          };

          const resultado = obterProximoMercadoPendente(ciclo);

          expect(resultado).to.be.undefined;
        });
      });
    });
  });

  describe("contarMercadosPorStatus", () => {
    context("Given um ciclo com mercados", () => {
      context("When há mercados com diferentes status", () => {
        it("Then retorna contagem por status", () => {
          const ciclo = {
            id: "1",
            mercados: [
              { id: "m1", status_composicao: "concluida" },
              { id: "m2", status_composicao: "em_andamento" },
              { id: "m3", status_composicao: "pendente" },
              { id: "m4", status_composicao: "pendente" },
              { id: "m5", status_composicao: "concluida" },
            ],
          };

          const resultado = contarMercadosPorStatus(ciclo);

          expect(resultado.concluida).to.equal(2);
          expect(resultado.em_andamento).to.equal(1);
          expect(resultado.pendente).to.equal(2);
        });
      });

      context("When todos têm o mesmo status", () => {
        it("Then retorna contagem correta", () => {
          const ciclo = {
            id: "1",
            mercados: [
              { id: "m1", status_composicao: "concluida" },
              { id: "m2", status_composicao: "concluida" },
            ],
          };

          const resultado = contarMercadosPorStatus(ciclo);

          expect(resultado.concluida).to.equal(2);
          expect(resultado.em_andamento).to.equal(0);
          expect(resultado.pendente).to.equal(0);
        });
      });
    });
  });

  describe("todosOsMercadosConcluidos", () => {
    context("Given um ciclo com mercados", () => {
      context("When todos os mercados estão concluídos", () => {
        it("Then retorna true", () => {
          const ciclo = {
            id: "1",
            mercados: [
              { id: "m1", status_composicao: "concluida" },
              { id: "m2", status_composicao: "concluida" },
            ],
          };

          const resultado = todosOsMercadosConcluidos(ciclo);
          expect(resultado).to.be.true;
        });
      });

      context("When há mercados não concluídos", () => {
        it("Then retorna false", () => {
          const ciclo = {
            id: "1",
            mercados: [
              { id: "m1", status_composicao: "concluida" },
              { id: "m2", status_composicao: "pendente" },
            ],
          };

          const resultado = todosOsMercadosConcluidos(ciclo);
          expect(resultado).to.be.false;
        });
      });

      context("When não há mercados", () => {
        it("Then retorna true", () => {
          const ciclo = { id: "1", mercados: [] };

          const resultado = todosOsMercadosConcluidos(ciclo);
          expect(resultado).to.be.true;
        });
      });
    });
  });
});
