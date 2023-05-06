module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ['react-refresh', "simple-import-sort", "unused-imports"],
  extends: [
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "prettier",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  rules: {
    "simple-import-sort/imports": "error",
    "unused-imports/no-unused-imports": "error",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
  },
};
