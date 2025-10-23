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
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],

  // Enhanced configuration for all files
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
        version: "detect",
      },
    },
    rules: {
      // React Hooks
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",

      // Code Quality
      "no-unused-vars": "warn",
      "no-console": "warn", // Allow console in development code when properly guarded
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "prefer-const": "warn",
      "no-var": "error",

      // Import/Export
      "no-duplicate-imports": "error",

      // Best Practices
      "eqeqeq": ["warn", "always"],
      "curly": ["warn", "all"],
      "no-implicit-coercion": "warn",
      "prefer-template": "warn",

      // React specific
      "react/prop-types": "off", // Using TypeScript instead
      "react/self-closing-comp": "warn",
      "react/jsx-boolean-value": ["warn", "never"],
    },
  },

  // Configuration files (Node.js style)
  {
    files: ["*.config.{js,mjs,ts}", "eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },

  // TypeScript specific overrides
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off", // Handled by TypeScript compiler
      "@typescript-eslint/no-unused-vars": "off", // Will be handled by tsc
    },
  },

  // Prettier integration (must be last)
  prettierConfig,
];

export default eslintConfig;
