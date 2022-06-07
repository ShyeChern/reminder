module.exports = {
	env: {
		browser: true,
		node: true,
		es6: true,
	},
	globals: { $: 'readonly', FullCalendar: 'readonly', bootstrap: 'readonly', rrule: 'readonly' },
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		semi: ['error', 'always'],
	},
};
