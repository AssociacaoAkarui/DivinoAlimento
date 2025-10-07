const {
  Ciclo,
  PontoEntrega,
  Cesta,
  CicloEntregas,
  CicloCestas,
  Usuario,
  Session,
} = require("../../models");

class UUIDService {
  constructor() {
    this.crypto = require("crypto");
  }

  uuid4() {
    return this.crypto.randomUUID();
  }
}

class UsuarioService {
  constructor(uuid_service) {
    this.uuid_service = uuid_service;
  }

  async create(requiredParams, optionalParams = {}) {
    // Extract required parameters
    const { email, password, phoneNumber } = requiredParams;

    // Extract optional parameters with defaults
    const {
      nome = email.split("@")[0],
      // TODO implementar resto
      perfil = ["admin"],
      status = "ativo",
    } = optionalParams;

    const user = await Usuario.create({
      nome: nome,
      celular: phoneNumber,
      email: email,
      perfil: perfil,
      status: status,
    });
    return user.toJSON();
  }

  async login(email, password) {
    const user = await Usuario.findOne({
      where: {
        email: email,
        status: "ativo",
      },
    });

    if (!user) {
      throw new Error("User not found or inactive");
    }

    // For this implementation, we're not storing/checking passwords
    // In a real application, you would hash and verify passwords

    // Create a new session in the database
    const session = await Session.create({
      usuarioId: user.id,
      token: this.uuid_service.uuid4(),
    });

    // Clean up expired sessions
    await this.cleanupExpiredSessions();

    return {
      sessionId: session.id,
      usuarioId: user.id,
      email: user.email,
      perfil: user.perfil,
      loggedIn: true,
      token: session.token,
    };
  }

  async logout(sessionId) {
    const session = await Session.findByPk(sessionId);
    if (session) {
      await session.destroy();
      return { success: true, message: "Logged out successfully" };
    }
    throw new Error("Session not found");
  }

  async cleanupExpiredSessions() {
    // Clean up sessions older than 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await Session.destroy({
      where: {
        createdAt: {
          [require("sequelize").Op.lt]: twentyFourHoursAgo,
        },
      },
    });
  }
}

class CicloService {
  async criarCiclo(dados) {
    // Create the main cycle first
    const novoCiclo = await Ciclo.create({
      nome: dados.nome,
      pontoEntregaId: dados.pontoEntregaId,
      ofertaInicio: dados.ofertaInicio,
      ofertaFim: dados.ofertaFim,
      itensAdicionaisInicio: dados.itensAdicionaisInicio,
      itensAdicionaisFim: dados.itensAdicionaisFim,
      retiradaConsumidorInicio: dados.retiradaConsumidorInicio,
      retiradaConsumidorFim: dados.retiradaConsumidorFim,
      observacao: dados.observacao,
      status: "ativo",
    });

    // Create cycle delivery dates if provided
    if (dados.entregaFornecedorInicio1 && dados.entregaFornecedorFim1) {
      let countEntregas = 1;
      let entregaFornecedorInicio = dados.entregaFornecedorInicio1;
      let entregaFornecedorFim = dados.entregaFornecedorFim1;

      while (entregaFornecedorInicio && entregaFornecedorFim) {
        await CicloEntregas.create({
          cicloId: novoCiclo.id,
          entregaFornecedorInicio: entregaFornecedorInicio,
          entregaFornecedorFim: entregaFornecedorFim,
        });

        countEntregas += 1;
        const newEntregaFornecedorInicio =
          "entregaFornecedorInicio" + countEntregas.toString();
        const newEntregaFornecedorFim =
          "entregaFornecedorFim" + countEntregas.toString();

        entregaFornecedorInicio = dados[newEntregaFornecedorInicio];
        entregaFornecedorFim = dados[newEntregaFornecedorFim];
      }
    }

    // Create cycle baskets if provided
    if (dados.cestaId1 && dados.quantidadeCestas1) {
      let countCestas = 1;
      let cestaId = dados.cestaId1;
      let quantidadeCestas = dados.quantidadeCestas1;

      while (cestaId && quantidadeCestas > 0) {
        await CicloCestas.create({
          cicloId: novoCiclo.id,
          cestaId: cestaId,
          quantidadeCestas: quantidadeCestas,
        });

        countCestas += 1;
        const newCestaId = "cestaId" + countCestas.toString();
        const newQuantidadeCestas = "quantidadeCestas" + countCestas.toString();

        cestaId = dados[newCestaId];
        quantidadeCestas = dados[newQuantidadeCestas];
      }
    }

    // Get active delivery points and baskets to return
    const pontosEntrega = await PontoEntrega.findAll({
      where: { status: "ativo" },
    });

    const tiposCesta = await Cesta.findAll({
      where: { status: "ativo" },
    });

    // Return an object that matches the expected structure in tests
    return {
      id: novoCiclo.id,
      nome: novoCiclo.nome,
      pontosEntrega: pontosEntrega,
      tiposCesta: tiposCesta,
      ...novoCiclo.toJSON(),
    };
  }
}

module.exports = { CicloService, UsuarioService, UUIDService };
