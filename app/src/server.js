const dns = require("dns");
const express = require("express");
const server = express();
const routes = require("./routes");
const { createHandler } = require("graphql-http/lib/use/express");
const cors = require("cors");

var baseUrl = process.env.BASE_URL_APP;
let baseUrlAuth = process.env.BASE_URL_APP;
let ipMockAuth;
let port_auth = process.env.AUTH_PORT;
let port = process.env.PORT;
let NOT_USE_SSL = process.env.NOT_USE_SSL;
let clientID = process.env.clientID;
let issueBaseURL = process.env.issuerBaseURL;

var protocol = "https";

if (port == null || port == "") {
  port = 5000;
}

if (port_auth == null || port_auth == "") {
  port_auth = 8080;
}

if (NOT_USE_SSL === "true") {
  var protocol = "http";
  var baseUrl = `${baseUrl}:${port}`;
}

const path = require("path");

// usando template engine
server.set("view engine", "ejs");

//Mudar a localização da pasta views
server.set("views", path.join(__dirname, "views"));

// habilitar arquivos statics
server.use(express.static("public"));

// usar o req.body
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Habilitar CORS para permitir requisições do frontend
server.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//uso bootstrap e jquery
//server.use('/css', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/css')))
//server.use('/js', express.static(path.join(__dirname, '../node_modules/bootstrap/dist/js')))
//server.use('/js', express.static(path.join(__dirname, '../node_modules/jquery/dist')))

server.use("/css", express.static("node_modules/bootstrap/dist/css"));
server.use("/js", express.static("node_modules/bootstrap/dist/js"));
server.use("/js", express.static("node_modules/jquery/dist"));

// API GRAPHQL
const { default: APIGraphql } = require("./api-graphql");

// Habilitar interface GraphQL (ruru) apenas em desenvolvimento
if (process.env.NODE_ENV === "development") {
  const { ruruHTML } = require("ruru/server");

  server.get("/graphql", (_req, res) => {
    res.type("html");
    res.end(ruruHTML({ endpoint: "/graphql" }));
  });
}

server.all(
  "/graphql",
  createHandler({
    schema: APIGraphql.schema,
    rootValue: APIGraphql.rootValue,
    context: (req) => {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      const token = authHeader?.replace("Bearer ", "");
      return APIGraphql.buildContext(token);
    },
  }),
);

// Auth
const { auth } = require("express-openid-connect");

function init_server(config) {
  server.use(auth(config));
  server.use(function (req, res, next) {
    res.locals.user = req.oidc.user;
    next();
  });
  server.use(routes);
  server.listen(port, "0.0.0.0", () =>
    console.log(
      `Voce ta Rodando Agora!!!!! Server listening on 0.0.0.0:${port}`,
    ),
  );
}

if (process.env.NODE_ENV === "development") {
  // Mock OAuth removido - usar autenticação GraphQL diretamente
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: "a long, randomly-generated string stored in env",
    baseURL: `${protocol}://${baseUrl}`,
    clientID: "debugger",
    issuerBaseURL: `${protocol}://localhost:${port_auth}/default`,
    clientSecret: "debugger",
    authorizationParams: { response_type: "code" },
  };

  init_server(config);
}

if (process.env.NODE_ENV === "production") {
  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: "a long, randomly-generated string stored in env",
    baseURL: `${protocol}://${baseUrl}`,
    clientID: clientID,
    issuerBaseURL: issueBaseURL,
  };

  init_server(config);
}
