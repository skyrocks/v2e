/*
 * @Author: shilei
 * @Date: 2020-10-15 14:51:40
 * @LastEditors: shilei
 * @LastEditTime: 2020-10-15 15:25:02
 * @Description: 这是一个什么文件...
 * @FilePath: /aolong-parrot/.eslintrc.js
 */
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
    ecmaFeatures: { //额外的语言特性
      legacyDecorators: true //装饰器@ 配置
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', '@vue/prettier'],

  'globals': { //日志
    '__log': true
  },

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'no-console': 'warn',
    "vue/no-v-html": "off",
    'vue/require-default-prop': 0, // 不检查默认属性
    'vue/require-prop-types': 0 // 不检查默认类型
  }
}
