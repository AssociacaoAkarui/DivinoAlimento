const { expect } = require('chai');
const {
  formatRole,
  formatRoles,
  formatRolesDisplay,
  getRoleBadgeColor,
  formatLoginError,
  getWelcomeMessage,
  getGreetingByTime
} = require('../../src/lib/login-formatters');

describe('UC001: Autenticar Usuário - Formatações de Login', () => {
  describe('Funcionalidade: Formatar role individual', () => {
    context('Dado que tenho o role "admin"', () => {
      const role = 'admin';
      context('Quando eu formato o role', () => {
        const resultado = formatRole(role);
        it('Então deve retornar "Administrador"', () => {
          expect(resultado).to.equal('Administrador');
        });
      });
    });

    context('Dado que tenho o role "adminmercado"', () => {
      const role = 'adminmercado';
      context('Quando eu formato o role', () => {
        const resultado = formatRole(role);
        it('Então deve retornar "Administrador de Mercado"', () => {
          expect(resultado).to.equal('Administrador de Mercado');
        });
      });
    });

    context('Dado que tenho o role "fornecedor"', () => {
      const role = 'fornecedor';
      context('Quando eu formato o role', () => {
        const resultado = formatRole(role);
        it('Então deve retornar "Fornecedor"', () => {
          expect(resultado).to.equal('Fornecedor');
        });
      });
    });

    context('Dado que tenho o role "consumidor"', () => {
      const role = 'consumidor';
      context('Quando eu formato o role', () => {
        const resultado = formatRole(role);
        it('Então deve retornar "Consumidor"', () => {
          expect(resultado).to.equal('Consumidor');
        });
      });
    });

    context('Dado que tenho um role não reconhecido', () => {
      const role = 'desconhecido';
      context('Quando eu formato o role', () => {
        const resultado = formatRole(role);
        it('Então deve retornar o role original', () => {
          expect(resultado).to.equal('desconhecido');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar múltiplos roles', () => {
    context('Dado que tenho os roles ["admin", "fornecedor"]', () => {
      const roles = ['admin', 'fornecedor'];
      context('Quando eu formato os roles', () => {
        const resultado = formatRoles(roles);
        it('Então deve retornar ["Administrador", "Fornecedor"]', () => {
          expect(resultado).to.deep.equal(['Administrador', 'Fornecedor']);
        });
      });
    });

    context('Dado que tenho um array vazio de roles', () => {
      const roles = [];
      context('Quando eu formato os roles', () => {
        const resultado = formatRoles(roles);
        it('Então deve retornar array vazio', () => {
          expect(resultado).to.deep.equal([]);
        });
      });
    });

    context('Dado que tenho os roles ["admin", "adminmercado", "fornecedor"]', () => {
      const roles = ['admin', 'adminmercado', 'fornecedor'];
      context('Quando eu formato os roles', () => {
        const resultado = formatRoles(roles);
        it('Então deve retornar todos formatados', () => {
          expect(resultado).to.deep.equal([
            'Administrador',
            'Administrador de Mercado',
            'Fornecedor'
          ]);
        });
      });
    });
  });

  describe('Funcionalidade: Formatar roles para exibição em texto', () => {
    context('Dado que tenho os roles ["admin", "fornecedor"]', () => {
      const roles = ['admin', 'fornecedor'];
      context('Quando eu formato para exibição', () => {
        const resultado = formatRolesDisplay(roles);
        it('Então deve retornar "Administrador, Fornecedor"', () => {
          expect(resultado).to.equal('Administrador, Fornecedor');
        });
      });
    });

    context('Dado que tenho apenas um role ["consumidor"]', () => {
      const roles = ['consumidor'];
      context('Quando eu formato para exibição', () => {
        const resultado = formatRolesDisplay(roles);
        it('Então deve retornar "Consumidor"', () => {
          expect(resultado).to.equal('Consumidor');
        });
      });
    });

    context('Dado que tenho um array vazio de roles', () => {
      const roles = [];
      context('Quando eu formato para exibição', () => {
        const resultado = formatRolesDisplay(roles);
        it('Então deve retornar string vazia', () => {
          expect(resultado).to.equal('');
        });
      });
    });
  });

  describe('Funcionalidade: Obter cor do badge por role', () => {
    context('Dado que tenho o role "admin"', () => {
      const role = 'admin';
      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getRoleBadgeColor(role);
        it('Então deve retornar "red"', () => {
          expect(resultado).to.equal('red');
        });
      });
    });

    context('Dado que tenho o role "adminmercado"', () => {
      const role = 'adminmercado';
      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getRoleBadgeColor(role);
        it('Então deve retornar "orange"', () => {
          expect(resultado).to.equal('orange');
        });
      });
    });

    context('Dado que tenho o role "fornecedor"', () => {
      const role = 'fornecedor';
      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getRoleBadgeColor(role);
        it('Então deve retornar "blue"', () => {
          expect(resultado).to.equal('blue');
        });
      });
    });

    context('Dado que tenho o role "consumidor"', () => {
      const role = 'consumidor';
      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getRoleBadgeColor(role);
        it('Então deve retornar "green"', () => {
          expect(resultado).to.equal('green');
        });
      });
    });

    context('Dado que tenho um role não reconhecido', () => {
      const role = 'desconhecido';
      context('Quando eu obtenho a cor do badge', () => {
        const resultado = getRoleBadgeColor(role);
        it('Então deve retornar "gray" como padrão', () => {
          expect(resultado).to.equal('gray');
        });
      });
    });
  });

  describe('Funcionalidade: Formatar erro de login', () => {
    context('Dado que tenho um erro "User not found"', () => {
      const error = new Error('User not found');
      context('Quando eu formato o erro', () => {
        const resultado = formatLoginError(error);
        it('Então deve retornar "Usuário não encontrado ou inativo"', () => {
          expect(resultado).to.equal('Usuário não encontrado ou inativo');
        });
      });
    });

    context('Dado que tenho um erro "Unauthorized"', () => {
      const error = new Error('Unauthorized access');
      context('Quando eu formato o erro', () => {
        const resultado = formatLoginError(error);
        it('Então deve retornar "Credenciais inválidas"', () => {
          expect(resultado).to.equal('Credenciais inválidas');
        });
      });
    });

    context('Dado que tenho um erro "Network"', () => {
      const error = new Error('Network timeout');
      context('Quando eu formato o erro', () => {
        const resultado = formatLoginError(error);
        it('Então deve retornar "Erro de conexão. Verifique sua internet."', () => {
          expect(resultado).to.equal('Erro de conexão. Verifique sua internet.');
        });
      });
    });

    context('Dado que tenho um erro genérico do tipo Error', () => {
      const error = new Error('Algo deu errado');
      context('Quando eu formato o erro', () => {
        const resultado = formatLoginError(error);
        it('Então deve retornar a mensagem original', () => {
          expect(resultado).to.equal('Algo deu errado');
        });
      });
    });

    context('Dado que tenho um erro que não é do tipo Error', () => {
      const error = 'Erro desconhecido';
      context('Quando eu formato o erro', () => {
        const resultado = formatLoginError(error);
        it('Então deve retornar mensagem padrão', () => {
          expect(resultado).to.equal('Erro ao fazer login. Tente novamente.');
        });
      });
    });

    context('Dado que tenho um erro null', () => {
      const error = null;
      context('Quando eu formato o erro', () => {
        const resultado = formatLoginError(error);
        it('Então deve retornar mensagem padrão', () => {
          expect(resultado).to.equal('Erro ao fazer login. Tente novamente.');
        });
      });
    });
  });

  describe('Funcionalidade: Obter mensagem de saudação por horário', () => {
    context('Dado que é de manhã (antes de 12h)', () => {
      context('Quando eu obtenho a saudação', () => {
        const originalDate = Date;
        const mockDate = new Date('2024-01-01T10:00:00');
        global.Date = class extends Date {
          constructor() {
            super();
            return mockDate;
          }
        };
        const resultado = getGreetingByTime();
        global.Date = originalDate;
        it('Então deve retornar "Bom dia"', () => {
          expect(resultado).to.equal('Bom dia');
        });
      });
    });

    context('Dado que é de tarde (entre 12h e 18h)', () => {
      context('Quando eu obtenho a saudação', () => {
        const originalDate = Date;
        const mockDate = new Date('2024-01-01T15:00:00');
        global.Date = class extends Date {
          constructor() {
            super();
            return mockDate;
          }
        };
        const resultado = getGreetingByTime();
        global.Date = originalDate;
        it('Então deve retornar "Boa tarde"', () => {
          expect(resultado).to.equal('Boa tarde');
        });
      });
    });

    context('Dado que é de noite (depois de 18h)', () => {
      context('Quando eu obtenho a saudação', () => {
        const originalDate = Date;
        const mockDate = new Date('2024-01-01T20:00:00');
        global.Date = class extends Date {
          constructor() {
            super();
            return mockDate;
          }
        };
        const resultado = getGreetingByTime();
        global.Date = originalDate;
        it('Então deve retornar "Boa noite"', () => {
          expect(resultado).to.equal('Boa noite');
        });
      });
    });
  });

  describe('Funcionalidade: Obter mensagem de boas-vindas', () => {
    context('Dado que tenho o nome "João" e role "admin"', () => {
      const nome = 'João';
      const role = 'admin';
      context('Quando eu obtenho a mensagem de boas-vindas', () => {
        const resultado = getWelcomeMessage(nome, role);
        it('Então deve incluir o nome e o role formatado', () => {
          expect(resultado).to.include('João');
          expect(resultado).to.include('(Administrador)');
        });
      });
    });

    context('Dado que tenho o nome "Maria" e role "fornecedor"', () => {
      const nome = 'Maria';
      const role = 'fornecedor';
      context('Quando eu obtenho a mensagem de boas-vindas', () => {
        const resultado = getWelcomeMessage(nome, role);
        it('Então deve incluir o nome e o role formatado', () => {
          expect(resultado).to.include('Maria');
          expect(resultado).to.include('(Fornecedor)');
        });
      });
    });

    context('Dado que tenho o nome "Pedro" e role "consumidor"', () => {
      const nome = 'Pedro';
      const role = 'consumidor';
      context('Quando eu obtenho a mensagem de boas-vindas', () => {
        const resultado = getWelcomeMessage(nome, role);
        it('Então deve incluir o nome e o role formatado', () => {
          expect(resultado).to.include('Pedro');
          expect(resultado).to.include('(Consumidor)');
        });
      });
    });
  });
});
