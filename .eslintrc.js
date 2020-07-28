module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint", "prettier"],
	extends: [
		"plugin:@typescript-eslint/recommended",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended",
	],
	parserOptions: {
		ecmaVersion: 2020,
		project: "./tsconfig.json",
		sourceType: "module",
	},
	rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/ban-ts-comment": "off",
	},
	root: true,
};
