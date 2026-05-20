import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import configPrettier from "eslint-config-prettier";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    rules: {
      // Пример: предупреждать об использовании консоли (кроме ошибок)
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Пример: отключение обязательного импорта React (в Next.js он не нужен)
      "react/react-in-jsx-scope": "off",

      // Настройка строгости TypeScript
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    },
  },

  configPrettier,
]);

export default eslintConfig;
