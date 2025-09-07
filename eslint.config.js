import eslint from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
// import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config([
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      // globals: {
      //   ...globals.browser,
      // },
    },
    plugins: {
      react: pluginReact,
      "react-hooks": reactHooks,
    },
    rules: {
      // You can override/add react-hooks rules here if needed
      // 'react-hooks/rules-of-hooks': 'error',
      // 'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);
