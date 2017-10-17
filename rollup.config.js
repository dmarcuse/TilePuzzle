"use strict";

import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";

let tsconfig = require("./tsconfig.json").compilerOptions;

delete tsconfig.module;
tsconfig.typescript = require("typescript");

export default {
    input: "ts/Main.ts",
    output: {
        file: "dist/js/index.js",
        format: "cjs"
    },

	banner: "// This is a bundle of compiled TypeScript code",
    sourcemap: true,

    plugins: [
        commonjs(),
        typescript(tsconfig)
    ]
}