"use strict";

import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
	input: "ts/Main.ts",
	output: {
		file: "dist/js/index.js",
		format: "iife"
	},

	banner: "// This is a bundle of compiled TypeScript code",
	sourcemap: true,

	plugins: [
		resolve(),
		commonjs(),
		typescript({
			tsconfig: "./tsconfig.json"
		})
	]
}