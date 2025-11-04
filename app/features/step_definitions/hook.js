const { Before, After } = require("@cucumber/cucumber");

const { sequelize } = require("../../models");

Before(async function () {
  await sequelize.sync({ force: true });
});

// After(async function() {
//   await sequelize.close();
// });
