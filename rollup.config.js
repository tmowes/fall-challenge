import typescript from '@rollup/plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    nodeResolve({
      mainFields: ['main', 'jsnext'],
    }),
  ],
  watch: {
    include: 'src/**',
    exclude: 'src/**/*.test.ts',
  },
};
