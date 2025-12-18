const { expect } = require('chai');
const { filterUsuarios, countActiveUsers, getUsersByPerfil } = require('../../src/lib/usuario-helpers');

describe('usuario-helpers', () => {
  const mockUsuarios = [
    {
      id: '1',
      nome: 'João Silva',
      email: 'joao@test.com',
      status: 'ativo',
      perfis: ['admin'],
    },
    {
      id: '2',
      nome: 'Maria Santos',
      email: 'maria@test.com',
      status: 'ativo',
      perfis: ['consumidor'],
    },
    {
      id: '3',
      nome: 'Pedro Costa',
      email: 'pedro@test.com',
      status: 'inativo',
      perfis: ['fornecedor'],
    },
  ];

  describe('filterUsuarios', () => {
    it('returns all users when search is empty', () => {
      const result = filterUsuarios(mockUsuarios, '');
      expect(result).to.have.length(3);
    });

    it('filters by name', () => {
      const result = filterUsuarios(mockUsuarios, 'João');
      expect(result).to.have.length(1);
      expect(result[0].nome).to.equal('João Silva');
    });

    it('filters by email', () => {
      const result = filterUsuarios(mockUsuarios, 'maria@test');
      expect(result).to.have.length(1);
      expect(result[0].email).to.equal('maria@test.com');
    });

    it('is case insensitive', () => {
      const result = filterUsuarios(mockUsuarios, 'JOÃO');
      expect(result).to.have.length(1);
      expect(result[0].nome).to.equal('João Silva');
    });

    it('returns empty array when no match', () => {
      const result = filterUsuarios(mockUsuarios, 'xyz');
      expect(result).to.have.length(0);
    });
  });

  describe('countActiveUsers', () => {
    it('counts only active users', () => {
      const count = countActiveUsers(mockUsuarios);
      expect(count).to.equal(2);
    });

    it('returns 0 when no active users', () => {
      const inactiveUsers = mockUsuarios.map(u => ({ ...u, status: 'inativo' }));
      const count = countActiveUsers(inactiveUsers);
      expect(count).to.equal(0);
    });
  });

  describe('getUsersByPerfil', () => {
    it('returns users with specific perfil', () => {
      const result = getUsersByPerfil(mockUsuarios, 'admin');
      expect(result).to.have.length(1);
      expect(result[0].nome).to.equal('João Silva');
    });

    it('returns empty array when perfil not found', () => {
      const result = getUsersByPerfil(mockUsuarios, 'adminmercado');
      expect(result).to.have.length(0);
    });
  });
});
