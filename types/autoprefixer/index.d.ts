declare module 'autoprefixer/lib/browsers' {
	import browserslist, { Stats } from 'browserslist';

	type Queries = string | readonly string[];

	interface Browsers {
		parse(queries: Queries): string[];
		prefix(browser: string): string;
		isSelected(browser: string): boolean;
	}

	class BrowsersImpl implements Browsers {
		constructor(data: Record<string, any>, options?: any, browserslistOpts?: browserslist.Options);

		isSelected(browser: string): boolean;

		parse(queries: string | readonly string[]): string[];

		prefix(browser: string): string;

		prefixes(): string[];

		withPrefix(value: string): boolean;
	}

	export = BrowsersImpl;
}

declare module 'autoprefixer/lib/prefixes' {
	import Browsers from 'autoprefixer/lib/browsers';

	interface Prefixes {
		remove: Record<string, any>;

		unprefixed(value: string): string;
	}

	class PrefixesImpl implements Prefixes {
		constructor(data: string[], browsers: Browsers, options?: any);

		remove: Record<string, any>;

		unprefixed(value: string): string;
	}

	export = PrefixesImpl;
}

/** fork from @types/autoprefixer */
// Type definitions for autoprefixer 9.6
// Project: https://github.com/postcss/autoprefixer
// Definitions by: Armando Meziat <https://github.com/odnamrataizem>
//                 murt <https://github.com/murt>
//                 Slava Fomin II <https://github.com/slavafomin>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.7

declare module 'autoprefixer' {
	import { Plugin } from 'postcss';

	type BrowserslistTarget = string | string[] | Record<string, string[]>;

	interface Options {
		env?: string;
		cascade?: boolean;
		add?: boolean;
		remove?: boolean;
		supports?: boolean;
		flexbox?: boolean | 'no-2009';
		grid?: false | 'autoplace' | 'no-autoplace';
		stats?: Stats;
		browsers?: string[] | string;
		overrideBrowserslist?: BrowserslistTarget;
		ignoreUnknownVersions?: boolean;
	}

	type Autoprefixer = Plugin<Options> & { data: { prefixes: any; browsers: string[] } };

	const autoprefixer: Autoprefixer;

	export = autoprefixer;
}
