module.exports = {
  plugins: ["stylelint-scss"],
  extends: [
    "@wordpress/stylelint-config/scss",
    "stylelint-config-recess-order",
    "stylelint-config-prettier-scss",
  ],
  customSyntax: "postcss-scss",
  ignoreFiles: ["node_modules/**/*", "dist/**/*", "src/scss/base/_ress.scss"],
  overrides: [
    {
      files: ["**/*.scss"],
      customSyntax: "postcss-scss",
    },
  ],
  rules: {
    "font-family-no-missing-generic-family-keyword": null,
    "function-url-quotes": "always",
    // "no-descending-specificity": null,
    "selector-class-pattern": null,
    "selector-id-pattern": null,
    "scss/no-global-function-names": null,
    "scss/selector-no-redundant-nesting-selector": null,
    "no-invalid-position-at-import-rule": [
      true,
      {
        ignoreAtRules: ["use", "forward"],
      },
    ],
    "rule-empty-line-before": [
      "always",
      {
        ignore: ["after-comment", "first-nested", "inside-block"],
      },
    ],
  },
};
