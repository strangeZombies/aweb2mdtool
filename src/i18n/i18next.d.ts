declare module 'virtual:i18next-loader' {
  import en_common from '@/i18n/locales/en/common.json';

  export type LocaleResources = {
    en: {
      common: typeof en_common;
    };
  };

  export type TranslationKey = keyof LocaleResources['en']['common'];

  const resources: LocaleResources;
  export default resources;
}
