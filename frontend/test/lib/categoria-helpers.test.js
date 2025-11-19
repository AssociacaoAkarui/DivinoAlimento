const { expect } = require('chai');
const {
  isStatusAtivo,
  isStatusInativo,
  formatStatusDisplay,
  parseStatusFromDisplay,
  filterCategoriasByStatus,
  filterCategoriasAtivas,
  filterCategoriasInativas,
  searchCategoriasByNome,
  sortCategoriasByNome,
  countCategoriasAtivas,
  countCategoriasInativas,
  isCategoriaNomeValid,
  formatCategoriaNome,
  hasObservacao,
} = require('../../src/lib/categoria-helpers');

describe('UC007: Gestão de Categorias - Categoria Helpers', () => {
  describe('Funcionalidade: Verificar status ativo', () => {
    context('Dado que tenho status "ativo"', () => {
      const status = 'ativo';
      context('Quando verifico se é ativo', () => {
        const resultado = isStatusAtivo(status);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho status "inativo"', () => {
      const status = 'inativo';
      context('Quando verifico se é ativo', () => {
        const resultado = isStatusAtivo(status);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Verificar status inativo', () => {
    context('Dado que tenho status "inativo"', () => {
      const status = 'inativo';
      context('Quando verifico se é inativo', () => {
        const resultado = isStatusInativo(status);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho status "ativo"', () => {
      const status = 'ativo';
      context('Quando verifico se é inativo', () => {
        const resultado = isStatusInativo(status);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Formatar status para exibição', () => {
    context('Dado que tenho status "ativo"', () => {
      const status = 'ativo';
      context('Quando formato para exibição', () => {
        const resultado = formatStatusDisplay(status);
        it('Então deve retornar "Ativo"', () => {
          expect(resultado).to.equal('Ativo');
        });
      });
    });

    context('Dado que tenho status "inativo"', () => {
      const status = 'inativo';
      context('Quando formato para exibição', () => {
        const resultado = formatStatusDisplay(status);
        it('Então deve retornar "Inativo"', () => {
          expect(resultado).to.equal('Inativo');
        });
      });
    });
  });

  describe('Funcionalidade: Converter status de exibição', () => {
    context('Dado que tenho status de exibição "Ativo"', () => {
      const displayStatus = 'Ativo';
      context('Quando converto para backend', () => {
        const resultado = parseStatusFromDisplay(displayStatus);
        it('Então deve retornar "ativo"', () => {
          expect(resultado).to.equal('ativo');
        });
      });
    });

    context('Dado que tenho status de exibição "Inativo"', () => {
      const displayStatus = 'Inativo';
      context('Quando converto para backend', () => {
        const resultado = parseStatusFromDisplay(displayStatus);
        it('Então deve retornar "inativo"', () => {
          expect(resultado).to.equal('inativo');
        });
      });
    });
  });

  describe('Funcionalidade: Filtrar categorias por status', () => {
    context('Dado que tenho uma lista de categorias', () => {
      const categorias = [
        { id: '1', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '2', nome: 'Verduras', status: 'ativo', observacao: null },
        { id: '3', nome: 'Antiga', status: 'inativo', observacao: null },
      ];

      context('Quando filtro por status ativo', () => {
        const resultado = filterCategoriasByStatus(categorias, 'ativo');
        it('Então deve retornar apenas categorias ativas', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].nome).to.equal('Frutas');
          expect(resultado[1].nome).to.equal('Verduras');
        });
      });

      context('Quando filtro por status inativo', () => {
        const resultado = filterCategoriasByStatus(categorias, 'inativo');
        it('Então deve retornar apenas categorias inativas', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal('Antiga');
        });
      });
    });
  });

  describe('Funcionalidade: Filtrar apenas categorias ativas', () => {
    context('Dado que tenho uma lista mista de categorias', () => {
      const categorias = [
        { id: '1', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '2', nome: 'Antiga', status: 'inativo', observacao: null },
        { id: '3', nome: 'Verduras', status: 'ativo', observacao: null },
      ];

      context('Quando filtro apenas as ativas', () => {
        const resultado = filterCategoriasAtivas(categorias);
        it('Então deve retornar apenas as ativas', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every((cat) => cat.status === 'ativo')).to.be.true;
        });
      });
    });
  });

  describe('Funcionalidade: Filtrar apenas categorias inativas', () => {
    context('Dado que tenho uma lista mista de categorias', () => {
      const categorias = [
        { id: '1', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '2', nome: 'Antiga', status: 'inativo', observacao: null },
        { id: '3', nome: 'Velha', status: 'inativo', observacao: null },
      ];

      context('Quando filtro apenas as inativas', () => {
        const resultado = filterCategoriasInativas(categorias);
        it('Então deve retornar apenas as inativas', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every((cat) => cat.status === 'inativo')).to.be.true;
        });
      });
    });
  });

  describe('Funcionalidade: Buscar categorias por nome', () => {
    context('Dado que tenho uma lista de categorias', () => {
      const categorias = [
        { id: '1', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '2', nome: 'Verduras', status: 'ativo', observacao: null },
        { id: '3', nome: 'Legumes', status: 'ativo', observacao: null },
      ];

      context('Quando busco por "Frut"', () => {
        const resultado = searchCategoriasByNome(categorias, 'Frut');
        it('Então deve retornar apenas Frutas', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal('Frutas');
        });
      });

      context('Quando busco por "ver" (case insensitive)', () => {
        const resultado = searchCategoriasByNome(categorias, 'ver');
        it('Então deve retornar Verduras', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal('Verduras');
        });
      });

      context('Quando busco com termo vazio', () => {
        const resultado = searchCategoriasByNome(categorias, '');
        it('Então deve retornar todas as categorias', () => {
          expect(resultado).to.have.lengthOf(3);
        });
      });

      context('Quando busco por termo inexistente', () => {
        const resultado = searchCategoriasByNome(categorias, 'xyz');
        it('Então deve retornar lista vazia', () => {
          expect(resultado).to.have.lengthOf(0);
        });
      });
    });
  });

  describe('Funcionalidade: Ordenar categorias por nome', () => {
    context('Dado que tenho uma lista desordenada', () => {
      const categorias = [
        { id: '1', nome: 'Verduras', status: 'ativo', observacao: null },
        { id: '2', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '3', nome: 'Legumes', status: 'ativo', observacao: null },
      ];

      context('Quando ordeno por nome', () => {
        const resultado = sortCategoriasByNome(categorias);
        it('Então deve retornar em ordem alfabética', () => {
          expect(resultado[0].nome).to.equal('Frutas');
          expect(resultado[1].nome).to.equal('Legumes');
          expect(resultado[2].nome).to.equal('Verduras');
        });
      });
    });
  });

  describe('Funcionalidade: Contar categorias ativas', () => {
    context('Dado que tenho uma lista mista de categorias', () => {
      const categorias = [
        { id: '1', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '2', nome: 'Verduras', status: 'ativo', observacao: null },
        { id: '3', nome: 'Antiga', status: 'inativo', observacao: null },
      ];

      context('Quando conto as ativas', () => {
        const resultado = countCategoriasAtivas(categorias);
        it('Então deve retornar 2', () => {
          expect(resultado).to.equal(2);
        });
      });
    });

    context('Dado que não tenho categorias ativas', () => {
      const categorias = [
        { id: '1', nome: 'Antiga', status: 'inativo', observacao: null },
      ];

      context('Quando conto as ativas', () => {
        const resultado = countCategoriasAtivas(categorias);
        it('Então deve retornar 0', () => {
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe('Funcionalidade: Contar categorias inativas', () => {
    context('Dado que tenho uma lista mista de categorias', () => {
      const categorias = [
        { id: '1', nome: 'Frutas', status: 'ativo', observacao: null },
        { id: '2', nome: 'Antiga', status: 'inativo', observacao: null },
        { id: '3', nome: 'Velha', status: 'inativo', observacao: null },
      ];

      context('Quando conto as inativas', () => {
        const resultado = countCategoriasInativas(categorias);
        it('Então deve retornar 2', () => {
          expect(resultado).to.equal(2);
        });
      });
    });
  });

  describe('Funcionalidade: Validar nome de categoria', () => {
    context('Dado que tenho um nome válido', () => {
      const nome = 'Frutas';
      context('Quando valido o nome', () => {
        const resultado = isCategoriaNomeValid(nome);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho um nome vazio', () => {
      const nome = '';
      context('Quando valido o nome', () => {
        const resultado = isCategoriaNomeValid(nome);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });

    context('Dado que tenho um nome apenas com espaços', () => {
      const nome = '   ';
      context('Quando valido o nome', () => {
        const resultado = isCategoriaNomeValid(nome);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Formatar nome de categoria', () => {
    context('Dado que tenho um nome com espaços extras', () => {
      const nome = '  Frutas  ';
      context('Quando formato o nome', () => {
        const resultado = formatCategoriaNome(nome);
        it('Então deve remover espaços', () => {
          expect(resultado).to.equal('Frutas');
        });
      });
    });
  });

  describe('Funcionalidade: Verificar se categoria tem observação', () => {
    context('Dado que tenho uma categoria com observação', () => {
      const categoria = {
        id: '1',
        nome: 'Frutas',
        status: 'ativo',
        observacao: 'Categoria de frutas frescas',
      };

      context('Quando verifico se tem observação', () => {
        const resultado = hasObservacao(categoria);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho uma categoria sem observação', () => {
      const categoria = {
        id: '1',
        nome: 'Frutas',
        status: 'ativo',
        observacao: null,
      };

      context('Quando verifico se tem observação', () => {
        const resultado = hasObservacao(categoria);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });

    context('Dado que tenho uma categoria com observação vazia', () => {
      const categoria = {
        id: '1',
        nome: 'Frutas',
        status: 'ativo',
        observacao: '',
      };

      context('Quando verifico se tem observação', () => {
        const resultado = hasObservacao(categoria);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });
});
