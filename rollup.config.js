// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {
  uglify,
} from 'rollup-plugin-uglify';
import pck from './package.json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bee.js',
    // file: './examples/bee.js',
    banner: [
      '/*!',
      ' * Bee 数据采集SDK',
      ` * Version ${pck.version}`,
      ' * https://github.com/zjiang121143210/bee',
      ' * wx: zjiang1_12 欢迎联系',
      '*/',
    ].join('\n'),
    name: 'bundle',
    format: 'iife',
    sourcemap: false,
  },
  plugins: [
    // commonjs(),
    // resolve(),
    // commonjs(),
    babel({
      exclude: 'node_modules/**',
    }),
    // json(),
    uglify({
      mangle: true,
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
      output: {
        comments: /^!/,
      },
      warnings: false,
    }),
  ],
};