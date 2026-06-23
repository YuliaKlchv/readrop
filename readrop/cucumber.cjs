module.exports = {
  default: {
    paths: ['e2e/features/**/*.feature'],
    require: ['e2e/step-definitions/**/*.js', 'e2e/support/**/*.cjs'],
    publishQuiet: true,
    format: ['summary'],
  }
};
