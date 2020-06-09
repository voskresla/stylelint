'use strict';

const stylelint = require('./lib/index.js');

(async () => {
	const results = await stylelint.lint({
		config: {
			rules: { 'color-hex-length': 'long' },
		},
		//syntax: 'css-in-js',
		code: 'import styled from "styled-components"; const C = styled.p`color: #fff;`;',
	});

	//console.log(results);
})().catch((err) => {
	console.error(err);
});
