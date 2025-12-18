const { expect } = require('chai');
const {
  formatUsuarioStatus,
  formatPerfil,
  formatPerfis,
  getUserInitials,
  formatUsuarioDisplay,
  getPerfilBadgeColor
} = require('../../src/lib/usuario-formatters');

describe('UC004: Gerenciar Usuários - Formatações', () => {

  describe('Funcionalidade: Formatar status de usuário', () => {

    context('Dado que tenho o status "ativo"', () => {
      const status = 'ativo';

      context('Quando eu formato o status', () => {
        const resultado = formatUsuarioStatus(status);

        it('Então deve retornar "Ativo"', () => {
          expect(resultado).to.equal('Ativo');
        });
      });
    });

    context('Dado que tenho o status "inativo"', () => {
      const status = 'inativo';

      context('Quando eu formato o status', () => {
        const resultado = formatUsuarioStatus(status);

        it('Então deve retornar "Inativo"', () => {
          expect(resultado).to.equal('Inativo');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar perfil de usuário', () => {

    context('Dado que tenho o perfil "admin"', () => {
      const perfil = 'admin';

      context('Quando eu formato o perfil', () => {
        const resultado = formatPerfil(perfil);

        it('Então deve retornar "Administrador"', () => {
          expect(resultado).to.equal('Administrador');
        });
      });
    });

    context('Dado que tenho o perfil "adminmercado"', () => {
      const perfil = 'adminmercado';

      context('Quando eu formato o perfil', () => {
        const resultado = formatPerfil(perfil);

        it('Então deve retornar "Administrador de Mercado"', () => {
          expect(resultado).to.equal('Administrador de Mercado');
        });
      });
    });

    context('Dado que tenho o perfil "fornecedor"', () => {
      const perfil = 'fornecedor';

      context('Quando eu formato o perfil', () => {
        const resultado = formatPerfil(perfil);

        it('Então deve retornar "Fornecedor"', () => {
          expect(resultado).to.equal('Fornecedor');
        });
      });
    });

    context('Dado que tenho o perfil "consumidor"', () => {
      const perfil = 'consumidor';

      context('Quando eu formato o perfil', () => {
        const resultado = formatPerfil(perfil);

        it('Então deve retornar "Consumidor"', () => {
          expect(resultado).to.equal('Consumidor');
        });
      });
    });

    context('Dado que tenho um perfil não reconhecido', () => {
      const perfil = 'desconhecido';

      context('Quando eu formato o perfil', () => {
        const resultado = formatPerfil(perfil);

        it('Então deve retornar o perfil original', () => {
          expect(resultado).to.equal('desconhecido');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar múltiplos perfis', () => {

    context('Dado que tenho os perfis ["admin", "fornecedor"]', () => {
      const perfis = ['admin', 'fornecedor'];

      context('Quando eu formato os perfis', () => {
        const resultado = formatPerfis(perfis);

        it('Então deve retornar ["Administrador", "Fornecedor"]', () => {
          expect(resultado).to.deep.equal(['Administrador', 'Fornecedor']);
        });
      });
    });

    context('Dado que tenho um array vazio de perfis', () => {
      const perfis = [];

      context('Quando eu formato os perfis', () => {
        const resultado = formatPerfis(perfis);

        it('Então deve retornar array vazio', () => {
          expect(resultado).to.deep.equal([]);
        });
      });
    });
  });

  describe('Funcionalidade: Obter iniciais do nome', () => {

    context('Dado que tenho o nome "João Silva"', () => {
      const nome = 'João Silva';

      context('Quando eu obtenho as iniciais', () => {
        const resultado = getUserInitials(nome);

        it('Então deve retornar "JS"', () => {
          expect(resultado).to.equal('JS');
        });
      });
    });

    context('Dado que tenho o nome "Maria Santos Lima"', () => {
      const nome = 'Maria Santos Lima';

      context('Quando eu obtenho as iniciais', () => {
        const resultado = getUserInitials(nome);

        it('Então deve retornar apenas as duas primeiras "MS"', () => {
          expect(resultado).to.equal('MS');
        });
      });
    });

    context('Dado que tenho o nome "Pedro"', () => {
      const nome = 'Pedro';

      context('Quando eu obtenho as iniciais', () => {
        const resultado = getUserInitials(nome);

        it('Então deve retornar as duas primeiras letras "PE"', () => {
          expect(resultado).to.equal('PE');
        });
      });
    });

    context('Dado que tenho um nome vazio', () => {
      const nome = '';

      context('Quando eu obtenho as iniciais', () => {
        const resultado = getUserInitials(nome);

        it('Então deve retornar string vazia', () => {
          expect(resultado).to.equal('');
        });
      });
    });

    context('Dado que tenho o nome "  João   Silva  " com espaços extras', () => {
      const nome = '  João   Silva  ';

      context('Quando eu obtenho as iniciais', () => {
        const resultado = getUserInitials(nome);

        it('Então deve remover espaços e retornar "JS"', () => {
          expect(resultado).to.equal('JS');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar exibição completa do usuário', () => {

    context('Dado que tenho um usuário ativo com múltiplos perfis', () => {
      const usuario = {
        id: '1',
        nome: 'João Silva',
        email: 'joao@test.com',
        status: 'ativo',
        perfis: ['admin', 'fornecedor']
      };

      context('Quando eu formato para exibição', () => {
        const resultado = formatUsuarioDisplay(usuario);

        it('Então deve retornar "João Silva (Ativo) - Administrador, Fornecedor"', () => {
          expect(resultado).to.equal('João Silva (Ativo) - Administrador, Fornecedor');
        });
      });
    });

    context('Dado que tenho um usuário inativo com um perfil', () => {
      const usuario = {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@test.com',
        status: 'inativo',
        perfis: ['consumidor']
      };

      context('Quando eu formato para exibição', () => {
        const resultado = formatUsuarioDisplay(usuario);

        it('Então deve retornar "Maria Santos (Inativo) - Consumidor"', () => {
          expect(resultado).to.equal('Maria Santos (Inativo) - Consumidor');
        });
      });
    });
  });

  describe('Funcionalidade: Obter cor do badge por perfil', () => {

    context('Dado que tenho o perfil "admin"', () => {
      const perfil = 'admin';

      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getPerfilBadgeColor(perfil);

        it('Então deve retornar "red"', () => {
          expect(resultado).to.equal('red');
        });
      });
    });

    context('Dado que tenho o perfil "adminmercado"', () => {
      const perfil = 'adminmercado';

      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getPerfilBadgeColor(perfil);

        it('Então deve retornar "orange"', () => {
          expect(resultado).to.equal('orange');
        });
      });
    });

    context('Dado que tenho o perfil "fornecedor"', () => {
      const perfil = 'fornecedor';

      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getPerfilBadgeColor(perfil);

        it('Então deve retornar "blue"', () => {
          expect(resultado).to.equal('blue');
        });
      });
    });

    context('Dado que tenho o perfil "consumidor"', () => {
      const perfil = 'consumidor';

      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getPerfilBadgeColor(perfil);

        it('Então deve retornar "green"', () => {
          expect(resultado).to.equal('green');
        });
      });
    });

    context('Dado que tenho um perfil não reconhecido', () => {
      const perfil = 'desconhecido';

      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getPerfilBadgeColor(perfil);

        it('Então deve retornar "gray" como padrão', () => {
          expect(resultado).to.equal('gray');
        });
      });
    });
  });
});
