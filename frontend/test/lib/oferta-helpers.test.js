const {
  criarDescricaoProdutoComercializavel,
  transformarOfertaProdutoParaUI,
  calcularTotalOferta,
  calcularQuantidadeTotal,
  validarProdutoOferta,
  filtrarProdutosPorBusca,
  extrairProdutosBase,
  obterVariacoesProduto,
  isPeriodoOfertaAberto,
} = require("../../src/lib/oferta-helpers.ts");

describe("Oferta Helpers", function () {
  describe("criarDescricaoProdutoComercializavel", function () {
    context("Dado um produto comercializável", function () {
      context("Quando crio descrição com todos os campos", function () {
        it("Então deve retornar descrição completa", function () {
          const produto = {
            id: "1",
            produtoId: 10,
            produto: { id: "10", nome: "Banana" },
            medida: "kg",
            pesoKg: 1.0,
            precoBase: 5.5,
            status: "ativo",
          };

          const result = criarDescricaoProdutoComercializavel(produto);

          expect(result).to.equal("Banana (kg) - 1.00 kg - R$ 5,50");
        });
      });

      context("Quando produto não tem peso", function () {
        it("Então deve omitir peso da descrição", function () {
          const produto = {
            id: "1",
            produtoId: 10,
            produto: { id: "10", nome: "Banana" },
            medida: "kg",
            precoBase: 5.5,
            status: "ativo",
          };

          const result = criarDescricaoProdutoComercializavel(produto);

          expect(result).to.equal("Banana (kg) -  - R$ 5,50");
        });
      });

      context("Quando produto não tem nome", function () {
        it("Então deve usar 'Produto' como padrão", function () {
          const produto = {
            id: "1",
            produtoId: 10,
            medida: "kg",
            pesoKg: 1.0,
            precoBase: 5.5,
            status: "ativo",
          };

          const result = criarDescricaoProdutoComercializavel(produto);

          expect(result).to.equal("Produto (kg) - 1.00 kg - R$ 5,50");
        });
      });
    });
  });

  describe("transformarOfertaProdutoParaUI", function () {
    context("Dado um oferta produto da API", function () {
      context("Quando transformo para UI", function () {
        it("Então deve mapear todos os campos corretamente", function () {
          const ofertaProdutoAPI = {
            id: "1",
            ofertaId: 100,
            produtoId: 10,
            quantidade: 5,
            valorReferencia: 5.0,
            valorOferta: 6.0,
            produto: {
              id: "10",
              nome: "Banana",
              medida: "kg",
              valorReferencia: 5.0,
            },
          };

          const result = transformarOfertaProdutoParaUI(ofertaProdutoAPI);

          expect(result).to.deep.equal({
            id: "1",
            produtoId: "10",
            nome: "Banana",
            unidade: "kg",
            peso: undefined,
            volume: undefined,
            precoBase: 5.0,
            valor: 6.0,
            quantidade: 5,
          });
        });
      });

      context("Quando produto não tem valorOferta", function () {
        it("Então deve usar valorReferencia", function () {
          const ofertaProdutoAPI = {
            id: "1",
            ofertaId: 100,
            produtoId: 10,
            quantidade: 5,
            valorReferencia: 5.0,
            produto: {
              id: "10",
              nome: "Banana",
              medida: "kg",
              valorReferencia: 5.0,
            },
          };

          const result = transformarOfertaProdutoParaUI(ofertaProdutoAPI);

          expect(result.valor).to.equal(5.0);
        });
      });

      context("Quando produto não tem dados do produto", function () {
        it("Então deve usar valores padrão", function () {
          const ofertaProdutoAPI = {
            id: "1",
            ofertaId: 100,
            produtoId: 10,
            quantidade: 5,
            valorReferencia: 5.0,
          };

          const result = transformarOfertaProdutoParaUI(ofertaProdutoAPI);

          expect(result.nome).to.equal("");
          expect(result.unidade).to.equal("");
          expect(result.precoBase).to.equal(0);
        });
      });
    });
  });

  describe("calcularTotalOferta", function () {
    const produtos = [
      {
        id: "1",
        produtoId: "10",
        nome: "Banana",
        unidade: "kg",
        precoBase: 5.0,
        valor: 6.0,
        quantidade: 5,
      },
      {
        id: "2",
        produtoId: "20",
        nome: "Maçã",
        unidade: "kg",
        precoBase: 7.0,
        valor: 8.0,
        quantidade: 3,
      },
    ];

    context("Dado uma lista de produtos ofertados", function () {
      context("Quando calculo o total", function () {
        it("Então deve somar valor * quantidade de todos", function () {
          const result = calcularTotalOferta(produtos);

          expect(result).to.equal(54.0);
        });
      });

      context("Quando lista está vazia", function () {
        it("Então deve retornar zero", function () {
          const result = calcularTotalOferta([]);

          expect(result).to.equal(0);
        });
      });
    });
  });

  describe("calcularQuantidadeTotal", function () {
    const produtos = [
      {
        id: "1",
        produtoId: "10",
        nome: "Banana",
        unidade: "kg",
        precoBase: 5.0,
        valor: 6.0,
        quantidade: 5,
      },
      {
        id: "2",
        produtoId: "20",
        nome: "Maçã",
        unidade: "kg",
        precoBase: 7.0,
        valor: 8.0,
        quantidade: 3,
      },
    ];

    context("Dado uma lista de produtos ofertados", function () {
      context("Quando calculo a quantidade total", function () {
        it("Então deve somar todas as quantidades", function () {
          const result = calcularQuantidadeTotal(produtos);

          expect(result).to.equal(8);
        });
      });

      context("Quando lista está vazia", function () {
        it("Então deve retornar zero", function () {
          const result = calcularQuantidadeTotal([]);

          expect(result).to.equal(0);
        });
      });
    });
  });

  describe("validarProdutoOferta", function () {
    context("Dado dados de produto para oferta", function () {
      context("Quando todos os campos são válidos", function () {
        it("Então deve retornar válido sem erros", function () {
          const result = validarProdutoOferta("10", "5", "6,50");

          expect(result.valido).to.be.true;
          expect(result.erros).to.be.empty;
        });
      });

      context("Quando produto não está selecionado", function () {
        it("Então deve retornar erro de Produto", function () {
          const result = validarProdutoOferta("", "5", "6,50");

          expect(result.valido).to.be.false;
          expect(result.erros).to.include("Produto");
        });
      });

      context("Quando valor está vazio", function () {
        it("Então deve retornar erro de Valor Unitário", function () {
          const result = validarProdutoOferta("10", "5", "");

          expect(result.valido).to.be.false;
          expect(result.erros).to.include("Valor Unitário");
        });
      });

      context("Quando quantidade está vazia", function () {
        it("Então deve retornar erro de Quantidade", function () {
          const result = validarProdutoOferta("10", "", "6,50");

          expect(result.valido).to.be.false;
          expect(result.erros).to.include("Quantidade");
        });
      });

      context("Quando valor é menor que 0.01", function () {
        it("Então deve retornar erro de valor mínimo", function () {
          const result = validarProdutoOferta("10", "5", "0,00");

          expect(result.valido).to.be.false;
          expect(result.erros).to.include("Valor deve ser ≥ R$ 0,01");
        });
      });

      context("Quando quantidade é menor que 1", function () {
        it("Então deve retornar erro de quantidade mínima", function () {
          const result = validarProdutoOferta("10", "0", "6,50");

          expect(result.valido).to.be.false;
          expect(result.erros).to.include("Quantidade deve ser ≥ 1");
        });
      });

      context("Quando múltiplos campos são inválidos", function () {
        it("Então deve retornar todos os erros", function () {
          const result = validarProdutoOferta("", "", "");

          expect(result.valido).to.be.false;
          expect(result.erros).to.have.lengthOf(5);
        });
      });
    });
  });

  describe("filtrarProdutosPorBusca", function () {
    const produtos = [
      {
        id: "1",
        produtoId: 10,
        produto: { id: "10", nome: "Banana" },
        medida: "kg",
        pesoKg: 1.0,
        precoBase: 5.5,
        status: "ativo",
      },
      {
        id: "2",
        produtoId: 20,
        produto: { id: "20", nome: "Maçã" },
        medida: "unidade",
        pesoKg: 0.2,
        precoBase: 0.5,
        status: "ativo",
      },
      {
        id: "3",
        produtoId: 30,
        produto: { id: "30", nome: "Laranja" },
        medida: "kg",
        pesoKg: 1.0,
        precoBase: 4.0,
        status: "ativo",
      },
    ];

    context("Dado uma lista de produtos", function () {
      context("Quando busco por nome do produto", function () {
        it("Então deve retornar produtos com nome correspondente", function () {
          const result = filtrarProdutosPorBusca(produtos, "ban");

          expect(result).to.have.lengthOf(1);
          expect(result[0].produto.nome).to.equal("Banana");
        });
      });

      context("Quando busco por medida", function () {
        it("Então deve retornar produtos com medida correspondente", function () {
          const result = filtrarProdutosPorBusca(produtos, "unidade");

          expect(result).to.have.lengthOf(1);
          expect(result[0].produto.nome).to.equal("Maçã");
        });
      });

      context("Quando busca está vazia", function () {
        it("Então deve retornar todos os produtos", function () {
          const result = filtrarProdutosPorBusca(produtos, "");

          expect(result).to.have.lengthOf(3);
        });
      });

      context("Quando busca não corresponde nenhum produto", function () {
        it("Então deve retornar lista vazia", function () {
          const result = filtrarProdutosPorBusca(produtos, "xyz");

          expect(result).to.be.empty;
        });
      });
    });
  });

  describe("extrairProdutosBase", function () {
    const produtosComercializaveis = [
      {
        id: "1",
        produtoId: 10,
        produto: { id: "10", nome: "Banana" },
        medida: "kg",
        pesoKg: 1.0,
        precoBase: 5.5,
        status: "ativo",
      },
      {
        id: "2",
        produtoId: 10,
        produto: { id: "10", nome: "Banana" },
        medida: "caixa",
        pesoKg: 10.0,
        precoBase: 50.0,
        status: "ativo",
      },
      {
        id: "3",
        produtoId: 20,
        produto: { id: "20", nome: "Maçã" },
        medida: "kg",
        pesoKg: 1.0,
        precoBase: 7.0,
        status: "ativo",
      },
    ];

    context("Dado uma lista de produtos comercializáveis", function () {
      context("Quando extraio produtos base", function () {
        it("Então deve retornar lista única de produtos base", function () {
          const result = extrairProdutosBase(produtosComercializaveis);

          expect(result).to.have.lengthOf(2);
          expect(result[0]).to.deep.equal({ id: "10", nome: "Banana" });
          expect(result[1]).to.deep.equal({ id: "20", nome: "Maçã" });
        });
      });

      context("Quando produtos não têm dados de produto base", function () {
        it("Então deve retornar lista vazia", function () {
          const produtosSemBase = [
            {
              id: "1",
              produtoId: 10,
              medida: "kg",
              precoBase: 5.5,
              status: "ativo",
            },
          ];

          const result = extrairProdutosBase(produtosSemBase);

          expect(result).to.be.empty;
        });
      });
    });
  });

  describe("obterVariacoesProduto", function () {
    const produtosComercializaveis = [
      {
        id: "1",
        produtoId: 10,
        produto: { id: "10", nome: "Banana" },
        medida: "kg",
        pesoKg: 1.0,
        precoBase: 5.5,
        status: "ativo",
      },
      {
        id: "2",
        produtoId: 10,
        produto: { id: "10", nome: "Banana" },
        medida: "caixa",
        pesoKg: 10.0,
        precoBase: 50.0,
        status: "ativo",
      },
      {
        id: "3",
        produtoId: 20,
        produto: { id: "20", nome: "Maçã" },
        medida: "kg",
        pesoKg: 1.0,
        precoBase: 7.0,
        status: "ativo",
      },
    ];

    context("Dado uma lista de produtos comercializáveis", function () {
      context("Quando busco variações de um produto base", function () {
        it("Então deve retornar todas as variações desse produto", function () {
          const result = obterVariacoesProduto(produtosComercializaveis, "10");

          expect(result).to.have.lengthOf(2);
          expect(result.every((p) => p.produto.id === "10")).to.be.true;
        });
      });

      context("Quando produto base não tem variações", function () {
        it("Então deve retornar apenas uma variação", function () {
          const result = obterVariacoesProduto(produtosComercializaveis, "20");

          expect(result).to.have.lengthOf(1);
          expect(result[0].produto.nome).to.equal("Maçã");
        });
      });

      context("Quando produto base ID está vazio", function () {
        it("Então deve retornar lista vazia", function () {
          const result = obterVariacoesProduto(produtosComercializaveis, "");

          expect(result).to.be.empty;
        });
      });
    });
  });

  describe("isPeriodoOfertaAberto", function () {
    context("Dado um período de oferta", function () {
      context("Quando estamos dentro do período", function () {
        it("Então deve retornar true", function () {
          const ontem = new Date();
          ontem.setDate(ontem.getDate() - 1);
          const amanha = new Date();
          amanha.setDate(amanha.getDate() + 1);

          const result = isPeriodoOfertaAberto(
            ontem.toISOString(),
            amanha.toISOString(),
          );

          expect(result).to.be.true;
        });
      });

      context("Quando estamos fora do período (antes)", function () {
        it("Então deve retornar false", function () {
          const amanha = new Date();
          amanha.setDate(amanha.getDate() + 1);
          const depoisDeAmanha = new Date();
          depoisDeAmanha.setDate(depoisDeAmanha.getDate() + 2);

          const result = isPeriodoOfertaAberto(
            amanha.toISOString(),
            depoisDeAmanha.toISOString(),
          );

          expect(result).to.be.false;
        });
      });

      context("Quando estamos fora do período (depois)", function () {
        it("Então deve retornar false", function () {
          const anteontem = new Date();
          anteontem.setDate(anteontem.getDate() - 2);
          const ontem = new Date();
          ontem.setDate(ontem.getDate() - 1);

          const result = isPeriodoOfertaAberto(
            anteontem.toISOString(),
            ontem.toISOString(),
          );

          expect(result).to.be.false;
        });
      });

      context("Quando datas não são fornecidas", function () {
        it("Então deve retornar true (período sempre aberto)", function () {
          const result = isPeriodoOfertaAberto(undefined, undefined);

          expect(result).to.be.true;
        });
      });

      context("Quando datas são inválidas", function () {
        it("Então deve retornar true (período sempre aberto)", function () {
          const result = isPeriodoOfertaAberto("invalid", "invalid");

          expect(result).to.be.true;
        });
      });
    });
  });
});
