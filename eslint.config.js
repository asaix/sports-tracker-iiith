import prettier from 'eslint-config-prettier';
import path from 'node:path';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig, includeIgnoreFile } from 'eslint/config';
import globals from 'globals';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig([
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } }
	},

	{
		files: ['**/*.svelte', '**/*.svelte.js'],
		languageOptions: { parserOptions: {} }
	},

	{
		// CreditFooter links out to external sites; resolve() is for internal
		// routes and would prefix them with the app's base path.
		files: ['src/lib/components/CreditFooter.svelte'],
		rules: { 'svelte/no-navigation-without-resolve': ['error', { ignoreLinks: true }] }
	},

	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {}
	}
]);
