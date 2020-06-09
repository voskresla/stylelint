'use strict';

const ncc = require('@zeit/ncc');
const path = require('path');
const { promises: fs } = require('fs');

const distDir = `${__dirname}/../dist`;

const bundles = [
	{
		src: './lib/index.js',
		dist: './dist/index.js',
		replace: [
			{
				// cosmiconfig@6 dynamic requires of loaders minifiied
				pattern: /s\(__filename\)/g,
				replacement: '__filename',
			},
			{
				// cosmiconfig@6 dynamic requires of loaders
				pattern: /parentModule\(__filename\)/g,
				replacement: '__filename',
			},
		],
		externals: ['lodash', 'caniuse-lite', 'autoprefixer'],
	} /*
	{
		src: './bin/stylelint.js',
		dist: './dist/bin-stylelint.js',
		replace: [
			{
				// cosmiconfig@6 dynamic requires of loaders minifiied
				pattern: /s\(__filename\)/g,
				replacement: '__filename',
			},
			{
				// cosmiconfig@6 dynamic requires of loaders
				pattern: /parentModule\(__filename\)/g,
				replacement: '__filename',
			},
		],
	},
	{
		src: './lib/syntaxes/syntax-html.js',
		dist: './dist/syntax-html.js',
	},
	{
		src: './lib/syntaxes/syntax-markdown.js',
		dist: './dist/syntax-markdown.js',
	},
	{
		src: './lib/syntaxes/syntax-css-in-js.js',
		dist: './dist/syntax-css-in-js.js',
	},
	{
		src: './lib/syntaxes/syntax-less.js',
		dist: './dist/syntax-less.js',
	},
	{
		src: './lib/syntaxes/syntax-scss.js',
		dist: './dist/syntax-scss.js',
	},
	{
		src: './lib/syntaxes/syntax-sass.js',
		dist: './dist/syntax-sass.js',
	},
	{
		src: './lib/syntaxes/syntax-sugarss.js',
		dist: './dist/syntax-sugarss.js',
	},*/,
];

//path.join(__dirname, "..", src);

bundles.forEach(({ src, dist, replace = [], externals = [] }) => {
	(async () => {
		let { code } = await ncc(path.join(process.cwd(), src), {
			// cache: false,
			externals,
			minify: true, // default
			sourceMapRegister: false, // default
			//v8cache: true, // default
			quiet: true, // default
			debugLog: false, // default
		});

		replace.forEach(({ pattern, replacement }) => {
			code = code.replace(pattern, replacement);
		});

		try {
			const file = path.join(process.cwd(), dist);

			await fs.mkdir(distDir, { recursive: true });
			await fs.writeFile(file, code);
		} catch (error) {
			process.stderr.write(error);
		}
	})();
});
