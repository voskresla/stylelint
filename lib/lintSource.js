'use strict';

const lintPostcssResult = require('./lintPostcssResult');
const path = require('path');

/** @typedef {import('stylelint').StylelintInternalApi} StylelintInternalApi */
/** @typedef {import('stylelint').GetLintSourceOptions} Options */
/** @typedef {import('postcss').Result} Result */
/** @typedef {import('stylelint').PostcssResult} PostcssResult */
/** @typedef {import('stylelint').StylelintPostcssResult} StylelintPostcssResult */

/**
 * Run stylelint on a PostCSS Result, either one that is provided
 * or one that we create
 * @param {StylelintInternalApi} stylelint
 * @param {Options} options
 * @returns {Promise<PostcssResult>}
 */
module.exports = async function lintSource(stylelint, options = {}) {
	if (!options.filePath && options.code === undefined && !options.existingPostcssResult) {
		return Promise.reject(new Error('You must provide filePath, code, or existingPostcssResult'));
	}

	const isCodeNotFile = options.code !== undefined;
	const inputFilePath = isCodeNotFile ? options.codeFilename : options.filePath;

	if (inputFilePath !== undefined && !path.isAbsolute(inputFilePath)) {
		if (isCodeNotFile) {
			return Promise.reject(new Error('codeFilename must be an absolute path'));
		}

		return Promise.reject(new Error('filePath must be an absolute path'));
	}

	/* Handle ignored */

	const isIgnored = await stylelint.isPathIgnored(inputFilePath).catch((err) => {
		if (isCodeNotFile && err.code === 'ENOENT') return false;

		throw err;
	});

	if (isIgnored) {
		const postcssResult = options.existingPostcssResult
			? augmentPostcssResult(options.existingPostcssResult)
			: createPostcssResult(inputFilePath);

		postcssResult.stylelint.ignored = true;

		return postcssResult;
	}

	/* Get config */

	const configSearchPath = stylelint._options.configFile || inputFilePath;

	const getConfig = stylelint.getConfigForFile(configSearchPath).catch((err) => {
		if (isCodeNotFile && err.code === 'ENOENT') return stylelint.getConfigForFile(process.cwd());

		throw err;
	});

	const configResult = await getConfig;

	if (!configResult) throw new Error('Config file not found');

	const config = configResult.config;

	/* Run against an existing result */

	const existingPostcssResult = options.existingPostcssResult;

	if (existingPostcssResult) {
		const stylelintPostcssResult = augmentPostcssResult(existingPostcssResult);

		return lintPostcssResult(stylelint._options, stylelintPostcssResult, config).then(
			() => stylelintPostcssResult,
		);
	}

	/* Run against a fresh result */

	const postcssResult = await stylelint._getPostcssResult({
		code: options.code,
		codeFilename: options.codeFilename,
		filePath: inputFilePath,
		codeProcessors: config.codeProcessors,
	});

	const stylelintPostcssResult = augmentPostcssResult(postcssResult);

	return lintPostcssResult(stylelint._options, stylelintPostcssResult, config).then(
		() => stylelintPostcssResult,
	);
};

/**
 * @returns {StylelintPostcssResult}
 */
function createEmptyStylelintPostcssResult() {
	return {
		ruleSeverities: {},
		customMessages: {},
		disabledRanges: {},
	};
}

/**
 * @param {string} [filePath]
 * @returns {PostcssResult}
 */
function createPostcssResult(filePath) {
	return {
		root: {
			source: {
				input: { file: filePath },
			},
		},
		messages: [],
		opts: undefined,
		stylelint: createEmptyStylelintPostcssResult(),
		warn: () => {},
	};
}

/**
 * @param {Result} postcssResult
 * @returns {PostcssResult}
 */
function augmentPostcssResult(postcssResult) {
	return Object.assign(postcssResult, { stylelint: createEmptyStylelintPostcssResult() });
}
