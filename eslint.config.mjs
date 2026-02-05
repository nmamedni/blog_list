import globals from "globals"
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'


export default [
  js.configs.recommended,
  { 
    files: ["**/*.js"], 
    languageOptions: { 
      sourceType: "commonjs",
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: { 
      '@stylistic/js': stylisticJs,
    },
    rules: { 
      '@stylistic/js/indent': ['warn', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['warn', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'warn',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }], 
      'no-console': 'off',
      'no-unused-vars': ["warn", { "args": "none" }],
    }, 
  },
  // { 
  //   files: ["**/*.{js,mjs,cjs}"], 
  //   languageOptions: { 
  //     globals: globals.browser 
  //   } 
  // },
  { 
    ignores: ['dist/**'], 
  },
];
