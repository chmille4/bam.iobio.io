export default {
	arrowParens: 'always',
	bracketSpacing: true,
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	singleAttributePerLine: false,
	bracketSameLine: false,
	printWidth: 120,
	proseWrap: 'preserve',
	quoteProps: 'as-needed',
	requirePragma: false,
	semi: true,
	singleQuote: true,
	tabWidth: 2,
	trailingComma: 'es5',
	useTabs: true,
	embeddedLanguageFormatting: 'auto',
	vueIndentScriptAndStyle: false,
	overrides: [
		{
			files: '*.js',
			options: {
				parser: 'babel',
			},
		},
		{
			files: '*.vue',
			options: {
				parser: 'vue',
			},
		},
		{
			files: '*.css',
			options: {
				parser: 'css',
			},
		},
		{
			files: '*.json',
			options: {
				parser: 'json',
			},
		},
		{
			files: '*.html',
			options: {
				parser: 'html',
			},
		},
	],
};
