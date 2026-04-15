import astro from "eslint-plugin-astro";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import astroParser from "astro-eslint-parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "node_modules/",
      "dist/",
      ".astro/",
      ".vercel/",
      ".next/",
      "coverage/",
      ".DS_Store",
      "*.log",
      "*.tsbuildinfo",
    ],
  },
  {
    files: ["**/*.astro"],
    plugins: { astro },
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
      },
    },
    rules: {
      ...astro.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.ts"],
    plugins: { "@typescript-eslint": tseslint },
    languageOptions: {
      parser: tsParser,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
    },
  },
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "warn",
    },
  },
];
