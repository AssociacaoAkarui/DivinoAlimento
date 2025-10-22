const { faker } = require("@faker-js/faker");

class CestaFactory {
  static create(override = {}) {
    return {
      nome: faker.commerce.productName(),
      valormaximo: parseFloat(faker.commerce.price()),
      status: faker.helpers.arrayElement(["ativo"]),
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
      status: "ativo",
      endereco: faker.location.direction(),
    };
  }

  static create_multiple(count = 3) {
    return Array.from({ length: count }, () => this.create());
  }
}

class CicloFactory {
  static create(override = {}) {
    return {
      nome: faker.person.firstName(),
      pontoEntregaId: null,
      ofertaInicio: faker.date.recent(),
      ofertaFim: faker.date.soon(),
      itensAdicionaisInicio: faker.date.recent(),
      itensAdicionaisFim: faker.date.soon(),
      retiradaConsumidorInicio: faker.date.recent(),
      retiradaConsumidorFim: faker.date.soon(),
      observacao: "Observação",
      status: "ativo",
      ...override,
    };
  }
}

class ProdutoFactory {
  static create(override = {}) {
    return {
      nome: faker.commerce.productName(),
      medida: faker.helpers.arrayElement(["kg", "un", "lt", "g"]),
      pesoGrama: parseFloat(
        faker.number.float({ min: 100, max: 2000, precision: 0.01 }),
      ),
      valorReferencia: parseFloat(faker.commerce.price()),
      status: "ativo",
      descritivo: faker.commerce.productDescription(),
      ...override,
    };
  }
  static create_multiple(count = 3) {
    return Array.from({ length: count }, () => this.create());
  }
}

module.exports = {
  CestaFactory,
  PontoEntregaFactory,
  CicloFactory,
  ProdutoFactory,
};
