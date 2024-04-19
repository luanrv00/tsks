const {defineConfig} = require('cypress')

module.exports = defineConfig({
  "e2e": {
    "baseUrl": "http://app:3000",
    "spectPattern": "cypress/e2e/**/*.spec.js",
    "supportFile": false
  },
  "screenshotOnRunFailure": false,
  "video": false
})