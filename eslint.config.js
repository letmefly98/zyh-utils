import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    typescript: true,
    vue: true,
  },
  {
    rules: {
      'style/curly': 0, // 允许 if 等能与结构体能同行
      'antfu/if-newline': 0, // 允许 if 等能与结构体能同行
      'style/brace-style': [2, '1tbs'], // 大括号风格
      'style/indent': [2, 2], // 缩进风格
      'no-console': 0, // 允许 console
      '@typescript-eslint/explicit-function-return-type': 0, // 允许 ts 不写函数返回类型
      'vue/html-self-closing': [1, { html: { void: 'always' } }],
      'jsdoc/no-defaults': 0, // 允许 jsdoc 写 defaultValue
    },
  },
)
