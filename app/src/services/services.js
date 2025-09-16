const Ciclo = require('../model/Ciclo')
const PontoEntrega = require('../model/PontoEntrega')
const Cesta = require('../model/Cesta')
const Produto = require('../model/Produto')
const Profile = require('../model/Profile')

class CicloService {
    async criarCiclo() {
    const pontosEntrega = await PontoEntrega.get();
    const tiposCesta = await Cesta.getCestasAtivas();

    await Cesta.verificaCriaCestasInternas();

    const ciclo = {
      pontosEntrega,
      tiposCesta,
    };

    return ciclo;
  }
}

module.exports = { CicloService };
