const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const globals = require("globals");

module.exports = defineConfig([
  globalIgnores(["node_modules/**", ".expo/**", "dist/**", "coverage/**", "docs/**", "assets/**"]),
  expoConfig,
  prettierConfig,
  {
    files: ["*.js", "*.cjs", ".husky/*"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["engine/attendance/types/enums.ts"],
    rules: {
      "@typescript-eslint/no-redeclare": "off",
    },
  },
]);
