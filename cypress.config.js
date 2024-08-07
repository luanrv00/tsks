const {defineConfig} = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    //baseUrl: 'http://app:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/index.js',
  },
  screenshotOnRunFailure: false,
  video: false,
})
