const { Given, When, Then, Before } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { UsuarioService } = require("../../src/services/services");

let usuarioService;
let currentUser;
let loginResult;

Before(function () {
  usuarioService = new UsuarioService();
  currentUser = null;
  loginResult = null;
});

Given(
  "a user with email {string} and password {string} and phone number {string}",
  async function (email, password, phoneNumber) {
    currentUser = await usuarioService.create({ email, password, phoneNumber });
  },
);

When(
  "the user logs in with email {string} and password {string}",
  async function (email, password) {
    loginResult = await usuarioService.login(email, password);
  },
);

Then("the user should be logged in", function () {
  expect(loginResult).to.be.an("object");
  expect(loginResult.loggedIn).to.be.true;
  expect(loginResult.email).to.equal("admin@example.com");
  expect(loginResult.sessionId).to.exist;
  expect(loginResult.usuarioId).to.exist;
});
