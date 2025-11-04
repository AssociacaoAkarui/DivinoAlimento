const express = require("express");
const routes = express.Router();
const { createHandler } = require("graphql-http/lib/use/express");

const IndexController = require("./controllers/IndexController");
const LimiteSolarController = require("./controllers/LimiteSolarController");

const CicloController = require("./controllers/CicloController");
const CicloIndexController = require("./controllers/CicloIndexController");

const CestaController = require("./controllers/CestaController");
const CestaIndexController = require("./controllers/CestaIndexController");

const ProdutoController = require("./controllers/ProdutoController");
const ProdutoIndexController = require("./controllers/ProdutoIndexController");

const CategoriaController = require("./controllers/CategoriaController");
const CategoriaIndexController = require("./controllers/CategoriaIndexController");

const PontoEntregaController = require("./controllers/PontoEntregaController");
const PontoEntregaIndexController = require("./controllers/PontoEntregaIndexController");

const UsuarioController = require("./controllers/UsuarioController");
const UsuarioIndexController = require("./controllers/UsuarioIndexController");

const MovimentacaoController = require("./controllers/MovimentacaoController");
const MovimentacaoIndexController = require("./controllers/MovimentacaoIndexController");

const OfertaController = require("./controllers/OfertaController");
const OfertaIndexController = require("./controllers/OfertaIndexController");

//const ComposicaoController = require('./controllers/ComposicaoController')

const ComposicaoController = require("./controllers/ComposicaoController");

const PedidoConsumidoresController = require("./controllers/PedidoConsumidoresController");

const RelatoriosController = require("./controllers/RelatoriosController");

const ProfileController = require("./controllers/ProfileController");

const RelatorioController = require("./controllers/RelatorioController");

// codigo que precisou no do myke - meu não deu mesmo erro
const views = __dirname + "/views/";

const profile = {
  name: "Jack nova",
  avatar:
    "https://avatars.githubusercontent.com/u/17316392?s=460&u=6912a91a70bc89745a2079fdcdad3bc3ce370f13&v=4",
  "monthly-budget": 3000,
  "days-per-week": 5,
  "hours-per-day": 5,
  "vacation-per-year": 4,
};

const { requiresAuth } = require("express-openid-connect");

// Middleware para CORS (se necessário)
routes.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// API GRAPHQL
const { default: APIGraphql } = require("./api-graphql");
routes.use("/graphql", (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  req.bearerToken = bearerToken;
  return createHandler({
    schema: APIGraphql.schema,
    rootValue: APIGraphql.rootValue,
    context: APIGraphql.buildContext(bearerToken),
  })(req, res, next);
});
//routes.get('/', (req, res) => {IndexController.showIndex(JSON.stringify(req.oidc.user))})

routes.get("/", IndexController.showIndex);
routes.get("/callback", IndexController.showIndex);

routes.get("/limitesolar", LimiteSolarController.showIndex);

routes.get("/profile", (req, res) => {
  console.log(JSON.stringify(req.oidc.user));
  res.send(JSON.stringify(req.oidc.user));
});

//routes.get('/', CicloIndexController.index)
//routes.post('/callback', CicloIndexController.index)
routes.get("/ciclo-index", CicloIndexController.index);
routes.get("/ciclo", CicloController.create);
routes.post("/ciclo", CicloController.save);
routes.get("/ciclo/:id", CicloController.show);
routes.post("/ciclo/:id", CicloController.update);
routes.post("/ciclo/delete/:id", CicloController.delete);

routes.get("/cesta-index", CestaIndexController.index);
routes.get("/cesta", CestaController.create);
routes.post("/cesta", CestaController.save);
routes.get("/cesta/:id", CestaController.show);
routes.post("/cesta/:id", CestaController.update);
routes.post("/cesta/delete/:id", CestaController.delete);

routes.get("/produto-index", ProdutoIndexController.index);
routes.get("/produto", ProdutoController.create);
routes.post("/produto", ProdutoController.save);
routes.get("/produto/:id", ProdutoController.show);
routes.post("/produto/:id", ProdutoController.update);
routes.post("/produto/delete/:id", ProdutoController.delete);

routes.get("/categoria-index", CategoriaIndexController.index);
routes.get("/categoria", CategoriaController.create);
routes.post("/categoria", CategoriaController.save);
routes.get("/categoria/:id", CategoriaController.show);
routes.post("/categoria/:id", CategoriaController.update);
routes.post("/categoria/delete/:id", CategoriaController.delete);

routes.get("/pontoentrega-index", PontoEntregaIndexController.index);
routes.get("/pontoentrega", PontoEntregaController.create);
routes.post("/pontoentrega", PontoEntregaController.save);
routes.get("/pontoentrega/:id", PontoEntregaController.show);
routes.post("/pontoentrega/:id", PontoEntregaController.update);
routes.post("/pontoentrega/delete/:id", PontoEntregaController.delete);

routes.get("/usuario-index", UsuarioIndexController.index);
routes.get("/usuario", UsuarioController.create);
routes.post("/usuario", UsuarioController.save);
routes.get("/usuario/:id", UsuarioController.show);
routes.post("/usuario/:id", UsuarioController.update);
routes.post("/usuario/delete/:id", UsuarioController.delete);
routes.get("/usuarionovo", UsuarioController.createAutomatico);
routes.post("/usuarionovo", UsuarioController.saveAutomatico);
routes.post("/usuarionovo/:id", UsuarioController.updateAutomatico);

