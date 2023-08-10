module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es2021: true,
    },
    extends: 'eslint:recommended',
    overrides: [
      {
        env: {
          node: true,
        },
        files: [
          '.eslintrc.{js,cjs}',
        ],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    parserOptions: {
      ecmaVersion: 'latest',
    },
    rules: {
      semi: ['warn', 'always'],
      quotes: ['warn', 'single'],
      'no-console': 'warn',
      'no-unused-vars': ['error', {'argsIgnorePattern': 'req|res|next|val'}]
            
    },
  };
  