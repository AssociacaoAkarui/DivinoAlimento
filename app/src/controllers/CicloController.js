const Ciclo = require("../model/Ciclo");
const PontoEntrega = require("../model/PontoEntrega");
const Cesta = require("../model/Cesta");
const Produto = require("../model/Produto");
const Profile = require("../model/Profile");
const { CicloService } = require("../services/services");

module.exports = {
  async create(req, res) {
    try {
      const pontosEntrega = await PontoEntrega.get();
      const tiposCesta = await Cesta.getCestasAtivas();
      const ciclo = { pontosEntrega, tiposCesta };

      await Cesta.verificaCriaCestasInternas();

      return res.render("ciclo", ciclo);
    } catch (error) {
      console.error("Erro ao carregar página de criação:", error);
      return res.status(500).send("Erro ao carregar página de criação");
    }
  },

  async save(req, res) {
    try {
      const cicloService = new CicloService();

      // Aguardar a criação do ciclo
      const novoCiclo = await cicloService.criarCiclo(req.body);

      console.log("Ciclo criado com sucesso:", novoCiclo.id);

      return res.redirect("/ciclo-index");
    } catch (error) {
      console.error("Erro ao salvar ciclo:", error);
      return res.status(500).send(`Erro ao salvar ciclo: ${error.message}`);
    }
  },

  async show(req, res) {
    try {
      const cicloId = req.params.id;
      const cicloService = new CicloService();

      // Buscar ciclo usando o serviço
      const cicloCompleto = await cicloService.buscarCicloPorId(cicloId);

      // Buscar dados adicionais para o formulário
      const pontosEntrega = await PontoEntrega.get();
      const tiposCesta = await Cesta.getCestasAtivas();

      // Preparar dados para a view
      const cicloEntregas = cicloCompleto.cicloEntregas || [];
      const cicloCestas = cicloCompleto.CicloCestas || [];

      return res.render("ciclo-edit", {
        ciclo: cicloCompleto,
        pontosEntrega: pontosEntrega,
        cicloEntregas: cicloEntregas,
        cicloCestas: cicloCestas,
        tiposCesta: tiposCesta,
      });
    } catch (error) {
      console.error("Erro ao buscar ciclo:", error);
      return res.status(404).send(error.message);
    }
  },

  async update(req, res) {
    try {
      const cicloId = req.params.id;
      const cicloService = new CicloService();

      // Preparar dados para atualização
      const dadosAtualizacao = {
        nome: req.body.nome,
        pontoEntregaId: req.body.pontoEntregaId,
        ofertaInicio: req.body.ofertaInicio,
        ofertaFim: req.body.ofertaFim,
        itensAdicionaisInicio: req.body.itensAdicionaisInicio,
        itensAdicionaisFim: req.body.itensAdicionaisFim,
        retiradaConsumidorInicio: req.body.retiradaConsumidorInicio,
        retiradaConsumidorFim: req.body.retiradaConsumidorFim,
        observacao: req.body.observacao,
      };

      // Adicionar entregas se existirem
      let countEntregas = 1;
      while (req.body[`entregaFornecedorInicio${countEntregas}`]) {
        dadosAtualizacao[`entregaFornecedorInicio${countEntregas}`] =
          req.body[`entregaFornecedorInicio${countEntregas}`];
        dadosAtualizacao[`entregaFornecedorFim${countEntregas}`] =
          req.body[`entregaFornecedorFim${countEntregas}`];
        countEntregas++;
      }

      // Adicionar cestas se existirem
      let countCestas = 1;
      while (req.body[`cestaId${countCestas}`]) {
        dadosAtualizacao[`cestaId${countCestas}`] =
          req.body[`cestaId${countCestas}`];
        dadosAtualizacao[`quantidadeCestas${countCestas}`] =
          req.body[`quantidadeCestas${countCestas}`];
        countCestas++;
      }

      // Atualizar ciclo usando o serviço
      await cicloService.atualizarCiclo(cicloId, dadosAtualizacao);

      return res.redirect(`/ciclo/${cicloId}`);
    } catch (error) {
      console.error("Erro ao atualizar ciclo:", error);
      return res.status(500).send(`Erro ao atualizar ciclo: ${error.message}`);
    }
  },

  async delete(req, res) {
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

      // Paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;

      const resultado = await cicloService.listarCiclos(limit, offset);

      return res.render("ciclo-index", {
        ciclos: resultado.ciclos,
        total: resultado.total,
        currentPage: page,
        totalPages: Math.ceil(resultado.total / limit),
      });
    } catch (error) {
      console.error("Erro ao listar ciclos:", error);
      return res.status(500).send("Erro ao listar ciclos");
    }
  },
};
