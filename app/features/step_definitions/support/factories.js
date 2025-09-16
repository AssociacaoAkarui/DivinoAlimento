const { faker } = require('@faker-js/faker');

class CestaFactory {
  static create(override = {}) {
    return {
      nome: faker.commerce.productName(),
      valormaximo: parseFloat(faker.commerce.price()),
      status: faker.helpers.arrayElement(['ativo'])
    };
  }

    static create_multiple(count = 3) {
    return Array.from({ length: count }, () => this.create());
  }
}

class PontoEntregaFactory {
  static create(override = {}) {
    return {
      nome: faker.commerce.productName(),
      status: faker.helpers.arrayElement(['ativo', 'inativo']),
      endereco: faker.location.direction()
    };
  }

  static create_multiple(count = 3) {
    return Array.from({ length: count }, () => this.create());
  }
}

module.exports = { CestaFactory,
		   PontoEntregaFactory };
