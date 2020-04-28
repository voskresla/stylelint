'use strict';

const stylelint = require('./dist/index.js');

stylelint
	.lint({
		config: { rules: { 'color-hex-length': 'long' } },
		code: `
			a {
				color: #fff}
		`,
		//syntax: 'sass',
		//fix: true,
		//formatter: 'verbose',
	})
	.then((data) => {
		/* eslint-disable-next-line no-console */
		console.log(data);
	})
	.catch((err) => {
		/* eslint-disable-next-line no-console */
		console.error(err.stack);
	});
