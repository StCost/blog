module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "indent": [
      "error",
      2,
      {
        "SwitchCase": 1,
        "VariableDeclarator": {
          "var": 2,
          "let": 2,
          "const": 3
        },
        "MemberExpression": 1,
        "FunctionDeclaration": {
          "parameters": 1
        },
        "CallExpression": {
          "arguments": 1
        },
        "ArrayExpression": 1,
        "ObjectExpression": 1
      }
    ],
    "no-extra-semi": "error",
    "curly": [
      "error",
      "all"
    ],
    "quotes": [
      "error",
      "double",
      {
        "avoidEscape": true,
        "allowTemplateLiterals": true
      }
    ],
    "object-curly-spacing": [
      "error",
      "always"
    ],
    "comma-dangle": [
      "error",
      "never"
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "vars": "local",
        "args": "after-used"
      }
    ],
    "semi": [
      "error",
      "always",
      {
        "omitLastInOneLineBlock": true
      }
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "never",
        "named": "never"
      }
    ],
    "brace-style": [
      "error",
      "1tbs"
    ],
    "keyword-spacing": "error",
    "eol-last": "error",
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
    "react/jsx-closing-bracket-location": "error",
    "react/react-in-jsx-scope": "off",
    "react/jsx-curly-spacing": [
      "error",
      "never"
    ],
    "react/jsx-equals-spacing": [
      "error",
      "never"
    ],
    "react/jsx-indent": [
      "error",
      2
    ],
    "react/jsx-key": "error",
    "react/jsx-no-bind": [
      "error",
      {
        "allowArrowFunctions": true
      }
    ],
    'react/prop-types': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'react/no-unescaped-entities': 0,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
