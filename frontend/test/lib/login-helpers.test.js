const { expect } = require('chai');
const {
  mapPerfilToRole,
  getDefaultRoute,
  isValidEmail,
  isValidPassword,
  validateLoginCredentials,
  extractNameFromEmail,
  hasRole,
  hasAnyRole,
  isAdmin,
  isAdminMercado,
  hasAdminPermissions,
} = require('../../src/lib/login-helpers');

describe('UC001: Autenticar Usuario - Login Helpers', () => {

  describe('Funcionalidade: Mapear perfil do backend para role', () => {
    context('Dado que tenho o perfil "admin"', () => {
      const perfil = 'admin';
      context('Quando eu converto para role', () => {
        const resultado = mapPerfilToRole(perfil);
        it('Então deve retornar "admin"', () => {
          expect(resultado).to.equal('admin');
        });
      });
    });

    context('Dado que tenho o perfil "adminmercado"', () => {
      const perfil = 'adminmercado';
      context('Quando eu converto para role', () => {
        const resultado = mapPerfilToRole(perfil);
        it('Então deve retornar "adminmercado"', () => {
          expect(resultado).to.equal('adminmercado');
        });
      });
    });

    context('Dado que tenho o perfil "fornecedor"', () => {
      const perfil = 'fornecedor';
      context('Quando eu converto para role', () => {
        const resultado = mapPerfilToRole(perfil);
        it('Então deve retornar "fornecedor"', () => {
          expect(resultado).to.equal('fornecedor');
        });
      });
    });

    context('Dado que tenho o perfil "consumidor"', () => {
      const perfil = 'consumidor';
      context('Quando eu converto para role', () => {
        const resultado = mapPerfilToRole(perfil);
        it('Então deve retornar "consumidor"', () => {
          expect(resultado).to.equal('consumidor');
        });
      });
    });

    context('Dado que tenho um perfil desconhecido', () => {
      const perfil = 'desconhecido';
      context('Quando eu converto para role', () => {
        const resultado = mapPerfilToRole(perfil);
        it('Então deve retornar "consumidor" como padrão', () => {
          expect(resultado).to.equal('consumidor');
        });
      });
    });
  });

  describe('Funcionalidade: Obter rota padrão por role', () => {
    context('Dado que tenho role "consumidor"', () => {
      const role = 'consumidor';
      context('Quando eu obtenho a rota padrão', () => {
        const resultado = getDefaultRoute(role);
        it('Então deve retornar "/dashboard"', () => {
          expect(resultado).to.equal('/dashboard');
        });
      });
    });

    context('Dado que tenho role "fornecedor"', () => {
      const role = 'fornecedor';
      context('Quando eu obtenho a rota padrão', () => {
        const resultado = getDefaultRoute(role);
        it('Então deve retornar "/fornecedor/loja"', () => {
          expect(resultado).to.equal('/fornecedor/loja');
        });
      });
    });

    context('Dado que tenho role "admin"', () => {
      const role = 'admin';
      context('Quando eu obtenho a rota padrão', () => {
        const resultado = getDefaultRoute(role);
        it('Então deve retornar "/admin/dashboard"', () => {
          expect(resultado).to.equal('/admin/dashboard');
        });
      });
    });

    context('Dado que tenho role "adminmercado"', () => {
      const role = 'adminmercado';
      context('Quando eu obtenho a rota padrão', () => {
        const resultado = getDefaultRoute(role);
        it('Então deve retornar "/adminmercado/dashboard"', () => {
          expect(resultado).to.equal('/adminmercado/dashboard');
        });
      });
    });
  });

  describe('Funcionalidade: Validar email', () => {
    context('Dado que tenho email válido "usuario@example.com"', () => {
      const email = 'usuario@example.com';
      context('Quando eu valido o email', () => {
        const resultado = isValidEmail(email);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho email sem @', () => {
      const email = 'usuarioexample.com';
      context('Quando eu valido o email', () => {
        const resultado = isValidEmail(email);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });

    context('Dado que tenho email sem domínio', () => {
      const email = 'usuario@';
      context('Quando eu valido o email', () => {
        const resultado = isValidEmail(email);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });

    context('Dado que tenho email vazio', () => {
      const email = '';
      context('Quando eu valido o email', () => {
        const resultado = isValidEmail(email);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Validar senha', () => {
    context('Dado que tenho senha com 6 caracteres', () => {
      const senha = '123456';
      context('Quando eu valido a senha', () => {
        const resultado = isValidPassword(senha);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho senha com mais de 6 caracteres', () => {
      const senha = '12345678';
      context('Quando eu valido a senha', () => {
        const resultado = isValidPassword(senha);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que tenho senha com menos de 6 caracteres', () => {
      const senha = '12345';
      context('Quando eu valido a senha', () => {
        const resultado = isValidPassword(senha);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });

    context('Dado que tenho senha vazia', () => {
      const senha = '';
      context('Quando eu valido a senha', () => {
        const resultado = isValidPassword(senha);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Validar credenciais de login', () => {
    context('Dado que tenho email e senha válidos', () => {
      const email = 'usuario@example.com';
      const senha = '123456';
      context('Quando eu valido as credenciais', () => {
        const resultado = validateLoginCredentials(email, senha);
        it('Então deve retornar valid true', () => {
          expect(resultado.valid).to.be.true;
        });
        it('Então deve retornar array de erros vazio', () => {
          expect(resultado.errors).to.be.an('array').that.is.empty;
        });
      });
    });

    context('Dado que tenho email inválido e senha válida', () => {
      const email = 'emailinvalido';
      const senha = '123456';
      context('Quando eu valido as credenciais', () => {
        const resultado = validateLoginCredentials(email, senha);
        it('Então deve retornar valid false', () => {
          expect(resultado.valid).to.be.false;
        });
        it('Então deve incluir erro "Email inválido"', () => {
          expect(resultado.errors).to.include('Email inválido');
        });
      });
    });

    context('Dado que tenho email válido e senha curta', () => {
      const email = 'usuario@example.com';
      const senha = '123';
      context('Quando eu valido as credenciais', () => {
        const resultado = validateLoginCredentials(email, senha);
        it('Então deve retornar valid false', () => {
          expect(resultado.valid).to.be.false;
        });
        it('Então deve incluir erro sobre senha mínima', () => {
          expect(resultado.errors).to.include('Senha deve ter no mínimo 6 caracteres');
        });
      });
    });

    context('Dado que email e senha estão vazios', () => {
      const email = '';
      const senha = '';
      context('Quando eu valido as credenciais', () => {
        const resultado = validateLoginCredentials(email, senha);
        it('Então deve retornar valid false', () => {
          expect(resultado.valid).to.be.false;
        });
        it('Então deve incluir dois erros', () => {
          expect(resultado.errors).to.have.lengthOf(2);
        });
        it('Então deve incluir erro de email obrigatório', () => {
          expect(resultado.errors).to.include('Email é obrigatório');
        });
        it('Então deve incluir erro de senha obrigatória', () => {
          expect(resultado.errors).to.include('Senha é obrigatória');
        });
      });
    });
  });

  describe('Funcionalidade: Extrair nome do email', () => {
    context('Dado que tenho email "joao.silva@example.com"', () => {
      const email = 'joao.silva@example.com';
      context('Quando eu extraio o nome', () => {
        const resultado = extractNameFromEmail(email);
        it('Então deve retornar "joao.silva"', () => {
          expect(resultado).to.equal('joao.silva');
        });
      });
    });

    context('Dado que tenho email "usuario@example.com"', () => {
      const email = 'usuario@example.com';
      context('Quando eu extraio o nome', () => {
        const resultado = extractNameFromEmail(email);
        it('Então deve retornar "usuario"', () => {
          expect(resultado).to.equal('usuario');
        });
      });
    });
  });

  describe('Funcionalidade: Verificar se usuário tem role específico', () => {
    context('Dado que usuário tem roles ["admin", "fornecedor"]', () => {
      const userRoles = ['admin', 'fornecedor'];

      context('Quando eu verifico se tem role "admin"', () => {
        const resultado = hasRole(userRoles, 'admin');
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });

      context('Quando eu verifico se tem role "consumidor"', () => {
        const resultado = hasRole(userRoles, 'consumidor');
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Verificar se tem algum dos roles', () => {
    context('Dado que usuário tem roles ["fornecedor"]', () => {
      const userRoles = ['fornecedor'];

      context('Quando eu verifico se tem ["admin", "fornecedor"]', () => {
        const resultado = hasAnyRole(userRoles, ['admin', 'fornecedor']);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });

      context('Quando eu verifico se tem ["admin", "consumidor"]', () => {
        const resultado = hasAnyRole(userRoles, ['admin', 'consumidor']);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Verificar se é admin', () => {
    context('Dado que usuário tem role "admin"', () => {
      const userRoles = ['admin', 'fornecedor'];
      context('Quando eu verifico se é admin', () => {
        const resultado = isAdmin(userRoles);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que usuário não tem role "admin"', () => {
      const userRoles = ['fornecedor', 'consumidor'];
      context('Quando eu verifico se é admin', () => {
        const resultado = isAdmin(userRoles);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Verificar se é admin de mercado', () => {
    context('Dado que usuário tem role "adminmercado"', () => {
      const userRoles = ['adminmercado'];
      context('Quando eu verifico se é admin de mercado', () => {
        const resultado = isAdminMercado(userRoles);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que usuário não tem role "adminmercado"', () => {
      const userRoles = ['admin', 'fornecedor'];
      context('Quando eu verifico se é admin de mercado', () => {
        const resultado = isAdminMercado(userRoles);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe('Funcionalidade: Verificar permissões administrativas', () => {
    context('Dado que usuário é admin', () => {
      const userRoles = ['admin'];
      context('Quando eu verifico permissões administrativas', () => {
        const resultado = hasAdminPermissions(userRoles);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que usuário é admin de mercado', () => {
      const userRoles = ['adminmercado'];
      context('Quando eu verifico permissões administrativas', () => {
        const resultado = hasAdminPermissions(userRoles);
        it('Então deve retornar true', () => {
          expect(resultado).to.be.true;
        });
      });
    });

    context('Dado que usuário é apenas fornecedor', () => {
      const userRoles = ['fornecedor'];
      context('Quando eu verifico permissões administrativas', () => {
        const resultado = hasAdminPermissions(userRoles);
        it('Então deve retornar false', () => {
          expect(resultado).to.be.false;
        });
      });
    });
  });
});
