require("ignore-styles");
require("global-jsdom/register");
require("tsconfig-paths/register");

const { register } = require("ts-node");
const chai = require("chai");

global.expect = chai.expect;

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
