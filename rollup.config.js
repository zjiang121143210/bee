// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
// import json from 'rollup-plugin-json';
import {
  uglify
} from 'rollup-plugin-uglify';
export default {
  input: 'src/index.js',
  // input: 'src/dp_url.js',
  output: {
    // file: 'dist/bee.js',
    file: './examples/bee.js',
    // file: 'D:/nginx-1.8.1/html/qd.js',
    // file: 'D:/work/code/data-screen/static/bundle.js',
    name: 'bundle',
    format: 'iife',
    sourcemap: false
  },
  plugins: [
    // commonjs(),
    // resolve(),
    // commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    // json(),
    // uglify({
    //   mangle: true,
    //   compress: {
    //     pure_getters: true,
    //     unsafe: true,
    //     unsafe_comps: true
    //   },
    //   output: {
    //     comments: /^!/
    //   },
    //   warnings: false
    // })
  ]
};