const {defineConfig} = require('cypress')

module.exports = defineConfig({
  e2e: {
    // baseUrl: 'http://localhost:3000',
    baseUrl: 'http://app_test_e2e:3002',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/index.js',
  },
  screenshotOnRunFailure: false,
  video: false,
})
