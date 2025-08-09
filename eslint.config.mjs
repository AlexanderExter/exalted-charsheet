import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
      "coverage/**"
    ]
  },

  // Base Next.js configuration
  ...compat.extends("next/core-web-vitals"),

  // Enhanced configuration for all files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
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
      "react/react-in-jsx-scope": "off", // Next.js doesn't require React import
      "react/self-closing-comp": "warn",
      "react/jsx-boolean-value": ["warn", "never"]
    }
  },

  // Configuration files (Node.js style)
  {
    files: ["*.config.{js,mjs,ts}", "eslint.config.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly"
      }
    }
  },

  // TypeScript specific overrides
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-unused-vars": "off", // Handled by TypeScript compiler
      // Note: @typescript-eslint rules would require additional configuration
      // For now, relying on TypeScript compiler for type checking
      "@typescript-eslint/no-unused-vars": "off" // Will be handled by tsc
    }
  },

  // Prettier integration (must be last)
  ...compat.extends("eslint-config-prettier")
];

export default eslintConfig;
