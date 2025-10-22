const { CestaService } = require("../services/services");
const Cesta = require("../model/Cesta");
const Profile = require("../model/Profile");

const cestaService = new CestaService();

module.exports = {
  create(req, res) {
    return res.render("cesta");
  },

  async save(req, res) {
    try {
      await cestaService.criarCesta(req.body);
      return res.redirect("/cesta-index");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Ocorreu um erro ao salvar a cesta.");
    }
  },

  async show(req, res) {
    const cestaId = req.params.id;
    const cestas = await Cesta.get();
    const profile = Profile.get();

    const cesta = cestas.find((cesta) => Number(cesta.id) === Number(cestaId));

    if (!cesta) {
      return res.send("Cesta não existe!");
    }

    return res.render("cesta-edit", { cesta });
  },

  async update(req, res) {
    const cestaId = req.params.id;
    try {
      await cestaService.atualizarCesta(cestaId, req.body);
      return res.redirect("/cesta/" + cestaId);
    } catch (error) {
      console.error(error);
      return res.status(500).send("Ocorreu um erro ao atualizar a cesta.");
    }
  },

  async delete(req, res) {
    const cestaId = req.params.id;
    try {
      await cestaService.deletarCesta(cestaId);
      return res.redirect("/cesta-index");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Ocorreu um erro ao deletar a cesta.");
    }
  },
};
