module.exports = {
  default: {
    require: ["features/step_definitions/*.js"],
    format: ["pretty"],
    formatOptions: {
      quiet: true,
    },
  },
  import: {
    default: ["@cucumber/cucumber"],
  },
};
