module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'space-before-function-paren': 'off',
    semi: 'off',
    indent: 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    'vue/order-in-components': 'off',
    'vue/name-property-casing': 'off',
    'no-new': 'off',
    'object-property-newline': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
