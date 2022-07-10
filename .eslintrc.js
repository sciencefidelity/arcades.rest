module.exports = {
  plugins: ["@typescript-eslint"],
  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  env: {
    node: true,
    browser: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
}
