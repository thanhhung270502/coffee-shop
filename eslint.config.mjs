import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import onlyWarn from "eslint-plugin-only-warn";
import pluginReactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/generated/**",
  ]),
  {
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react-hooks/incompatible-library": "off",
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_",
        },
      ]
    }
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@?\\w"], // React
            ["^(@|components)(/.*|$)"], // Components
            ["^\\u0000"], // Side effect imports
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"], // Parent imports
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"], // Other relative imports
            ["^.+\\.?(css)$"], // CSS imports
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
]);

export default eslintConfig;
