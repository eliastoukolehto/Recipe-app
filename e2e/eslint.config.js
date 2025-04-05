import js from '@eslint/js'
import stylistic from "@stylistic/eslint-plugin"
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage'] },
  {
    extends: [
      js.configs.recommended, 
      ...tseslint.configs.recommended,
      stylistic.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: {
      "@stylistic": stylistic,
    },
  }
)