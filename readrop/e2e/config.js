export default {
  default: {
    paths: ['e2e/features/**/*.feature'],
    require: ['e2e/step-definitions/**/*.js', 'e2e/support/hooks.js', 'e2e/support/world.cjs'],
    publishQuiet: true,
    format: ['summary'],
  },
};
