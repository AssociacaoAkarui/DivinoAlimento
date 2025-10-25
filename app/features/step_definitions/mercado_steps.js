const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { CestaFactory } = require("./support/factories");
const { CestaService } = require("../../src/services/services");
const ServiceError = require("../../src/utils/ServiceError");

Given('que eu quero criar um novo mercado tipo Cesta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('exista um usuário cadastrado com nome {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu preencho o nome do mercado com {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o tipo do mercado como Cesta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o responsável do mercado tipo Cesta como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('a taxa administrativa como {int}', function (int) {
         // When('a taxa administrativa como {float}', function (float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o ponto de entrega como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o valor máximo do mercado tipo Cesta como {int}', function (int) {
         // When('o valor máximo do mercado tipo Cesta como {float}', function (float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o status do mercado tipo Cesta como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu salvo o novo mercado tipo Cesta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('o mercado tipo Cesta {string} deve ser criado com sucesso com o ponto de entrega {string} deve ser criado vinculado ao mercado {string}', function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que eu quero criar um novo mercado tipo Lote', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o tipo do mercado como Lote', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o responsável do mercado tipo Lote como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o status do mercado como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

 When('eu salvo o novo mercado tipo Lote', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

 Then('o mercado tipo Lote {string} deve ser criado com sucesso com o ponto de entrega {string} deve ser criado vinculado ao mercado {string}', function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que eu quero criar um novo mercado tipo Venda Direta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o tipo do mercado como Venda Direta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

 When('o responsável do mercado tipo Venda Direta como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('o status do mercado tipo Venda Direta como {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu salvo o novo mercado tipo Venda Direta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('o mercado tipo Venda Direta {string} deve ser criado com sucesso com o ponto de entrega {string} deve ser criado vinculado ao mercado {string}', function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que existe um mercado {string} cadastrado', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu solicito os detalhes do mercado {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('eu devo ver os detalhes do mercado {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que existe um mercado tipo Cesta {string} cadastrado', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu edito o nome do mercado {string} para {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('edito o responsável de {string} para {string}', function (string, string2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('edito a taxa administrativa de {int} para {int}', function (int, int2) {
         // When('edito a taxa administrativa de {int} para {float}', function (int, float) {
         // When('edito a taxa administrativa de {float} para {int}', function (float, int) {
         // When('edito a taxa administrativa de {float} para {float}', function (float, float2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('edito o valor máximo do mercado de {int} para {int}', function (int, int2) {
         // When('edito o valor máximo do mercado de {int} para {float}', function (int, float) {
         // When('edito o valor máximo do mercado de {float} para {int}', function (float, int) {
         // When('edito o valor máximo do mercado de {float} para {float}', function (float, float2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('salvo as alterações do mercado tipo Cesta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {int}, com valor máximo {int}', function (string, string2, int, int2) {
         // Then('o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {int}, com valor máximo {float}', function (string, string2, int, float) {
         // Then('o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {float}, com valor máximo {int}', function (string, string2, float, int) {
         // Then('o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {float}, com valor máximo {float}', function (string, string2, float, float2) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que existe um mercado tipo Lote {string} cadastrado', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('salvo as alterações do mercado tipo Lote', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {int}', function (string, string2, int) {
         // Then('o nome do mercado deve ser {string}, com responsável {string}, com taxa administrativa {float}', function (string, string2, float) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que existe um mercado tipo Venda Direta {string} cadastrado', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('salvo as alterações do mercado tipo Venda Direta', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que não exista nenhum ciclo que seja composto pelo mercado {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu deleto o mercado {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('o mercado {string} não deve mais existir no sistema', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que existem mercados {string}, {string} e {string} cadastrados', function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que todos tenham como administrador o usuário {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('todos os mercados estão com status {string}', function (string) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

When('eu solicito a lista de mercados ativos', function () {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Then('eu devo ver os mercados {string}, {string} e {string}', function (string, string2, string3) {
           // Write code here that turns the phrase above into concrete actions
           return 'pending';
         });

Given('que eu quero criar um novo Mercado', function () {
            // Write code here that turns the phrase above into concrete actions
            return 'pending';
          });
  
When('eu tento salvar o novo mercado', function () {
            // Write code here that turns the phrase above into concrete actions
            return 'pending';
          });

Then('eu devo receber um erro de validação', function () {
            // Write code here that turns the phrase above into concrete actions
            return 'pending';
          });