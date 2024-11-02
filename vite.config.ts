import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import preact from '@preact/preset-vite';
import monkey, { cdn, util } from 'vite-plugin-monkey';
import AutoImport from 'unplugin-auto-import/vite';
import i18nextLoader from 'vite-plugin-i18next-loader';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import remToPx from 'postcss-rem-to-pixel-next';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      // 排除 .old 文件
      external: (id) => id.endsWith('.old'), // 使用函数来排除 .old 文件
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
        remToPx({ propList: ['*'] }),
        // Use scoped CSS.
        //prefixSelector({
        //  prefix: '#twe-root',
        //  exclude: [/^#twe-root/], // This may be a bug.
        //}),
      ],
    },
  },
  plugins: [
    AutoImport({
      imports: [util.unimportPreset],
      dts: './.auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    preact(),
    i18nextLoader({
      paths: ['./src/i18n/locales'],
      namespaceResolution: 'basename',
    }),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: {
          '': 'AWeb2MdTool',
          'zh-CN': 'Web转为Md的工具',
          en: 'AWeb2MdTool',
        },
        description: {
          '': '',
          'zh-CN': '',
          en: '',
        },
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'https://github.com/strangezombies',
        match: ['https://www.google.com'], // "*://*/*"
        require: [
          'https://cdn.jsdelivr.net/npm/preact@latest/dist/preact.min.js',
          'https://cdn.jsdelivr.net/npm/i18next@latest/i18next.min.js',
        ],
      },
      build: {
        externalGlobals: {
          i18next: cdn.jsdelivr('i18next', 'dist/i18next.min.js'),
          preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
        },
      },
    }),
  ],
});
