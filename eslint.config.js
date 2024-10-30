import js from "@eslint/js"
import react from "eslint-plugin-react"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"

export default [
  js.configs.recommended,
  react.configs.flat.recommended,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "prettier/prettier": "error",
      "react/jsx-no-target-blank": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "no-empty": "warn",
    },
  },
]
