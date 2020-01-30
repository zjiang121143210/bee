module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "airbnb",
  // "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    'func-names': 0,
    'no-underscore-dangle': 0,
    'eol-last': 0,
    'no-restricted-syntax': 0,
    'prefer-destructuring': 0,
  }
};