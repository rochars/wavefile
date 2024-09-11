import esbuild from 'esbuild';
import fs from 'fs';
// Polyfills
const polyfills = fs.readFileSync('./scripts/polyfills.js', 'utf8');

const formats = ['esm', 'cjs']

for await (const format of formats) {
  await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    minify: true,
    banner: {
      js: polyfills,
    },
    format,
    outfile: `dist/wavefile.${format}.${format === 'esm' ? 'js' : 'cjs'}`,
  })
}

