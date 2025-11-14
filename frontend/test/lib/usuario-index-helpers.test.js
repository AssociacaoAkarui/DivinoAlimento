const { expect } = require('chai');
const {
  filterUsuariosBySearch,
  filterUsuariosByStatus,
  filterUsuariosByPerfis,
  applyAllFilters,
  normalizeUsuario,
  normalizeUsuarios,
} = require('../../src/lib/usuario-index-helpers');

describe('UC004: Gerenciar Usuários - Filtros e Normalização', () => {

  describe('Funcionalidade: Filtrar usuários por busca', () => {

    context('Dado que tenho uma lista de usuários', () => {
      const usuarios = [
        { id: '1', nome: 'João Silva', nomeCompleto: 'João Silva', email: 'joao@email.com', status: 'Ativo', perfis: ['Admin'] },
        { id: '2', nome: 'Maria Santos', nomeCompleto: 'Maria Santos', email: 'maria@email.com', status: 'Ativo', perfis: ['Consumidor'] },
        { id: '3', nome: 'Pedro Costa', nomeCompleto: 'Pedro Costa', email: 'pedro@email.com', status: 'Inativo', perfis: ['Fornecedor'] },
      ];

      context('Quando eu busco por "João"', () => {
        const resultado = filterUsuariosBySearch(usuarios, 'João');

        it('Então deve retornar apenas usuários com "João" no nome', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal('João Silva');
        });
      });

      context('Quando eu busco por "maria@email.com"', () => {
        const resultado = filterUsuariosBySearch(usuarios, 'maria@email.com');

        it('Então deve retornar apenas usuários com esse email', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].email).to.equal('maria@email.com');
        });
      });

      context('Quando eu busco com termo vazio', () => {
        const resultado = filterUsuariosBySearch(usuarios, '');

        it('Então deve retornar todos os usuários', () => {
          expect(resultado).to.have.lengthOf(3);
        });
      });

      context('Quando eu busco com case insensitive "SILVA"', () => {
        const resultado = filterUsuariosBySearch(usuarios, 'SILVA');

        it('Então deve encontrar "João Silva"', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].nome).to.equal('João Silva');
        });
      });

      context('Quando eu busco por termo que não existe', () => {
        const resultado = filterUsuariosBySearch(usuarios, 'XPTO');

        it('Então deve retornar array vazio', () => {
          expect(resultado).to.be.an('array').that.is.empty;
        });
      });
    });
  });

  describe('Funcionalidade: Filtrar usuários por status', () => {

    context('Dado que tenho usuários com diferentes status', () => {
      const usuarios = [
        { id: '1', nome: 'João', email: 'joao@email.com', status: 'Ativo', perfis: [] },
        { id: '2', nome: 'Maria', email: 'maria@email.com', status: 'Ativo', perfis: [] },
        { id: '3', nome: 'Pedro', email: 'pedro@email.com', status: 'Inativo', perfis: [] },
      ];

      context('Quando eu filtro por status ["Ativo"]', () => {
        const resultado = filterUsuariosByStatus(usuarios, ['Ativo']);

        it('Então deve retornar apenas usuários ativos', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every(u => u.status === 'Ativo')).to.be.true;
        });
      });

      context('Quando eu filtro por status ["Inativo"]', () => {
        const resultado = filterUsuariosByStatus(usuarios, ['Inativo']);

        it('Então deve retornar apenas usuários inativos', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].status).to.equal('Inativo');
        });
      });

      context('Quando eu filtro com lista vazia', () => {
        const resultado = filterUsuariosByStatus(usuarios, []);

        it('Então deve retornar todos os usuários', () => {
          expect(resultado).to.have.lengthOf(3);
        });
      });

      context('Quando eu filtro por múltiplos status ["Ativo", "Inativo"]', () => {
        const resultado = filterUsuariosByStatus(usuarios, ['Ativo', 'Inativo']);

        it('Então deve retornar todos os usuários', () => {
          expect(resultado).to.have.lengthOf(3);
        });
      });
    });
  });

  describe('Funcionalidade: Filtrar usuários por perfis', () => {

    context('Dado que tenho usuários com diferentes perfis', () => {
      const usuarios = [
        { id: '1', nome: 'João', email: 'joao@email.com', status: 'Ativo', perfis: ['Admin', 'Fornecedor'] },
        { id: '2', nome: 'Maria', email: 'maria@email.com', status: 'Ativo', perfis: ['Consumidor'] },
        { id: '3', nome: 'Pedro', email: 'pedro@email.com', status: 'Inativo', perfis: ['Fornecedor'] },
      ];

      context('Quando eu filtro por perfil ["Admin"]', () => {
        const resultado = filterUsuariosByPerfis(usuarios, ['Admin']);

        it('Então deve retornar apenas usuários com perfil Admin', () => {
          expect(resultado).to.have.lengthOf(1);
          expect(resultado[0].perfis).to.include('Admin');
        });
      });

      context('Quando eu filtro por perfil ["Fornecedor"]', () => {
        const resultado = filterUsuariosByPerfis(usuarios, ['Fornecedor']);

        it('Então deve retornar usuários que têm perfil Fornecedor', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every(u => u.perfis.includes('Fornecedor'))).to.be.true;
        });
      });

      context('Quando eu filtro com lista vazia', () => {
        const resultado = filterUsuariosByPerfis(usuarios, []);

        it('Então deve retornar todos os usuários', () => {
          expect(resultado).to.have.lengthOf(3);
        });
      });

      context('Quando eu filtro por perfil que não existe', () => {
        const resultado = filterUsuariosByPerfis(usuarios, ['Administrador de Mercado']);

        it('Então deve retornar array vazio', () => {
          expect(resultado).to.be.an('array').that.is.empty;
        });
      });
    });
  });

  describe('Funcionalidade: Aplicar todos os filtros combinados', () => {

    context('Dado que tenho múltiplos filtros ativos', () => {
      const usuarios = [
        { id: '1', nome: 'João Silva', nomeCompleto: 'João Silva', email: 'joao@email.com', status: 'Ativo', perfis: ['Admin'] },
        { id: '2', nome: 'Maria Santos', nomeCompleto: 'Maria Santos', email: 'maria@email.com', status: 'Ativo', perfis: ['Consumidor'] },
        { id: '3', nome: 'Pedro Costa', nomeCompleto: 'Pedro Costa', email: 'pedro@email.com', status: 'Inativo', perfis: ['Fornecedor'] },
        { id: '4', nome: 'Ana Silva', nomeCompleto: 'Ana Silva', email: 'ana@email.com', status: 'Ativo', perfis: ['Admin'] },
      ];

      context('Quando eu filtro por busca "Silva" e status "Ativo"', () => {
        const filters = { search: '', status: ['Ativo'], perfis: [] };
        const resultado = applyAllFilters(usuarios, filters, 'Silva');

        it('Então deve retornar apenas usuários ativos com "Silva" no nome', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every(u => u.status === 'Ativo')).to.be.true;
          expect(resultado.every(u => u.nome.includes('Silva'))).to.be.true;
        });
      });

      context('Quando eu filtro por status "Ativo" e perfil "Admin"', () => {
        const filters = { search: '', status: ['Ativo'], perfis: ['Admin'] };
        const resultado = applyAllFilters(usuarios, filters, '');

        it('Então deve retornar apenas admins ativos', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado.every(u => u.status === 'Ativo' && u.perfis.includes('Admin'))).to.be.true;
        });
      });

      context('Quando não tenho nenhum filtro ativo', () => {
        const filters = { search: '', status: [], perfis: [] };
        const resultado = applyAllFilters(usuarios, filters, '');

        it('Então deve retornar todos os usuários', () => {
          expect(resultado).to.have.lengthOf(4);
        });
      });
    });
  });

  describe('Funcionalidade: Normalizar dados de usuário do backend', () => {

    context('Dado que tenho dados brutos do backend', () => {
      const usuarioBackend = {
        id: '1',
        nome: 'João Silva',
        email: 'joao@email.com',
        status: 'ativo',
        perfis: ['admin', 'fornecedor']
      };

      context('Quando eu normalizo o usuário', () => {
        const resultado = normalizeUsuario(usuarioBackend);

        it('Então deve converter status "ativo" para "Ativo"', () => {
          expect(resultado.status).to.equal('Ativo');
        });

        it('Então deve capitalizar os perfis', () => {
          expect(resultado.perfis).to.deep.equal(['Admin', 'Fornecedor']);
        });

        it('Então deve incluir nomeCompleto', () => {
          expect(resultado.nomeCompleto).to.equal('João Silva');
        });
      });
    });

    context('Dado que tenho usuário inativo do backend', () => {
      const usuarioBackend = {
        id: '2',
        nome: 'Maria',
        email: 'maria@email.com',
        status: 'inativo',
        perfis: ['consumidor']
      };

      context('Quando eu normalizo o usuário', () => {
        const resultado = normalizeUsuario(usuarioBackend);

        it('Então deve converter status "inativo" para "Inativo"', () => {
          expect(resultado.status).to.equal('Inativo');
        });
      });
    });

    context('Dado que tenho uma lista de usuários do backend', () => {
      const usuariosBackend = [
        { id: '1', nome: 'João', email: 'joao@email.com', status: 'ativo', perfis: ['admin'] },
        { id: '2', nome: 'Maria', email: 'maria@email.com', status: 'inativo', perfis: ['consumidor'] }
      ];

      context('Quando eu normalizo a lista', () => {
        const resultado = normalizeUsuarios(usuariosBackend);

        it('Então deve normalizar todos os usuários', () => {
          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].status).to.equal('Ativo');
          expect(resultado[1].status).to.equal('Inativo');
        });
      });
    });
  });
});
