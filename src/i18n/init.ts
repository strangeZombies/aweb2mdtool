import i18next, { LanguageDetectorModule, i18n } from 'i18next';
import resources, { LocaleResources } from 'virtual:i18next-loader';
import { options } from '@/core/options';
import { detectBrowserLanguage } from './detector';

// 扩展 i18next 的类型定义
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'; // 设置默认命名空间为 'common'
    resources: LocaleResources['en']; // 定义英文的翻译资源结构
  }
}

/**
 * i18next 的语言检测器。
 */
export const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector', // 指定类型为语言检测器
  detect: function () {
    // 尝试从选项中获取已选择的语言，如果没有则检测浏览器语言
    return options.get('language') || detectBrowserLanguage();
  },
};

/**
 * 初始化 i18next 并返回实例。
 */
export function initI18n(): i18n {
  // 应用中只会有一个 i18next 实例。
  if (i18next.isInitialized) {
    return i18next; // 如果已经初始化，直接返回实例
  }

  // 将选择的语言持久化到选项存储中。
  i18next.on('languageChanged', (lng) => {
    // 如果选项中没有语言，则设置为当前语言
    if (!options.get('language')) {
      options.set('language', lng);
    }
  });

  // 使用语言检测器初始化 i18next。
  i18next.use(languageDetector).init({
    initImmediate: true, // 初始化时立即加载
    defaultNS: 'common', // 设置默认命名空间为 'common'
    fallbackLng: 'en', // 设置后备语言为 'en'
    nsSeparator: '::', // 命名空间分隔符
    debug: options.get('debug'), // 根据选项设置调试模式
    resources, // 传入翻译资源
  });

  return i18next; // 返回初始化后的 i18next 实例
}
