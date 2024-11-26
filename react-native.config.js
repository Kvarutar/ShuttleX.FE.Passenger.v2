const path = require('path');
const integrationPackageJson = require('./node_modules/shuttlex-integration/package.json');

// Autolinking libraries in the 'dependencies' field of shuttlex-integration package
const integrationAutolinkingDeps = {};
Object.keys(integrationPackageJson.dependencies).forEach(key => {
  integrationAutolinkingDeps[key] = { root: path.join(__dirname, `./node_modules/${key}`) };
});

module.exports = {
  assets: ['./node_modules/shuttlex-integration/src/assets/fonts'], // connects fonts
  dependencies: integrationAutolinkingDeps,
};
