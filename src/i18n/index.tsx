import { Namespace } from 'i18next';
import { useEffect, useRef, useState } from 'preact/hooks';
import { TranslationKey } from 'virtual:i18next-loader';
import { initI18n } from './init';
import { detectBrowserLanguage } from './detector'; // Importing the language detection function

export type { LocaleResources, TranslationKey } from 'virtual:i18next-loader';
export * from './detector';

/**
 * A simplified implementation of react-i18next's `useTranslation` for Preact.
 *
 * @param namespace The namespace to use for the translation.
 * @param language (optional) A specific language to use. If not provided, auto-detection will be used.
 * @returns An object with the `t` function and the `i18n` instance.
 */
export function useTranslation(ns?: Namespace, language?: string) {
  const i18n = initI18n();

  // Determine the language to use
  const languageToUse = language || detectBrowserLanguage();

  // Change language if needed.
  useEffect(() => {
    if (languageToUse && i18n.language !== languageToUse) {
      i18n.changeLanguage(languageToUse);
    }
  }, [i18n, languageToUse]);

  // State to hold the t function
  const [t, setT] = useState(() => i18n.getFixedT(null, ns ?? null));

  // Do not update state if component is unmounted.
  const isMountedRef = useRef(true);
  const previousNamespaceRef = useRef(ns);

  // Reset t function when namespace changes.
  useEffect(() => {
    isMountedRef.current = true;

    if (previousNamespaceRef.current !== ns) {
      previousNamespaceRef.current = ns;
      setT(() => i18n.getFixedT(null, ns ?? null));
    }

    const boundReset = () => {
      if (isMountedRef.current) {
        // Update t function if the component is still mounted
        setT(() => i18n.getFixedT(null, ns ?? null));
      }
    };

    // Bind events to trigger change.
    i18n.on('languageChanged', boundReset);

    // Unbind events on unmount.
    return () => {
      isMountedRef.current = false;
      i18n.off('languageChanged', boundReset);
    };
  }, [ns, i18n]);

  return { t, i18n };
}

/**
 * A simplified implementation of react-i18next's `Trans` component for Preact.
 *
 * @param i18nKey The translation key to use.
 * @param ns The namespace to use for the translation.
 * @param language (optional) A specific language to use. If not provided, auto-detection will be used.
 * @returns The translated string.
 */
export function Trans({
  i18nKey,
  ns = 'common',
  language,
}: {
  i18nKey: TranslationKey;
  ns?: Namespace;
  language?: string;
}) {
  const { t } = useTranslation(ns, language);
  return <span>{t(i18nKey)}</span>;
}
