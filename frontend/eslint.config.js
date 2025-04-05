import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from "@stylistic/eslint-plugin"

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
      stylistic.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-refresh': reactRefresh,
      "@stylistic": stylistic
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
