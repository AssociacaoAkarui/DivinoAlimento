require("ignore-styles");
require("global-jsdom/register");
require("tsconfig-paths/register");

const { register } = require("ts-node");

register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    jsx: "react",
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    baseUrl: ".",
    paths: {
      "@/*": ["./src/*"],
    },
  },
});
