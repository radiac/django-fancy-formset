// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import esbuild from 'esbuild';

const esmMinify = {
	name: 'minify',
	closeBundle: () => {
		esbuild.buildSync({
			entryPoints: ['./dist/formset.module.js'],
			minify: true,
			allowOverwrite: true,
			outfile: './dist/formset.module.js'
		})
	}
};

export default defineConfig({
  plugins: [
    esmMinify
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/formset.js'),
      name: 'formset',
      formats: ["es", "umd"],
      fileName: (format , entryName) => {
        if (format == 'es') {
          return 'formset.module.js';
        } else {
          return 'formset.js';
        }
      },
    },
    emptyOutDir: false,  // avoid clash with scss
    rollupOptions: {
      output: {
        //exports: 'named'
      },
    },
  },
});
