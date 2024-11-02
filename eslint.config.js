//https://blog.csdn.net/sayUonly/article/details/123482912

// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { readFile } from 'node:fs/promises';
const autoImportFile = new URL('./.eslintrc-auto-import.json',import.meta.url);
const autoImportGlobals = JSON.parse(await readFile(autoImportFile,'utf-8'));
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
  },
  {
    ignores: ['dist', 'node_modules'],
  },
  {languageOptions:{
    globals:{
      ...autoImportGlobals.gloabals,
    }
  }}
);