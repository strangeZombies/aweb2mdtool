import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import preact from '@preact/preset-vite'; // 用于支持 Preact 框架
import AutoImport from 'unplugin-auto-import/vite'; // 用于自动导入
import i18nextLoader from 'vite-plugin-i18next-loader'; // 用于加载 i18next 翻译文件
import tailwindcss from 'tailwindcss'; // 用于自动生成 Tailwind CSS 样式
import legacy from '@vitejs/plugin-legacy'; // 用于支持旧版浏览器
import monkey, { cdn, util } from 'vite-plugin-monkey'; // 用于构建 userscript;
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      external: (id) => id.endsWith('.old'),
      plugins: [preact()],
    },
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [tailwindcss()], // remToPx({ propList: ['*'] }), autoprefixer()
    },
  },
  plugins: [
    legacy({
      renderLegacyChunks: false,
      modernPolyfills: true,
    }),
    AutoImport({
      imports: [util.unimportPreset],
      dts: './.auto-imports.d.ts',
      eslintrc: {
        enabled: true,
      },
    }),
    preact(),
    i18nextLoader({
      paths: ['./src/i18n/locales'], // 本地化文件路径
      namespaceResolution: 'basename', // 使用文件名作为命名空间
    }),
    cssInjectedByJsPlugin(),
    monkey({
      entry: 'src/main.tsx', // 入口文件
      userscript: {
        name: {
          '': 'AWeb2MdTool', // 默认语言 (英文)
          'zh-CN': 'WEB转MD工具', // 简体中文
          en: 'AWeb2MdTool', // 英文
        },
        description: {
          '': 'description', // 默认语言 (英文)
          'zh-CN': 'description', // 简体中文
          en: 'description', // 英文
        },
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'https://github.com/strangezombies',
        match: ['*://*/*'], // 匹配 URL
        //require: [
        //  'https://cdn.jsdelivr.net/npm/@latest/latest.min.js',
        //  'https://cdn.jsdelivr.net/npm/i18next@24.1.0/i18next.min.js',
        //  'https://cdn.jsdelivr.net/npm/@preact/signals@1.3.1/dist/signals.min.js',
        //],
        version: '0.0.1', // 示例：设置脚本版本
        author: 'strangeZombies', // 示例：设置作者
        grant: [
          'unsafeWindow',
          'GM_getValue',
          'GM_setValue',
          'GM_listValues',
          'GM_registerMenuCommand',
        ],
        'run-at': 'document-end',
      },
      build: {
        externalGlobals: {
          //i18next: cdn.jsdelivr('i18next', 'i18next.min.js'),
          //preact: cdn.jsdelivr('preact', 'dist/preact.min.js'),
          //  'preact/hooks': cdn.jsdelivr('preact', 'hooks/dist/hooks.umd.js'),
          // '@preact/signals': cdn.jsdelivr('signals', 'dist/signals.min.js'),
        },
      },
    }),
  ],
});
