declare module 'postcss-syntax' {
	import { Syntax } from 'postcss';

	function syntax(config: Record<string, Syntax>): Syntax;

	export = syntax;
}
