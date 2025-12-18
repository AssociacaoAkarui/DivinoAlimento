const { expect } = require('chai');
const {
  formatTipoVenda,
  getTipoVendaColor,
  formatValorCurrency,
  formatQuantidade,
  isValidTipoVenda,
  isValidQuantidadeCestas,
  isValidValorAlvo,
  validateCicloMercadoCesta,
  validateCicloMercadoLote,
  filterMercadosByTipoVenda,
  filterMercadosByStatus,
  sortMercadosByOrdem,
  getMercadoDisplayName,
  canRemoveMercado,
  getNextOrdemAtendimento,
  hasRequiredFieldsForTipoVenda,
  getMercadoSummary,
  countMercadosByTipo,
  getMercadosAtivos,
  getMercadosInativos,
} = require('../../src/lib/ciclo-mercado-helpers');

describe('CicloMercados Helpers', () => {
  describe('Funcionalidade: Formatar tipo de venda', () => {
    context('Dado que tenho tipo "cesta"', () => {
      const tipo = 'cesta';
      context('Quando formato o tipo', () => {
        const resultado = formatTipoVenda(tipo);
        it('Então deve retornar "Cesta"', () => {
          expect(resultado).to.equal('Cesta');
        });
      });
    });

    context('Dado que tenho tipo "lote"', () => {
      const tipo = 'lote';
      context('Quando formato o tipo', () => {
        const resultado = formatTipoVenda(tipo);
        it('Então deve retornar "Lote"', () => {
          expect(resultado).to.equal('Lote');
        });
      });
    });

    context('Dado que tenho tipo "venda_direta"', () => {
      const tipo = 'venda_direta';
      context('Quando formato o tipo', () => {
        const resultado = formatTipoVenda(tipo);
        it('Então deve retornar "Venda Direta"', () => {
          expect(resultado).to.equal('Venda Direta');
        });
      });
    });
  });

  describe('Funcionalidade: Obter cor do tipo de venda', () => {
    context('Dado que tenho tipo "cesta"', () => {
      const tipo = 'cesta';
      context('Quando obtenho a cor', () => {
        const resultado = getTipoVendaColor(tipo);
        it('Então deve retornar cor azul', () => {
          expect(resultado).to.include('blue');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar valor em moeda', () => {
    context('Dado que tenho valor 100.50', () => {
      const valor = 100.50;
      context('Quando formato o valor', () => {
        const resultado = formatValorCurrency(valor);
        it('Então deve retornar valor formatado em BRL', () => {
          expect(resultado).to.include('100');
          expect(resultado).to.include('50');
        });
      });
    });

    context('Dado que tenho valor null', () => {
      const valor = null;
      context('Quando formato o valor', () => {
        const resultado = formatValorCurrency(valor);
        it('Então deve retornar "-"', () => {
          expect(resultado).to.equal('-');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar quantidade', () => {
    context('Dado que tenho quantidade 50', () => {
      const quantidade = 50;
      context('Quando formato a quantidade', () => {
        const resultado = formatQuantidade(quantidade);
        it('Então deve retornar "50"', () => {
          expect(resultado).to.equal('50');
        });
      });
    });
  });

  describe('Funcionalidade: Validar tipo de venda', () => {
    context('Dado que tenho tipo "cesta"', () => {
      const tipo = 'cesta';
      context('Quando valido o tipo', () => {
        const resultado = isValidTipoVenda(tipo);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho tipo inválido', () => {
      const tipo = 'invalido';
      context('Quando valido o tipo', () => {
        const resultado = isValidTipoVenda(tipo);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Validar quantidade de cestas', () => {
    context('Dado que tenho quantidade 50', () => {
      const quantidade = 50;
      context('Quando valido a quantidade', () => {
        const resultado = isValidQuantidadeCestas(quantidade);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho quantidade 0', () => {
      const quantidade = 0;
      context('Quando valido a quantidade', () => {
        const resultado = isValidQuantidadeCestas(quantidade);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Validar valor alvo', () => {
    context('Dado que tenho valor 100', () => {
      const valor = 100;
      context('Quando valido o valor', () => {
        const resultado = isValidValorAlvo(valor);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho valor null', () => {
      const valor = null;
      context('Quando valido o valor', () => {
        const resultado = isValidValorAlvo(valor);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Validar dados de cesta', () => {
    context('Dado que tenho dados válidos de cesta', () => {
      const data = { quantidadeCestas: 50, valorAlvoCesta: 80.0 };
      context('Quando valido os dados', () => {
        const resultado = validateCicloMercadoCesta(data);
        it('Então deve retornar válido sem erros', () => {
          expect(resultado.valid).to.be.true;
          expect(resultado.errors).to.have.lengthOf(0);
        });
      });
    });

    context('Dado que tenho dados inválidos de cesta', () => {
      const data = { quantidadeCestas: null, valorAlvoCesta: null };
      context('Quando valido os dados', () => {
        const resultado = validateCicloMercadoCesta(data);
        it('Então deve retornar inválido com erros', () => {
          expect(resultado.valid).to.be.false;
          expect(resultado.errors).to.have.length.greaterThan(0);
        });
      });
    });
  });

  describe('Funcionalidade: Validar dados de lote', () => {
    context('Dado que tenho valor alvo válido', () => {
      const data = { valorAlvoLote: 500.0 };
      context('Quando valido os dados', () => {
        const resultado = validateCicloMercadoLote(data);
        it('Então deve retornar válido sem erros', () => {
          expect(resultado.valid).to.be.true;
          expect(resultado.errors).to.have.lengthOf(0);
        });
      });
    });
  });

  describe('Funcionalidade: Filtrar mercados por tipo de venda', () => {
    context('Dado que tenho lista de mercados mistos', () => {
      const mercados = [
        { id: 1, tipoVenda: 'cesta' },
        { id: 2, tipoVenda: 'lote' },
        { id: 3, tipoVenda: 'cesta' },
      ];
      context('Quando filtro por tipo "cesta"', () => {
        const resultado = filterMercadosByTipoVenda(mercados, 'cesta');
        it('Então deve retornar apenas mercados tipo cesta', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every(m => m.tipoVenda === 'cesta')).to.be.true;
        });
      });
    });
  });

  describe('Funcionalidade: Ordenar mercados por ordem', () => {
    context('Dado que tenho mercados desordenados', () => {
      const mercados = [
        { id: 1, ordemAtendimento: 3 },
        { id: 2, ordemAtendimento: 1 },
        { id: 3, ordemAtendimento: 2 },
      ];
      context('Quando ordeno por ordem de atendimento', () => {
        const resultado = sortMercadosByOrdem(mercados);
        it('Então deve retornar ordenado crescente', () => {
          expect(resultado[0].ordemAtendimento).to.equal(1);
          expect(resultado[1].ordemAtendimento).to.equal(2);
          expect(resultado[2].ordemAtendimento).to.equal(3);
        });
      });
    });
  });

  describe('Funcionalidade: Obter nome de exibição do mercado', () => {
    context('Dado que tenho mercado com nome e tipo', () => {
      const mercado = {
        mercado: { nome: 'Mercado Central' },
        tipoVenda: 'cesta',
      };
      context('Quando obtenho o nome de exibição', () => {
        const resultado = getMercadoDisplayName(mercado);
        it('Então deve retornar nome completo', () => {
          expect(resultado).to.include('Mercado Central');
          expect(resultado).to.include('Cesta');
        });
      });
    });
  });

  describe('Funcionalidade: Verificar se pode remover mercado', () => {
    context('Dado que mercado está ativo', () => {
      const mercado = { status: 'ativo' };
      context('Quando verifico se posso remover', () => {
        const resultado = canRemoveMercado(mercado);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });
  });

  describe('Funcionalidade: Obter próxima ordem de atendimento', () => {
    context('Dado que tenho 3 mercados', () => {
      const mercados = [
        { ordemAtendimento: 1 },
        { ordemAtendimento: 2 },
        { ordemAtendimento: 3 },
      ];
      context('Quando obtenho próxima ordem', () => {
        const resultado = getNextOrdemAtendimento(mercados);
        it('Então deve retornar 4', () => {
          expect(resultado).to.equal(4);
        });
      });
    });

    context('Dado que não tenho mercados', () => {
      const mercados = [];
      context('Quando obtenho próxima ordem', () => {
        const resultado = getNextOrdemAtendimento(mercados);
        it('Então deve retornar 1', () => {
          expect(resultado).to.equal(1);
        });
      });
    });
  });

  describe('Funcionalidade: Verificar campos obrigatórios por tipo', () => {
    context('Dado que tenho tipo cesta com dados completos', () => {
      const tipo = 'cesta';
      const data = { quantidadeCestas: 50, valorAlvoCesta: 80.0 };
      context('Quando verifico campos obrigatórios', () => {
        const resultado = hasRequiredFieldsForTipoVenda(tipo, data);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho tipo venda_direta', () => {
      const tipo = 'venda_direta';
      const data = {};
      context('Quando verifico campos obrigatórios', () => {
        const resultado = hasRequiredFieldsForTipoVenda(tipo, data);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });
  });

  describe('Funcionalidade: Obter resumo do mercado', () => {
    context('Dado que tenho mercado tipo cesta', () => {
      const mercado = {
        tipoVenda: 'cesta',
        quantidadeCestas: 50,
        valorAlvoCesta: 80.0,
      };
      context('Quando obtenho resumo', () => {
        const resultado = getMercadoSummary(mercado);
        it('Então deve incluir quantidade e valor', () => {
          expect(resultado).to.include('50');
          expect(resultado).to.include('cestas');
        });
      });
    });
  });

  describe('Funcionalidade: Contar mercados por tipo', () => {
    context('Dado que tenho mercados de diferentes tipos', () => {
      const mercados = [
        { tipoVenda: 'cesta' },
        { tipoVenda: 'cesta' },
        { tipoVenda: 'lote' },
        { tipoVenda: 'venda_direta' },
      ];
      context('Quando conto por tipo', () => {
        const resultado = countMercadosByTipo(mercados);
        it('Então deve retornar contagem correta', () => {
          expect(resultado.cesta).to.equal(2);
          expect(resultado.lote).to.equal(1);
          expect(resultado.venda_direta).to.equal(1);
        });
      });
    });
  });

  describe('Funcionalidade: Obter mercados ativos', () => {
    context('Dado que tenho mercados ativos e inativos', () => {
      const mercados = [
        { id: 1, status: 'ativo' },
        { id: 2, status: 'inativo' },
        { id: 3, status: 'ativo' },
      ];
      context('Quando obtenho apenas ativos', () => {
        const resultado = getMercadosAtivos(mercados);
        it('Então deve retornar apenas os ativos', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every(m => m.status === 'ativo')).to.be.true;
        });
      });
    });
  });

  describe('Funcionalidade: Obter mercados inativos', () => {
    context('Dado que tenho mercados ativos e inativos', () => {
      const mercados = [
        { id: 1, status: 'ativo' },
        { id: 2, status: 'inativo' },
        { id: 3, status: 'ativo' },
      ];
      context('Quando obtenho apenas inativos', () => {
        const resultado = getMercadosInativos(mercados);
        it('Então deve retornar apenas os inativos', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado.every(m => m.status === 'inativo')).to.be.true;
        });
      });
    });
  });
});
