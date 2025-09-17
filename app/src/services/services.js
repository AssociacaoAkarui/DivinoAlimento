const Ciclo = require('../model/Ciclo')
const PontoEntrega = require('../model/PontoEntrega')
const Cesta = require('../model/Cesta')
const Produto = require('../model/Produto')
const Profile = require('../model/Profile')


class PontoEntregaModel {
    constructor(dados) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.endereco = dados.endereco;
    this.status = dados.status;
  }
}

class TipoCestaModel {
  constructor(dados) {
    this.id = dados.id;
    this.nomes = dados.nome;
    this.valormaximo = dados.valormaximo;
    this.status = dados.status;
  }
}


class CicloService {
  async criarCiclo() {
    try {
      const pontosEntrega = await PontoEntrega.get();
      const tiposCesta = await Cesta.getCestasAtivas();

      await Cesta.verificaCriaCestasInternas();

      return {
        pontosEntrega: this.criarInstanciasPontoEntrega(pontosEntrega),
        tiposCesta: this.criarInstanciasTipoCesta(tiposCesta)
      };
    } catch (error) {
      console.error('Erro ao criar ciclo:', error);
      throw error;
    }
  }

  criarInstanciasPontoEntrega(dados) {
    return dados.map(dado => new PontoEntregaModel(dado));
  }

  criarInstanciasTipoCesta(dados) {
    return dados.map(dado => new TipoCestaModel(dado));
  }
}

module.exports = { CicloService };
