const {
  agruparMenuPorSecoes,
  filtrarMenuItemsHabilitados,
  obterMenuItemPorRota,
  validarAcessoMenu,
  filtrarCiclosAtivos,
  encontrarPedidoDoCiclo,
  calcularValorTotalProdutos,
  separarProdutosCestaVarejo,
  obterCicloMaisRecente,
  contarProdutosUnicos,
  temPedidoAtivo,
} = require("../../src/lib/dashboard-helpers");

describe("dashboard-helpers", () => {
  describe("agruparMenuPorSecoes", () => {
    context("Given um objeto de seções com items", () => {
      context("When há múltiplas seções", () => {
        it("Then retorna array de seções", () => {
          const sections = {
            "Gestão de Alimentos": [
              { title: "Cadastro", route: "/admin/produtos" },
            ],
            Administração: [{ title: "Usuários", route: "/admin/usuarios" }],
          };

          const resultado = agruparMenuPorSecoes(sections);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].titulo).to.equal("Gestão de Alimentos");
          expect(resultado[0].items).to.have.lengthOf(1);
          expect(resultado[1].titulo).to.equal("Administração");
        });
      });
    });
  });

  describe("filtrarMenuItemsHabilitados", () => {
    context("Given um array de menu items", () => {
      context("When há items habilitados e desabilitados", () => {
        it("Then retorna apenas habilitados", () => {
          const items = [
            { title: "Item 1", route: "/rota1", enabled: true },
            { title: "Item 2", route: "/rota2", enabled: false },
            { title: "Item 3", route: "/rota3" }, // undefined = habilitado
          ];

          const resultado = filtrarMenuItemsHabilitados(items);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].title).to.equal("Item 1");
          expect(resultado[1].title).to.equal("Item 3");
        });
      });
    });
  });

  describe("obterMenuItemPorRota", () => {
    context("Given um array de menu items", () => {
      const items = [
        { title: "Home", route: "/home" },
        { title: "Admin", route: "/admin/dashboard" },
      ];

      context("When a rota existe", () => {
        it("Then retorna o item correspondente", () => {
          const resultado = obterMenuItemPorRota(items, "/admin/dashboard");

          expect(resultado).to.not.be.undefined;
          expect(resultado.title).to.equal("Admin");
        });
      });

      context("When a rota não existe", () => {
        it("Then retorna undefined", () => {
          const resultado = obterMenuItemPorRota(items, "/inexistente");
          expect(resultado).to.be.undefined;
        });
      });
    });
  });

  describe("validarAcessoMenu", () => {
    context("Given um menu item e role do usuário", () => {
      context("When admin acessa rota de admin", () => {
        it("Then retorna true", () => {
          const item = { title: "Produtos", route: "/admin/produtos" };
          const resultado = validarAcessoMenu(item, "admin");
          expect(resultado).to.be.true;
        });
      });

      context("When adminmercado acessa rota de adminmercado", () => {
        it("Then retorna true", () => {
          const item = { title: "Mercados", route: "/adminmercado/mercados" };
          const resultado = validarAcessoMenu(item, "adminmercado");
          expect(resultado).to.be.true;
        });
      });

      context("When fornecedor acessa rota de fornecedor", () => {
        it("Then retorna true", () => {
          const item = { title: "Loja", route: "/fornecedor/loja" };
          const resultado = validarAcessoMenu(item, "fornecedor");
          expect(resultado).to.be.true;
        });
      });

      context("When consumidor acessa rota de consumidor", () => {
        it("Then retorna true", () => {
          const item = { title: "Pedido", route: "/pedidoConsumidores/1" };
          const resultado = validarAcessoMenu(item, "consumidor");
          expect(resultado).to.be.true;
        });
      });

      context("When qualquer role acessa dados pessoais", () => {
        it("Then retorna true", () => {
          const item = { title: "Dados", route: "/usuario/1" };
          expect(validarAcessoMenu(item, "admin")).to.be.true;
          expect(validarAcessoMenu(item, "consumidor")).to.be.true;
        });
      });

      context("When role não tem acesso à rota", () => {
        it("Then retorna false", () => {
          const item = { title: "Admin", route: "/admin/dashboard" };
          const resultado = validarAcessoMenu(item, "consumidor");
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe("filtrarCiclosAtivos", () => {
    context("Given um array de ciclos", () => {
      context("When há ciclos ativos", () => {
        it("Then retorna apenas ciclos com status oferta", () => {
          const ciclos = [
            { id: "1", status: "oferta", nome: "Ciclo 1" },
            { id: "2", status: "fechado", nome: "Ciclo 2" },
            { id: "3", status: "oferta", nome: "Ciclo 3" },
          ];

          const resultado = filtrarCiclosAtivos(ciclos);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].id).to.equal("1");
          expect(resultado[1].id).to.equal("3");
        });
      });
    });
  });

  describe("encontrarPedidoDoCiclo", () => {
    context("Given um array de pedidos e um cicloId", () => {
      const pedidos = [
        { id: "1", cicloId: 10 },
        { id: "2", cicloId: 20 },
        { id: "3", cicloId: 30 },
      ];

      context("When o pedido existe", () => {
        it("Then retorna o pedido do ciclo", () => {
          const resultado = encontrarPedidoDoCiclo(pedidos, "20");

          expect(resultado).to.not.be.undefined;
          expect(resultado.id).to.equal("2");
        });
      });

      context("When o pedido não existe", () => {
        it("Then retorna undefined", () => {
          const resultado = encontrarPedidoDoCiclo(pedidos, "99");
          expect(resultado).to.be.undefined;
        });
      });
    });
  });

  describe("calcularValorTotalProdutos", () => {
    context("Given um array de produtos", () => {
      context("When produtos têm valorCompra", () => {
        it("Then retorna soma total com valorCompra", () => {
          const produtos = [
            { id: "1", produtoId: 1, quantidade: 2, valorCompra: 10.0 },
            { id: "2", produtoId: 2, quantidade: 3, valorCompra: 5.0 },
          ];

          const resultado = calcularValorTotalProdutos(produtos);
          expect(resultado).to.equal(35.0); // 2*10 + 3*5
        });
      });

      context("When produtos têm valorOferta", () => {
        it("Then retorna soma total com valorOferta", () => {
          const produtos = [
            { id: "1", produtoId: 1, quantidade: 2, valorOferta: 8.0 },
            { id: "2", produtoId: 2, quantidade: 1, valorOferta: 12.0 },
          ];

          const resultado = calcularValorTotalProdutos(produtos);
          expect(resultado).to.equal(28.0); // 2*8 + 1*12
        });
      });

      context("When valorCompra tem prioridade sobre valorOferta", () => {
        it("Then usa valorCompra", () => {
          const produtos = [
            {
              id: "1",
              produtoId: 1,
              quantidade: 1,
              valorCompra: 15.0,
              valorOferta: 10.0,
            },
          ];

          const resultado = calcularValorTotalProdutos(produtos);
          expect(resultado).to.equal(15.0);
        });
      });

      context("When array está vazio", () => {
        it("Then retorna zero", () => {
          const resultado = calcularValorTotalProdutos([]);
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe("separarProdutosCestaVarejo", () => {
    context("Given produtos de pedido e cesta", () => {
      context("When há produtos em ambos", () => {
        it("Then retorna separados com totais", () => {
          const produtosPedido = [
            { id: "1", produtoId: 1, quantidade: 2, valorCompra: 10.0 },
          ];
          const produtosCesta = [
            { id: "2", produtoId: 2, quantidade: 1, valorOferta: 15.0 },
          ];

          const resultado = separarProdutosCestaVarejo(
            produtosPedido,
            produtosCesta,
          );

          expect(resultado.varejo).to.have.lengthOf(1);
          expect(resultado.cesta).to.have.lengthOf(1);
          expect(resultado.totalVarejo).to.equal(20.0);
          expect(resultado.totalCesta).to.equal(15.0);
        });
      });
    });
  });

  describe("obterCicloMaisRecente", () => {
    context("Given um array de ciclos", () => {
      context("When há múltiplos ciclos", () => {
        it("Then retorna o ciclo com data mais recente", () => {
          const ciclos = [
            { id: "1", ofertaInicio: "2025-10-01", nome: "Ciclo 1" },
            { id: "2", ofertaInicio: "2025-11-15", nome: "Ciclo 2" },
            { id: "3", ofertaInicio: "2025-10-20", nome: "Ciclo 3" },
          ];

          const resultado = obterCicloMaisRecente(ciclos);

          expect(resultado).to.not.be.null;
          expect(resultado.id).to.equal("2");
        });
      });

      context("When array está vazio", () => {
        it("Then retorna null", () => {
          const resultado = obterCicloMaisRecente([]);
          expect(resultado).to.be.null;
        });
      });
    });
  });

  describe("contarProdutosUnicos", () => {
    context("Given um array de produtos", () => {
      context("When há produtos duplicados", () => {
        it("Then retorna contagem de produtos únicos", () => {
          const produtos = [
            { id: "1", produtoId: 10, quantidade: 2 },
            { id: "2", produtoId: 20, quantidade: 1 },
            { id: "3", produtoId: 10, quantidade: 3 }, // duplicado
            { id: "4", produtoId: 30, quantidade: 1 },
          ];

          const resultado = contarProdutosUnicos(produtos);
          expect(resultado).to.equal(3); // 10, 20, 30
        });
      });

      context("When não há duplicados", () => {
        it("Then retorna total de produtos", () => {
          const produtos = [
            { id: "1", produtoId: 10, quantidade: 2 },
            { id: "2", produtoId: 20, quantidade: 1 },
          ];

          const resultado = contarProdutosUnicos(produtos);
          expect(resultado).to.equal(2);
        });
      });

      context("When array está vazio", () => {
        it("Then retorna zero", () => {
          const resultado = contarProdutosUnicos([]);
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe("temPedidoAtivo", () => {
    context("Given um array de pedidos e cicloId", () => {
      context("When há pedido com produtos", () => {
        it("Then retorna true", () => {
          const pedidos = [
            {
              id: "1",
              cicloId: 10,
              pedidoConsumidoresProdutos: [
                { id: "p1", produtoId: 1, quantidade: 2 },
              ],
            },
          ];

          const resultado = temPedidoAtivo(pedidos, "10");
          expect(resultado).to.be.true;
        });
      });

      context("When há pedido mas sem produtos", () => {
        it("Then retorna false", () => {
          const pedidos = [
            {
              id: "1",
              cicloId: 10,
              pedidoConsumidoresProdutos: [],
            },
          ];

          const resultado = temPedidoAtivo(pedidos, "10");
          expect(resultado).to.be.false;
        });
      });

      context("When não há pedido", () => {
        it("Then retorna false", () => {
          const pedidos = [{ id: "1", cicloId: 20 }];

          const resultado = temPedidoAtivo(pedidos, "10");
          expect(resultado).to.be.false;
        });
      });
    });
  });
});
