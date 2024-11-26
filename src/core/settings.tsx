import { Fragment } from 'preact';
import { useSignal } from '@preact/signals';

import { Modal, LsiconSettingOutline, TablerHelp } from '@/components/common';
import { useTranslation, detectBrowserLanguage, LANGUAGES_CONFIG } from '@/i18n';
import { capitalizeFirstLetter, cx, useToggle } from '@/utils/common';
import { DEFAULT_APP_OPTIONS, options, THEMES } from './options';

export function Settings() {
  const { t, i18n } = useTranslation();

  const currentTheme = useSignal(options.get('theme'));
  const [showSettings, toggleSettings] = useToggle(false);

  const styles = {
    subtitle: 'mb-2 text-base-content ml-4 opacity-50 font-semibold text-xs',
    block:
      'text-sm mb-2 w-full flex px-4 py-2 text-base-content bg-base-200 rounded-box justify-between',
    item: 'label cursor-pointer flex justify-between h-8 items-center p-0',
  };

  return (
    <Fragment>
      {/* Settings button. */}
      <div
        onClick={toggleSettings}
        class="w-9 h-9 mr-2 cursor-pointer flex justify-center items-center transition-colors duration-200 rounded-full hover:bg-base-200"
      >
        <LsiconSettingOutline />
      </div>
      {/* Settings modal. */}
      <Modal title={t('Settings')} show={showSettings} onClose={toggleSettings} class="max-w-lg">
        {' '}
        <p class={styles.subtitle}>{t('General')}</p>
        <div class={cx(styles.block, 'flex-col')}>
          <label class={styles.item}>
            <span class="label-text">{t('Theme')}</span>
            <select
              class="select select-xs"
              onChange={(e) => {
                currentTheme.value =
                  (e.target as HTMLSelectElement)?.value ?? DEFAULT_APP_OPTIONS.theme;
                options.set('theme', currentTheme.value);
              }}
            >
              {THEMES.map((theme) => (
                <option key={theme} value={theme} selected={currentTheme.value === theme}>
                  {capitalizeFirstLetter(theme)}
                </option>
              ))}
            </select>
          </label>
          <label class={styles.item}>
            <span class="label-text">{t('Language')}</span>
            <select
              class="select select-xs"
              onChange={(e) => {
                const language = (e.target as HTMLSelectElement)?.value ?? detectBrowserLanguage();
                i18n.changeLanguage(language);
                options.set('language', language);
              }}
            >
              {Object.entries(LANGUAGES_CONFIG).map(([langTag, langConf]) => (
                <option
                  key={langTag}
                  value={langTag}
                  selected={options.get('language') === langTag}
                >
                  {langConf.nameEn} - {langConf.name}
                </option>
              ))}
            </select>
          </label>
          <label class={styles.item}>
            <span class="label-text">{t('DebugMode')}</span>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              checked={options.get('debug')}
              onChange={(e) => {
                options.set('debug', (e.target as HTMLInputElement)?.checked);
              }}
            />
          </label>
          <label class={styles.item}>
            <div class="flex items-center">
              <span class="label-text">{t('ShowToggleButton')}</span>
              <span
                rel="noopener noreferrer"
                class="tooltip tooltip-bottom ml-0.5 before:max-w-40"
                data-tip={t('ShowToggleButtonTips')}
              >
                <TablerHelp size={20} />
              </span>
            </div>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              checked={options.get('showToggleButton')}
              onChange={(e) => {
                options.set('showToggleButton', (e.target as HTMLInputElement)?.checked);
              }}
            />
          </label>
        </div>
        <p class={styles.subtitle}>{t('ObsidianSoftwareSettings')}</p>
        <div class={cx(styles.block, 'flex-col')}>
          <label class={styles.item}>
            <span class="label-text">{t('VaultSettings')}</span>
            <input
              type="text"
              class="input input-bordered input-xs w-48"
              value={options.get('vault')}
              onChange={(e) => {
                options.set('vault', (e.target as HTMLInputElement)?.value);
              }}
            />
          </label>
          <label class={styles.item}>
            <span class="label-text">{t('RelativeFolder')}</span>
            <input
              type="text"
              class="input input-bordered input-xs w-48"
              value={options.get('folder')}
              onChange={(e) => {
                options.set('folder', (e.target as HTMLInputElement)?.value);
              }}
            />
          </label>
          <label class={styles.item}>
            <span class="label-text">{t('BaseTagSettings')}</span>
            <input
              type="text"
              class="input input-bordered input-xs w-48"
              value={options.get('baseTags')}
              onChange={(e) => {
                options.set('baseTags', (e.target as HTMLInputElement)?.value);
              }}
            />
          </label>
        </div>
      </Modal>
    </Fragment>
  );
}
