module.exports = {
  root: true,
  parserOptions: { project: 'tsconfig.json' },
  ignorePatterns: ['/*', '!/src'],
  extends: './node_modules/shuttlex-integration/devtools/eslintDefaultConfig.json',
};
