const Ciclo = require("../model/Ciclo");
const PontoEntrega = require("../model/PontoEntrega");
const Cesta = require("../model/Cesta");
const Produto = require("../model/Produto");
const Profile = require("../model/Profile");
const { CicloService } = require("../services/services");

module.exports = {
  async create(req, res) {
    const data = req.body;
    const pontosEntrega = await PontoEntrega.get();
    const tiposCesta = await Cesta.getCestasAtivas();
    const ciclo = { pontosEntrega, tiposCesta };

    await Cesta.verificaCriaCestasInternas();

    return res.render("ciclo", ciclo);
  },

  async save(req, res) {
    const cicloService = new CicloService();
    cicloService.criarCiclo(req.body);

    console.log("ATENÇÃO ATENÇÃO ATENÇÃO ATENÇÃO ATENÇÃO ATENÇÃO TESTE_4");

    return res.redirect("/ciclo-index");
  },

  async show(req, res) {
    const cicloId = req.params.id;

    const dadosCiclo = await Ciclo.getCicloIdMin(cicloId);
    const ciclo = dadosCiclo.ciclo[0];

    console.log(
      "---------------------------------------------------------------------------------------------------------------entrou no Controller show",
    );

    const cicloEntregas = dadosCiclo.cicloEntregas;

    const cicloCestas = dadosCiclo.cicloCestas;

    console.log(
      "---------------------------------------------------------------------------------------------------------------Controller showCestas ",
      dadosCiclo.cicloCestas,
    );

    if (!ciclo) {
      return res.send("Ciclo não existe!");
    }

    const pontosEntrega = await PontoEntrega.get();
    const tiposCesta = await Cesta.getCestasAtivas();
    //const produtos = await Produto.get();

    return res.render("ciclo-edit", {
      ciclo: ciclo,
      pontosEntrega: pontosEntrega,
      cicloEntregas: cicloEntregas,
      cicloCestas: cicloCestas,
      tiposCesta: tiposCesta,
    });
  },

  async update(req, res) {
    
  },

  delete(req, res) {
    const cicloId = req.params.id;

    Ciclo.delete(cicloId);

    return res.redirect("/ciclo-index");
  },
};
