// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const angularEslintPlugin = require('@angular-eslint/eslint-plugin');
const angularEslintTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');
const unusedImports = require('eslint-plugin-unused-imports');
const stylisticTs = require('@stylistic/eslint-plugin-ts');
const stylisticPlus = require('@stylistic/eslint-plugin-plus');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      'angular-eslint-plugin': angularEslintPlugin,
      'angular-eslint-template-plugin': angularEslintTemplatePlugin,
      'unused-imports': unusedImports,
      '@stylistic/ts': stylisticTs,
      '@stylistic/plus': stylisticPlus,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      '@stylistic/ts/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'always-multiline',
          importAttributes: 'always-multiline',
          dynamicImports: 'never',
          enums: 'always-multiline',
        },
      ],
      '@stylistic/ts/indent': ['error', 2],
      '@stylistic/ts/quotes': ['error', 'single'],
      '@stylistic/ts/block-spacing': ['error', 'always'],
      '@stylistic/ts/semi': ['error', 'always'],
      '@stylistic/ts/no-extra-semi': 'error',
      '@stylistic/ts/object-curly-spacing': ['error', 'always'],
      '@stylistic/ts/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/ts/space-before-blocks': 'error',
      '@stylistic/ts/member-delimiter-style': 'error',
      '@stylistic/ts/space-infix-ops': 'error',
      '@stylistic/ts/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: 'block-like',
          next: 'block-like',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: ['enum', 'interface', 'type', 'class'],
        },
        {
          blankLine: 'never',
          prev: 'function-overload',
          next: 'function',
        },
      ],
      '@stylistic/plus/type-generic-spacing': ['error'],
      '@stylistic/plus/type-named-tuple-spacing': ['error'],
      '@stylistic/plus/curly-newline': [
        'error',
        {
          multiline: true,
          minElements: 1,
        },
      ],
      '@stylistic/plus/indent-binary-ops': ['error', 2],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    languageOptions: {
      parser: angularTemplateParser,
    },
    rules: {
      '@angular-eslint/template/label-has-associated-control': 'off',
    },
  },
);
