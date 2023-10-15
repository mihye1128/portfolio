module.exports = {
  ignorePatterns: [
    "node_modules/**/*",
    "dist/assets/js/**/*",
    "src/service-worker.js",
    "dist/service-worker.js",
    ".stylelintrc.js",
  ],
  extends: [
    "plugin:@wordpress/eslint-plugin/recommended-with-formatting",
    "prettier",
  ],
  rules: {
    "import/no-extraneous-dependencies": [
      "off",
      {
        devDependencies: true,
        optionalDependencies: true,
      },
    ],
  },
};
