import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
    },
  },
];
