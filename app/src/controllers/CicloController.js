const Ciclo = require("../model/Ciclo");
const PontoEntrega = require("../model/PontoEntrega");
const Cesta = require("../model/Cesta");
const Produto = require("../model/Produto");
const Profile = require("../model/Profile");
const { ValidationError } = require("sequelize");
const { CicloService } = require("../services/services");

module.exports = {
  async create(req, res) {
    try {
      const cicloService = new CicloService();
      const dadosCriacao = await cicloService.prepararDadosCriacaoCiclo();

      return res.render("ciclo", dadosCriacao);
    } catch (error) {
      console.error("Erro ao carregar página de criação:", error);
      return res.status(500).send("Erro ao carregar página de criação");
    }
  },

  async save(req, res) {
    const cicloService = new CicloService();
    try {
      await cicloService.criarCiclo(req.body);
      return res.redirect("/ciclo-index");
    } catch (error) {
      if (error instanceof ValidationError) {
        try {
          const dadosCriacao = await cicloService.prepararDadosCriacaoCiclo();
          const erros = error.errors.map((err) => err.message);

          return res.render("ciclo", {
            ...dadosCriacao,
            ciclo: req.body,
            erros: erros,
          });
        } catch (setupError) {
          console.error(
            "Erro ao preparar página de erro de validação:",
            setupError,
          );
          return res.status(500).send("Erro ao processar a validação.");
        }
      }

      console.error("Erro ao salvar ciclo:", error);
      return res.status(500).send(`Erro interno ao salvar ciclo.`);
    }
  },

  async show(req, res) {
    try {
      const cicloId = req.params.id;
      const cicloService = new CicloService();
      const cicloCompleto = await cicloService.buscarCicloPorId(cicloId);
      const cicloEntregas = cicloCompleto.cicloEntregas || [];
      const cicloCestas = cicloCompleto.CicloCestas || [];
      return res.render("ciclo-edit", {
        ciclo: cicloCompleto,
        pontosEntrega: cicloCompleto.pontosEntrega,
        cicloEntregas: cicloEntregas,
        cicloCestas: cicloCestas,
        tiposCesta: cicloCompleto.tiposCesta,
      });
    } catch (error) {
      console.error("Erro ao buscar ciclo:", error);
      return res.status(404).send(error.message);
    }
  },

  async update(req, res) {
    const cicloId = req.params.id;
    const cicloService = new CicloService();
    try {
      await cicloService.atualizarCiclo(cicloId, req.body);
      return res.redirect(`/ciclo/${cicloId}`);
    } catch (error) {
      if (error instanceof ValidationError) {
        try {
          const cicloCompleto = await cicloService.buscarCicloPorId(cicloId);
          const erros = error.errors.map((err) => err.message);

          // Mescla os dados originais com as tentativas de mudança do usuário para repopular o formulário
          const cicloComTentativas = { ...cicloCompleto, ...req.body };

          return res.render("ciclo-edit", {
            ciclo: cicloComTentativas,
            pontosEntrega: cicloCompleto.pontosEntrega,
            cicloEntregas: cicloCompleto.cicloEntregas || [],
            cicloCestas: cicloCompleto.CicloCestas || [],
            tiposCesta: cicloCompleto.tiposCesta,
            erros: erros,
          });
        } catch (setupError) {
          console.error(
            "Erro ao preparar página de erro de validação:",
            setupError,
          );
          return res.status(500).send("Erro ao processar a validação.");
        }
      }

      console.error("Erro ao atualizar ciclo:", error);
      return res.status(500).send(`Erro ao atualizar ciclo: ${error.message}`);
    }
  },

  async destroy(req, res) {
    try {
      const cicloId = req.params.id;
      const cicloService = new CicloService();
      await cicloService.deletarCiclo(cicloId);
      return res.redirect("/ciclo-index");
    } catch (error) {
      console.error("Erro ao deletar ciclo:", error);
      return res.status(500).send(`Erro ao deletar ciclo: ${error.message}`);
    }
  },

  async index(req, res) {
    try {
      const cicloService = new CicloService();
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor || null;
      const resultado = await cicloService.listarCiclos(limit, cursor);
      return res.render("ciclo-index", {
        ciclos: resultado.ciclos,
        total: resultado.total,
        nextCursor: resultado.nextCursor,
        limit,
      });
    } catch (error) {
      console.error("Erro ao listar ciclos:", error);
      return res.status(500).send("Erro ao listar ciclos");
    }
  },
};
