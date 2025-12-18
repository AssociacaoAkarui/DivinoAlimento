const {
  filtrarAcoesHabilitadas,
  obterAcoesPorSecao,
  validarAcessoAcao,
  contarAcoesDisponiveis,
  todasAsAcoesDesabilitadas,
  obterPrimeiraAcaoHabilitada,
} = require("../../src/lib/loja-produtor-helpers");

describe("loja-produtor-helpers", () => {
  describe("filtrarAcoesHabilitadas", () => {
    context("Given um array de ações", () => {
      context("When há ações habilitadas e desabilitadas", () => {
        it("Then retorna apenas ações habilitadas", () => {
          const acoes = [
            { title: "Ação 1", enabled: true, route: "/rota1" },
            { title: "Ação 2", enabled: false, route: "/rota2" },
            { title: "Ação 3", enabled: true, route: "/rota3" },
          ];

          const resultado = filtrarAcoesHabilitadas(acoes);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].title).to.equal("Ação 1");
          expect(resultado[1].title).to.equal("Ação 3");
        });
      });

      context("When todas as ações estão desabilitadas", () => {
        it("Then retorna array vazio", () => {
          const acoes = [
            { title: "Ação 1", enabled: false },
            { title: "Ação 2", enabled: false },
          ];

          const resultado = filtrarAcoesHabilitadas(acoes);
          expect(resultado).to.have.lengthOf(0);
        });
      });

      context("When todas as ações estão habilitadas", () => {
        it("Then retorna todas as ações", () => {
          const acoes = [
            { title: "Ação 1", enabled: true },
            { title: "Ação 2", enabled: true },
          ];

          const resultado = filtrarAcoesHabilitadas(acoes);
          expect(resultado).to.have.lengthOf(2);
        });
      });
    });
  });

  describe("obterAcoesPorSecao", () => {
    context("Given ações de loja e administração", () => {
      context("When há ações habilitadas em ambas seções", () => {
        it("Then retorna seções com ações filtradas", () => {
          const acoesLoja = [
            { title: "Ofertar", enabled: true },
            { title: "Ver Pedidos", enabled: false },
          ];
          const acoesAdmin = [
            { title: "Dados Pessoais", enabled: true },
            { title: "Configurações", enabled: true },
          ];

          const resultado = obterAcoesPorSecao(acoesLoja, acoesAdmin);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].titulo).to.equal("Loja");
          expect(resultado[0].acoes).to.have.lengthOf(1);
          expect(resultado[1].titulo).to.equal("Administração");
          expect(resultado[1].acoes).to.have.lengthOf(2);
        });
      });

      context("When não há ações habilitadas", () => {
        it("Then retorna seções com arrays vazios", () => {
          const acoesLoja = [{ title: "Ofertar", enabled: false }];
          const acoesAdmin = [{ title: "Dados", enabled: false }];

          const resultado = obterAcoesPorSecao(acoesLoja, acoesAdmin);

          expect(resultado[0].acoes).to.have.lengthOf(0);
          expect(resultado[1].acoes).to.have.lengthOf(0);
        });
      });
    });
  });

  describe("validarAcessoAcao", () => {
    context("Given uma ação e role do usuário", () => {
      context("When a ação está desabilitada", () => {
        it("Then retorna não permitido com motivo", () => {
          const acao = {
            title: "Ação",
            enabled: false,
            route: "/fornecedor/selecionar-ciclo",
          };

          const resultado = validarAcessoAcao(acao, "fornecedor");

          expect(resultado.permitido).to.be.false;
          expect(resultado.motivo).to.equal("Ação desabilitada");
        });
      });

      context("When o usuário não tem role", () => {
        it("Then retorna não permitido com motivo", () => {
          const acao = {
            title: "Ação",
            enabled: true,
            route: "/fornecedor/selecionar-ciclo",
          };

          const resultado = validarAcessoAcao(acao, "");

          expect(resultado.permitido).to.be.false;
          expect(resultado.motivo).to.equal("Usuário sem perfil definido");
        });
      });

      context("When fornecedor acessa rota de fornecedor", () => {
        it("Then retorna permitido", () => {
          const acao = {
            title: "Ofertar",
            enabled: true,
            route: "/fornecedor/selecionar-ciclo",
          };

          const resultado = validarAcessoAcao(acao, "fornecedor");

          expect(resultado.permitido).to.be.true;
          expect(resultado.motivo).to.be.undefined;
        });
      });

      context("When fornecedor acessa rota de entregas", () => {
        it("Then retorna permitido", () => {
          const acao = {
            title: "Entregas",
            enabled: true,
            route: "/fornecedor/selecionar-ciclo-entregas",
          };

          const resultado = validarAcessoAcao(acao, "fornecedor");

          expect(resultado.permitido).to.be.true;
        });
      });

      context("When qualquer role acessa dados pessoais", () => {
        it("Then retorna permitido", () => {
          const acao = {
            title: "Dados Pessoais",
            enabled: true,
            route: "/usuario/1",
          };

          const resultadoFornecedor = validarAcessoAcao(acao, "fornecedor");
          const resultadoAdmin = validarAcessoAcao(acao, "admin");

          expect(resultadoFornecedor.permitido).to.be.true;
          expect(resultadoAdmin.permitido).to.be.true;
        });
      });

      context("When fornecedor tenta acessar rota de admin", () => {
        it("Then retorna não permitido", () => {
          const acao = {
            title: "Admin",
            enabled: true,
            route: "/admin/dashboard",
          };

          const resultado = validarAcessoAcao(acao, "fornecedor");

          expect(resultado.permitido).to.be.false;
          expect(resultado.motivo).to.include("não permitida");
        });
      });

      context("When admin acessa rota de admin", () => {
        it("Then retorna permitido", () => {
          const acao = {
            title: "Dashboard",
            enabled: true,
            route: "/admin/dashboard",
          };

          const resultado = validarAcessoAcao(acao, "admin");

          expect(resultado.permitido).to.be.true;
        });
      });
    });
  });

  describe("contarAcoesDisponiveis", () => {
    context("Given um array de ações", () => {
      context("When há ações habilitadas", () => {
        it("Then retorna a contagem de ações habilitadas", () => {
          const acoes = [
            { title: "Ação 1", enabled: true },
            { title: "Ação 2", enabled: false },
            { title: "Ação 3", enabled: true },
            { title: "Ação 4", enabled: true },
          ];

          const resultado = contarAcoesDisponiveis(acoes);
          expect(resultado).to.equal(3);
        });
      });

      context("When não há ações habilitadas", () => {
        it("Then retorna zero", () => {
          const acoes = [
            { title: "Ação 1", enabled: false },
            { title: "Ação 2", enabled: false },
          ];

          const resultado = contarAcoesDisponiveis(acoes);
          expect(resultado).to.equal(0);
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna zero", () => {
          const resultado = contarAcoesDisponiveis([]);
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe("todasAsAcoesDesabilitadas", () => {
    context("Given um array de ações", () => {
      context("When todas as ações estão desabilitadas", () => {
        it("Then retorna true", () => {
          const acoes = [
            { title: "Ação 1", enabled: false },
            { title: "Ação 2", enabled: false },
          ];

          const resultado = todasAsAcoesDesabilitadas(acoes);
          expect(resultado).to.be.true;
        });
      });

      context("When há pelo menos uma ação habilitada", () => {
        it("Then retorna false", () => {
          const acoes = [
            { title: "Ação 1", enabled: false },
            { title: "Ação 2", enabled: true },
          ];

          const resultado = todasAsAcoesDesabilitadas(acoes);
          expect(resultado).to.be.false;
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna true", () => {
          const resultado = todasAsAcoesDesabilitadas([]);
          expect(resultado).to.be.true;
        });
      });
    });
  });

  describe("obterPrimeiraAcaoHabilitada", () => {
    context("Given um array de ações", () => {
      context("When há ações habilitadas", () => {
        it("Then retorna a primeira ação habilitada", () => {
          const acoes = [
            { title: "Ação 1", enabled: false },
            { title: "Ação 2", enabled: true },
            { title: "Ação 3", enabled: true },
          ];

          const resultado = obterPrimeiraAcaoHabilitada(acoes);

          expect(resultado).to.not.be.undefined;
          expect(resultado.title).to.equal("Ação 2");
        });
      });

      context("When não há ações habilitadas", () => {
        it("Then retorna undefined", () => {
          const acoes = [
            { title: "Ação 1", enabled: false },
            { title: "Ação 2", enabled: false },
          ];

          const resultado = obterPrimeiraAcaoHabilitada(acoes);
          expect(resultado).to.be.undefined;
        });
      });

      context("When o array está vazio", () => {
        it("Then retorna undefined", () => {
          const resultado = obterPrimeiraAcaoHabilitada([]);
          expect(resultado).to.be.undefined;
        });
      });
    });
  });
});
