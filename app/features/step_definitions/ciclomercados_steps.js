const { Given, When, Then, Before, After } = require("@cucumber/cucumber");
const assert = require("assert");
const { CicloMercadoService } = require("../../src/services/services.js");
const {
  CicloMercados,
  Ciclo,
  Mercado,
  PontoEntrega,
  Usuario,
} = require("../../models");

const cicloMercadoService = new CicloMercadoService();

let currentCiclo = null;
let currentMercado = null;
let currentPontoEntrega = null;
let currentCicloMercado = null;
let cicloMercadosList = [];
let createdCicloMercados = [];
let createdCiclos = [];
let createdMercados = [];
let createdPontosEntrega = [];
let createdUsuarios = [];
let validationError = null;

Before(async function () {
  currentCiclo = null;
  currentMercado = null;
  currentPontoEntrega = null;
  currentCicloMercado = null;
  cicloMercadosList = [];
  createdCicloMercados = [];
  createdCiclos = [];
  createdMercados = [];
  createdPontosEntrega = [];
  createdUsuarios = [];
  validationError = null;
});

After(async function () {
  // Limpar dados criados durante os testes
  for (const cicloMercado of createdCicloMercados) {
    try {
      await CicloMercados.destroy({ where: { id: cicloMercado.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }

  for (const ciclo of createdCiclos) {
    try {
      await Ciclo.destroy({ where: { id: ciclo.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }

  for (const mercado of createdMercados) {
    try {
      await Mercado.destroy({ where: { id: mercado.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }

  for (const ponto of createdPontosEntrega) {
    try {
      await PontoEntrega.destroy({ where: { id: ponto.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }

  for (const usuario of createdUsuarios) {
    try {
      await Usuario.destroy({ where: { id: usuario.id } });
    } catch (error) {
      // Ignorar erros de limpeza
    }
  }
});

Given("que existe um mercado tipo {string} cadastrado", async function (tipo) {
  // Criar usuário responsável se não existir
  let usuario = await Usuario.findOne({
    where: { email: "admin.test@divinos.com" },
  });
  if (!usuario) {
    usuario = await Usuario.create({
      nome: "Admin Teste BDD",
      email: "admin.test@divinos.com",
      senha: "senha123",
      perfis: JSON.stringify(["adminmercado"]),
      status: "ativo",
    });
    createdUsuarios.push(usuario);
  }

  currentMercado = await Mercado.create({
    nome: `Mercado Teste ${tipo} BDD`,
    tipo: tipo,
    responsavelId: usuario.id,
    status: "ativo",
  });
  createdMercados.push(currentMercado);
  this.currentMercado = currentMercado; // Compartir en contexto
});

When(
  "eu associo o mercado ao ciclo com tipo de venda {string}",
  async function (tipoVenda, dataTable) {
    const data = dataTable.rowsHash();

    // Obter valores do contexto compartido (this) se existir
    const ciclo = this.currentCiclo || currentCiclo;
    const mercado = this.currentMercado || currentMercado;
    const pontoEntrega = this.currentPontoEntrega || currentPontoEntrega;

    const input = {
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      tipoVenda: tipoVenda,
      pontoEntregaId: pontoEntrega.id,
      ordemAtendimento: parseInt(data.ordemAtendimento) || 1,
    };

    if (data.quantidadeCestas) {
      input.quantidadeCestas = parseInt(data.quantidadeCestas);
    }
    if (data.valorAlvoCesta) {
      input.valorAlvoCesta = parseFloat(data.valorAlvoCesta);
    }
    if (data.valorAlvoLote) {
      input.valorAlvoLote = parseFloat(data.valorAlvoLote);
    }

    try {
      currentCicloMercado =
        await cicloMercadoService.adicionarMercadoCiclo(input);
      createdCicloMercados.push(currentCicloMercado);
    } catch (error) {
      validationError = error;
    }
  },
);

When("eu tento associar o mercado sem quantidade de cestas", async function () {
  const ciclo = this.currentCiclo || currentCiclo;
  const mercado = this.currentMercado || currentMercado;
  const pontoEntrega = this.currentPontoEntrega || currentPontoEntrega;

  try {
    await cicloMercadoService.adicionarMercadoCiclo({
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      tipoVenda: "cesta",
      pontoEntregaId: pontoEntrega.id,
      ordemAtendimento: 1,
      // Falta quantidadeCestas e valorAlvoCesta
    });
  } catch (error) {
    validationError = error;
  }
});

When("eu tento associar o mesmo mercado novamente", async function () {
  const ciclo = this.currentCiclo || currentCiclo;
  const mercado = this.currentMercado || currentMercado;
  const pontoEntrega = this.currentPontoEntrega || currentPontoEntrega;

  try {
    await cicloMercadoService.adicionarMercadoCiclo({
      cicloId: ciclo.id,
      mercadoId: mercado.id,
      tipoVenda: "cesta",
      pontoEntregaId: pontoEntrega.id,
      ordemAtendimento: 1,
      quantidadeCestas: 50,
      valorAlvoCesta: 80.0,
    });
  } catch (error) {
    validationError = error;
  }
});

Given(
  "que existem {int} mercados associados ao ciclo",
  async function (quantidade) {
    const ciclo = this.currentCiclo || currentCiclo;
    const pontoEntrega = this.currentPontoEntrega || currentPontoEntrega;

    // Criar usuário responsável
    let usuario = await Usuario.findOne({
      where: { email: "admin.test@divinos.com" },
    });
    if (!usuario) {
      usuario = await Usuario.create({
        nome: "Admin Teste BDD",
        email: "admin.test@divinos.com",
        senha: "senha123",
        perfis: JSON.stringify(["adminmercado"]),
        status: "ativo",
      });
      createdUsuarios.push(usuario);
    }

    for (let i = 1; i <= quantidade; i++) {
      const mercado = await Mercado.create({
        nome: `Mercado Teste ${i} BDD`,
        tipo: "cesta",
        responsavelId: usuario.id,
        status: "ativo",
      });
      createdMercados.push(mercado);

      const cicloMercado = await cicloMercadoService.adicionarMercadoCiclo({
        cicloId: ciclo.id,
        mercadoId: mercado.id,
        tipoVenda: "cesta",
        pontoEntregaId: pontoEntrega.id,
        ordemAtendimento: i,
        quantidadeCestas: 50,
        valorAlvoCesta: 80.0,
      });
      createdCicloMercados.push(cicloMercado);
    }
  },
);

Given(
  "que existe um ciclo com {int} mercados associados",
  async function (quantidade) {
    // Si no hay ciclo, crear uno primero
    if (!this.currentCiclo && !currentCiclo) {
      const { CicloService } = require("../../src/services/services.js");
      const cicloService = new CicloService();

      let pontoEntrega = await PontoEntrega.findOne({
        where: { status: "ativo" },
      });
      if (!pontoEntrega) {
        pontoEntrega = await PontoEntrega.create({
          nome: "Ponto Entrega Teste BDD",
          endereco: "Rua Teste, 123",
          bairro: "Centro",
          cidade: "São Paulo",
          estado: "SP",
          cep: "01000-000",
          status: "ativo",
        });
      }
      currentPontoEntrega = pontoEntrega;
      this.currentPontoEntrega = pontoEntrega;

      const agora = new Date();
      const umaSemanaDepois = new Date(
        agora.getTime() + 7 * 24 * 60 * 60 * 1000,
      );

      currentCiclo = await cicloService.criarCiclo({
        nome: "Ciclo Teste BDD",
        ofertaInicio: agora,
        ofertaFim: umaSemanaDepois,
        pontoEntregaId: pontoEntrega.id,
      });
      createdCiclos.push(currentCiclo);
      this.currentCiclo = currentCiclo;
    }

    const ciclo = this.currentCiclo || currentCiclo;
    const pontoEntrega = this.currentPontoEntrega || currentPontoEntrega;

    // Criar usuário responsável
    let usuario = await Usuario.findOne({
      where: { email: "admin.test@divinos.com" },
    });
    if (!usuario) {
      usuario = await Usuario.create({
        nome: "Admin Teste BDD",
        email: "admin.test@divinos.com",
        senha: "senha123",
        perfis: JSON.stringify(["adminmercado"]),
        status: "ativo",
      });
      createdUsuarios.push(usuario);
    }

    for (let i = 1; i <= quantidade; i++) {
      const mercado = await Mercado.create({
        nome: `Mercado Teste ${i} BDD`,
        tipo: "cesta",
        responsavelId: usuario.id,
        status: "ativo",
      });
      createdMercados.push(mercado);

      const cicloMercado = await cicloMercadoService.adicionarMercadoCiclo({
        cicloId: ciclo.id,
        mercadoId: mercado.id,
        tipoVenda: "cesta",
        pontoEntregaId: pontoEntrega.id,
        ordemAtendimento: i,
        quantidadeCestas: 50,
        valorAlvoCesta: 80.0,
      });
      createdCicloMercados.push(cicloMercado);
    }
  },
);

Given("que existe um ciclo com mercado associado", async function () {
  // Si no hay ciclo, crear uno primero
  if (!this.currentCiclo && !currentCiclo) {
    const { CicloService } = require("../../src/services/services.js");
    const cicloService = new CicloService();

    let pontoEntrega = await PontoEntrega.findOne({
      where: { status: "ativo" },
    });
    if (!pontoEntrega) {
      pontoEntrega = await PontoEntrega.create({
        nome: "Ponto Entrega Teste BDD",
        endereco: "Rua Teste, 123",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01000-000",
        status: "ativo",
      });
    }
    currentPontoEntrega = pontoEntrega;
    this.currentPontoEntrega = pontoEntrega;

    const agora = new Date();
    const umaSemanaDepois = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);

    currentCiclo = await cicloService.criarCiclo({
      nome: "Ciclo Teste BDD",
      ofertaInicio: agora,
      ofertaFim: umaSemanaDepois,
      pontoEntregaId: pontoEntrega.id,
    });
    createdCiclos.push(currentCiclo);
    this.currentCiclo = currentCiclo;
  }

  const ciclo = this.currentCiclo || currentCiclo;
  const pontoEntrega = this.currentPontoEntrega || currentPontoEntrega;

  // Criar mercado
  let usuario = await Usuario.findOne({
    where: { email: "admin.test@divinos.com" },
  });
  if (!usuario) {
    usuario = await Usuario.create({
      nome: "Admin Teste BDD",
      email: "admin.test@divinos.com",
      senha: "senha123",
      perfis: JSON.stringify(["adminmercado"]),
      status: "ativo",
    });
    createdUsuarios.push(usuario);
  }

  currentMercado = await Mercado.create({
    nome: "Mercado Teste BDD",
    tipo: "cesta",
    responsavelId: usuario.id,
    status: "ativo",
  });
  createdMercados.push(currentMercado);
  this.currentMercado = currentMercado;

  // Associar ao ciclo
  currentCicloMercado = await cicloMercadoService.adicionarMercadoCiclo({
    cicloId: ciclo.id,
    mercadoId: currentMercado.id,
    tipoVenda: "cesta",
    pontoEntregaId: pontoEntrega.id,
    ordemAtendimento: 1,
    quantidadeCestas: 50,
    valorAlvoCesta: 80.0,
  });
  createdCicloMercados.push(currentCicloMercado);
  this.currentCicloMercado = currentCicloMercado;
});

When("eu listo os mercados do ciclo", async function () {
  const ciclo = this.currentCiclo || currentCiclo;
  cicloMercadosList = await cicloMercadoService.listarMercadosPorCiclo(
    ciclo.id,
  );
});

When(
  "eu atualizo a ordem de atendimento do segundo mercado para {int}",
  async function (novaOrdem) {
    const ciclo = this.currentCiclo || currentCiclo;
    const mercados = await cicloMercadoService.listarMercadosPorCiclo(ciclo.id);
    const segundoMercado = mercados[1];

    await cicloMercadoService.atualizarMercadoCiclo(segundoMercado.id, {
      ordemAtendimento: novaOrdem,
    });
  },
);

When("eu removo o mercado do ciclo", async function () {
  await cicloMercadoService.removerMercadoCiclo(currentCicloMercado.id);
  // Remover da lista para não tentar limpar novamente
  createdCicloMercados = createdCicloMercados.filter(
    (cm) => cm.id !== currentCicloMercado.id,
  );
});

Then("o mercado deve estar associado ao ciclo", async function () {
  const ciclo = this.currentCiclo || currentCiclo;
  const mercado = this.currentMercado || currentMercado;
  const cicloMercado = await CicloMercados.findOne({
    where: {
      cicloId: ciclo.id,
      mercadoId: mercado.id,
    },
  });
  assert(cicloMercado, "Mercado não está associado ao ciclo");
});

Then("o tipo de venda deve ser {string}", async function (tipoVenda) {
  const ciclo = this.currentCiclo || currentCiclo;
  const mercado = this.currentMercado || currentMercado;
  const cicloMercado = await CicloMercados.findOne({
    where: {
      cicloId: ciclo.id,
      mercadoId: mercado.id,
    },
  });
  assert.strictEqual(cicloMercado.tipoVenda, tipoVenda);
});

Then("a quantidade de cestas deve ser {int}", async function (quantidade) {
  const ciclo = this.currentCiclo || currentCiclo;
  const mercado = this.currentMercado || currentMercado;
  const cicloMercado = await CicloMercados.findOne({
    where: {
      cicloId: ciclo.id,
      mercadoId: mercado.id,
    },
  });
  assert.strictEqual(cicloMercado.quantidadeCestas, quantidade);
});

Then("deve retornar {int} mercados", function (quantidade) {
  assert.strictEqual(cicloMercadosList.length, quantidade);
});

Then("a ordem de atendimento deve ser atualizada", async function () {
  const ciclo = this.currentCiclo || currentCiclo;
  const mercados = await cicloMercadoService.listarMercadosPorCiclo(ciclo.id);
  const primeiroMercado = mercados.find((m) => m.ordemAtendimento === 1);
  assert(primeiroMercado, "Mercado com ordem 1 não encontrado");
});

Then("o mercado não deve estar mais associado ao ciclo", async function () {
  const cicloMercado = await CicloMercados.findByPk(currentCicloMercado.id);
  assert.strictEqual(
    cicloMercado,
    null,
    "Mercado ainda está associado ao ciclo",
  );
});

Then("deve retornar erro de validação", function () {
  assert(validationError, "Erro de validação não foi lançado");
  assert(
    validationError.message.includes("obrigatório") ||
      validationError.message.includes("obrigatória") ||
      validationError.message.includes("required"),
    `Mensagem de erro não indica campo obrigatório: ${validationError.message}`,
  );
});

Then("deve retornar erro de duplicação", function () {
  assert(validationError, "Erro de duplicação não foi lançado");
  assert(
    validationError.message.includes("unique") ||
      validationError.message.includes("duplicado") ||
      validationError.message.includes("associado") ||
      validationError.name === "SequelizeUniqueConstraintError",
    `Mensagem de erro não indica duplicação: ${validationError.message}`,
  );
});
