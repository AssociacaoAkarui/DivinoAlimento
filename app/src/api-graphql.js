const fs = require("fs");
const path = require("path");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");

const rootValue = {
  healthcheck: async () => {
    return {
      status: "ok",
    };
  },
  sessionLogin: async (args, context) => {
    const session = await context.usuarioService.login(
      args.input.email,
      args.input.password,
    );

    return {
      usuarioId: session.usuarioId,
      token: session.token,
    };
  },
};

const schemaSDL = fs.readFileSync(path.join(__dirname, "api.graphql"), "utf8");

const schema = buildSchema(schemaSDL);

const API = {
  rootValue,
  schema,
};

module.exports = {
  injectRoute: (app) => {
    app.use("/graphql", createHandler({ schema, rootValue }));

    // Serve GraphiQL IDE
    app.get("/ruru", (_req, res) => {
      res.type("html");
      res.end(ruruHTML({ endpoint: "/graphql" }));
    });
  },
};
