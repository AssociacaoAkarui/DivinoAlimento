module.exports = {
  default: {
    require: ["features/step_definitions/*.js"],
    format: ["progress"],
  },
  publish: { quiet: true },
  import: {
    default: ["@cucumber/cucumber"],
  },
};
