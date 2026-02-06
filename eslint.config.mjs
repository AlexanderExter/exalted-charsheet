import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

const eslintConfig = [
  // Global ignores
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "**/*.min.js",
      "**/*.d.ts",
      "coverage/**",
    ],
  },

  // Base configs
  js.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: "19" } },
  },
  reactPlugin.configs.flat["jsx-runtime"],

  // All source files: shared settings and rules
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "19",
      },
    },
    rules: {
      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "prefer-const": "warn",
      "no-var": "error",
      "no-duplicate-imports": "error",

      // Best practices
      eqeqeq: ["warn", "always"],
      curly: ["warn", "all"],
      "no-implicit-coercion": "warn",
      "prefer-template": "warn",

      // React
      "react/prop-types": "off",
      "react/self-closing-comp": "warn",
      "react/jsx-boolean-value": ["warn", "never"],
      "react/jsx-no-target-blank": "error",
      "react/no-array-index-key": "warn",
    },
  },

  // TypeScript files: parser, plugin, and TS-specific rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      // Disable base rules that TS handles
      "no-undef": "off",
      "no-unused-vars": "off",

      // TypeScript equivalents
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // Config and script files: Node.js context
  {
    files: ["*.config.{js,mjs,ts}", "eslint.config.mjs", "scripts/**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      "no-console": "off",
    },
  },

  // Prettier integration (must be last)
  prettierConfig,
];

export default eslintConfig;
