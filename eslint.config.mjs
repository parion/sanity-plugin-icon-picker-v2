import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["**/dist", "**/node_modules", "**/coverage", "**/build", "**/public"]),
    {
        extends: fixupConfigRules(compat.extends(
            "sanity/react",
            "sanity/typescript",
            "plugin:import/recommended",
            "plugin:import/typescript",
            "prettier",
            "plugin:prettier/recommended",
            "plugin:vitest/recommended",
        )),

        plugins: {
            "@typescript-eslint": typescriptEslint,
            "unused-imports": unusedImports,
            prettier: fixupPluginRules(prettier),
        },

        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.browser,
            },

            parser: tsParser,
        },

        settings: {
            "import/resolver": {
                typescript: true,
            },
        },

        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error"],
            "unused-imports/no-unused-imports": "error",

            "unused-imports/no-unused-vars": ["warn", {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            }],

            "import/namespace": ["error", {
                allowComputed: true,
            }],

            "prettier/prettier": ["error", {
                endOfLine: "auto",
            }],

            "@typescript-eslint/consistent-type-imports": "error",

            "react/jsx-no-bind": ["error", {
                allowArrowFunctions: true,
            }],

            "react/react-in-jsx-scope": "off",

            "sort-imports": ["error", {
                ignoreCase: true,
                ignoreDeclarationSort: true,
            }],

            "import/order": [1, {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                    "type",
                ],

                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            }],
        },
    },
]);