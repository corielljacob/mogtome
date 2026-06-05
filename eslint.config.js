import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Treat a leading underscore as "intentionally unused" - matches the
      // existing codebase convention (e.g. icon adapters that destructure and
      // drop Lucide-only props like `strokeWidth`/`weight`).
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // Context providers and test helpers intentionally export hooks/utilities
    // alongside their components. `react-refresh/only-export-components` is a
    // Fast-Refresh-only concern and a false positive for these modules.
    files: [
      "src/shared/contexts/**/*.{ts,tsx}",
      "src/shared/test/**/*.{ts,tsx}",
    ],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    // Architecture boundaries: shared/ is the platform layer and must not depend
    // on a feature or the app shell. (Feature-to-feature is a convention for now;
    // full cross-feature enforcement would need eslint-plugin-boundaries.)
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**", "@/app/**"],
              message:
                "shared/ is the platform layer — it must not import from features/ or app/.",
            },
          ],
        },
      ],
    },
  },
  {
    // Features build on the platform, not on the app shell.
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message:
                "features/ must not import from app/ (the shell). Lift anything shared into shared/.",
            },
          ],
        },
      ],
    },
  },
]);
