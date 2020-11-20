declare module 'stylelint' {
	import { Comment, Result, ResultMessage, Root, Syntax, WarningOptions, Warning } from 'postcss';

	export type StylelintConfigExtends = string | string[];
	export type StylelintConfigPlugins = string | string[];
	export type StylelintConfigProcessor = string | [string, Record<string, unknown>];
	export type StylelintConfigProcessors = string | StylelintConfigProcessor[];
	export type StylelintConfigIgnoreFiles = string | string[];
	export type StylelintConfigRuleSettings = any | [any, Record<string, unknown>];
	export type StylelintConfigRules = Record<string, StylelintConfigRuleSettings>;

	export type StylelintConfig = {
		extends?: StylelintConfigExtends;
		plugins?: StylelintConfigPlugins;
		pluginFunctions?: Record<string, Function>;
		processors?: StylelintConfigProcessors;
		processorFunctions?: Function[];
		ignoreFiles?: StylelintConfigIgnoreFiles;
		ignorePatterns?: string;
		rules?: StylelintConfigRules;
		codeProcessors?: Function[];
		resultProcessors?: Function[];
		quiet?: boolean;
		defaultSeverity?: string;
	};

	export type CosmiconfigResult = { config: StylelintConfig; filepath: string };

	export type DisabledRange = {
		comment: Comment;
		start: number;
		strictStart: boolean;
		end?: number;
		strictEnd?: boolean;
		rules?: string[];
		description?: string;
	};

	export type DisabledRangeObject = Record<string, DisabledRange[]>;

	export type DisabledWarning = { line: number; rule: string };

	export type StylelintPostcssResult = {
		ruleSeverities: Record<string, any>;
		customMessages: Record<string, any>;
		quiet?: boolean;
		disabledRanges: DisabledRangeObject;
		disabledWarnings?: DisabledWarning[];
		ignored?: boolean;
		ignoreDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportDescriptionlessDisables?: boolean;
		stylelintError?: boolean;
		disableWritingFix?: boolean;
		config?: StylelintConfig;
	};

	type EmptyResult = {
		root: {
			nodes?: undefined;
			source: {
				lang?: undefined;
				input: {
					file?: string;
				};
			};
		};
		messages: ResultMessage[];
		opts: undefined;
	};

	export type StylelintWarningOptions = WarningOptions & {
		stylelintType?: string;
		severity?: string;
		rule?: string;
	};

	export type PostcssResult = (Result | EmptyResult) & {
		stylelint: StylelintPostcssResult;
		warn(message: string, options?: StylelintWarningOptions): void;
	};

	export type Formatter = (
		results: StylelintResult[],
		returnValue?: StylelintStandaloneReturnValue,
	) => string;

	export type FormatterIdentifier = 'compact' | 'json' | 'string' | 'unix' | 'verbose' | Formatter;

	export type CustomSyntax = string | Syntax;

	export type StylelintOptions = {
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: Record<string, unknown>;
		ignoreDisables?: boolean;
		ignorePath?: string;
		reportInvalidScopeDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportDescriptionlessDisables?: boolean;
		syntax?: string;
		customSyntax?: CustomSyntax;
		fix?: boolean;
	};

	export type StylelintPluginContext = { fix?: boolean; newline?: string };

	export type StylelintRule = (
		primaryOption: any,
		secondaryOptions: Record<string, unknown>,
		context: StylelintPluginContext,
	) => (root: Root, result: PostcssResult) => Promise<void> | void;

	export type GetPostcssOptions = {
		code?: string;
		codeFilename?: string;
		filePath?: string;
		codeProcessors?: Function[];
		syntax?: string;
		customSyntax?: CustomSyntax;
	};

	export type GetLintSourceOptions = GetPostcssOptions & { existingPostcssResult?: Result };

	export type StylelintInternalApi = {
		_options: StylelintStandaloneOptions;
		_extendExplorer: {
			search: (s: string) => Promise<null | CosmiconfigResult>;
			load: (s: string) => Promise<null | CosmiconfigResult>;
		};
		_fullExplorer: {
			search: (s: string) => Promise<null | CosmiconfigResult>;
			load: (s: string) => Promise<null | CosmiconfigResult>;
		};
		_configCache: Map<string, Record<string, unknown>>;
		_specifiedConfigCache: Map<StylelintConfig, Record<string, unknown>>;
		_postcssResultCache: Map<string, Result>;

		_getPostcssResult: (options?: GetPostcssOptions) => Promise<Result>;
		_lintSource: (options: GetLintSourceOptions) => Promise<PostcssResult>;
		_createStylelintResult: Function;
		_createEmptyPostcssResult?: Function;

		getConfigForFile: (s?: string) => Promise<{ config: StylelintConfig; filepath: string } | null>;
		isPathIgnored: (s?: string) => Promise<boolean>;
		lintSource: Function;
	};

	export type StylelintStandaloneOptions = {
		files?: string | string[];
		globbyOptions?: Record<string, unknown>;
		cache?: boolean;
		cacheLocation?: string;
		code?: string;
		codeFilename?: string;
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: Record<string, unknown>;
		printConfig?: string;
		ignoreDisables?: boolean;
		ignorePath?: string;
		ignorePattern?: string[];
		reportDescriptionlessDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportInvalidScopeDisables?: boolean;
		maxWarnings?: number;
		syntax?: string;
		customSyntax?: CustomSyntax;
		formatter?: FormatterIdentifier;
		disableDefaultIgnores?: boolean;
		fix?: boolean;
		allowEmptyInput?: boolean;
	};

	export type StylelintCssSyntaxError = {
		column: number;
		file?: string;
		input: {
			column: number;
			file?: string;
			line: number;
			source: string;
		};
		line: number;
		message: string;
		name: string;
		reason: string;
		source: string;
	};

	export type StylelintWarning = {
		line: number;
		column: number;
		rule: string;
		severity: string;
		text: string;
		stylelintType?: string;
	};

	export type StylelintResult = {
		source?: string;
		deprecations: Array<{
			text: string;
			reference: string;
		}>;
		invalidOptionWarnings: Array<{
			text: string;
		}>;
		parseErrors: Array<Warning & { stylelintType: string }>;
		errored?: boolean;
		warnings: StylelintWarning[];
		ignored?: boolean;
		_postcssResult?: PostcssResult;
	};

	export type DisableReportRange = {
		rule: string;
		start: number;
		end?: number;

		// This is for backwards-compatibility with formatters that were written
		// when this name was used instead of `rule`. It should be avoided for new
		// formatters.
		unusedRule: string;
	};

	export type RangeType = DisabledRange & { used?: boolean };

	export type StylelintDisableReportEntry = {
		source?: string;
		ranges: DisableReportRange[];
	};

	export type StylelintStandaloneReturnValue = {
		results: StylelintResult[];
		errored: boolean;
		output: any;
		maxWarningsExceeded?: {
			maxWarnings: number;
			foundWarnings: number;
		};
		reportedDisables: StylelintDisableOptionsReport;
		descriptionlessDisables?: StylelintDisableOptionsReport;
		needlessDisables?: StylelintDisableOptionsReport;
		invalidScopeDisables?: StylelintDisableOptionsReport;
	};

	export type StylelintPublicAPI = {
		lint: Function;
		rules: Record<string, StylelintRule>;
		formatters: Record<string, Formatter>;
		createPlugin: (
			ruleName: string,
			rule: StylelintRule,
		) => { ruleName: string; rule: StylelintRule };
		createLinter: Function;
		utils: {
			report: Function;
			ruleMessages: Function;
			validateOptions: Function;
			checkAgainstRule: Function;
		};
	};

	export type StylelintDisableOptionsReport = StylelintDisableReportEntry[];
}
