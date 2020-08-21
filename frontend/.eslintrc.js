module.exports = {
  root: true,

  env: {
    node: true
  },

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
  },

  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ]
}