//routes.get('/movimentacao-index', MovimentacaoIndexController.index)
//routes.get('/movimentacao/:id', MovimentacaoController.showCreateEdit)
//routes.post('/movimentacao', MovimentacaoController.save)
//routes.post('/movimentacao/delete/:id', MovimentacaoController.delete)
routes.get("/movimentacaotodos", MovimentacaoController.showTodasMovimentacoes);

routes.get("/oferta-index", OfertaIndexController.index);
routes.get("/oferta/:id", OfertaController.showCreateEdit);
routes.post("/oferta", OfertaController.savePartial);
routes.post("/ofertasave", OfertaController.save);
routes.post("/ofertaapagarproduto", OfertaController.apagarProduto);
//routes.post('/oferta/delete/:id', OfertaController.delete)

//routes.get('/composicao/:id', ComposicaoController.showCreateEdit)
//routes.post('/composicao', ComposicaoController.savePartial)
//routes.post('/composicaosave', ComposicaoController.save)

routes.get("/composicao/:id", ComposicaoController.showCreateEdit);
routes.post("/composicao/:id", ComposicaoController.showCreateEdit);
routes.post("/composicaosave", ComposicaoController.save);

routes.get(
  "/pedidosfornecedorestodosold/:id",
  ComposicaoController.showTodosPedidosFornecedoresOld,
);
routes.get(
  "/pedidosfornecedorestodos/:id",
  ComposicaoController.showTodosPedidosFornecedores,
);
routes.get(
  "/pedidosfornecedoressobra/:id",
  ComposicaoController.showComposicaoSobraOferta,
);
routes.get("/pedidosfornecedoresciclos", RelatorioController.showTodosCiclos);
routes.post(
  "/pedidosfornecedoresciclos",
  RelatorioController.showPedidosFornecedoresCiclos,
);
routes.get(
  "/pedidosconsumidoresciclos",
  RelatorioController.showTodosCiclosConsumidores,
);
routes.post(
  "/pedidosconsumidoresciclos",
  RelatorioController.showPedidosConsumidoresCiclos,
);
routes.get(
  "/pedidosfornecedores/:id",
  ComposicaoController.showPedidosFornecedores,
);
routes.get(
  "/downloadpedidosfornecedoresciclos",
  RelatorioController.downloadPedidosFornecedoresCiclos,
);

routes.get(
  "/relatorioprodutosciclos",
  RelatorioController.showTodosCiclosProdutos,
);
routes.post(
  "/relatorioprodutosciclos",
  RelatorioController.showRelatorioProdutosCiclos,
);

// teste login
routes.get(
  "/pedidoconsumidores/:id",
  PedidoConsumidoresController.showCreateEdit,
);
routes.get(
  "/pedidoconsumidoresconfirmacao/:id",
  PedidoConsumidoresController.showConfirmacao,
);
routes.post("/pedidoconsumidores", PedidoConsumidoresController.save);
routes.post(
  "/pedidoconsumidoresconfirmacao",
  PedidoConsumidoresController.finalizar,
);

routes.get(
  "/pedidosconsumidorestodos/:id",
  PedidoConsumidoresController.showTodosPedidosConsumidores,
);

routes.get(
  "/entregaCicloPDF/:id",
  RelatoriosController.downloadEntregaCicloPDF,
);

routes.get("/profile", ProfileController.index);
routes.post("/profile", ProfileController.update);

// req, res
routes.get("/cadastros", (req, res) => res.render(views + "cadastros"));
//routes.get('/job-edit', (req, res) => res.render(views  + "job-edit"))
routes.get("/profile", (req, res) =>
  res.render(views + "profile", { profile }),
);

// Auth0

//const { auth } = require('express-openid-connect');

// auth router attaches /login, /logout, and /callback routes to the baseURL
//routes.use(auth(config));

// req.isAuthenticated is provided from the auth router
//routes.get('/pedidoconsumidores/:id', (req, res) => {
//res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
//});

/*routes.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});*/

//routes.get('/pedidoconsumidores/:id', requiresAuth(), PedidoConsumidoresController.showCreateEdit)
//routes.post('/pedidoconsumidores',requiresAuth(), PedidoConsumidoresController.save)

/*const PDFDocument =  require('pdfkit');

routes.get('/generatePDF', async function(req, res, next) {
var myDoc = new PDFDocument({bufferPages: true});

let buffers = [];
myDoc.on('data', buffers.push.bind(buffers));
myDoc.on('end', () => {

    let pdfData = Buffer.concat(buffers);
    res.writeHead(200, {
    'Content-Length': Buffer.byteLength(pdfData),
    'Content-Type': 'application/pdf',
    'Content-disposition': 'attachment;filename=test.pdf',})
    .end(pdfData);

});

myDoc.font('Times-Roman')
     .fontSize(12)
     .text(`CARMEN CARMEN CARMEN`);
myDoc.end();
});*/

module.exports = routes;
