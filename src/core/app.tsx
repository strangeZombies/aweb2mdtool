import { Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { ErrorBoundary } from '@/components/error-boundary';
import { useTranslation } from '@/i18n';
import { cx } from '@/utils/common';
import logger from '@/utils/logger';
import { options } from './options';
import { RMdIcon, CloseIcon } from '@/components/common';
import { Settings } from './settings';
import styles from '@/index.module.css'; // 使用模块化 CSS
export function App() {
  const { t } = useTranslation();
  // 获取多个选项并解构到信号中
  const showControlPanel = useSignal<boolean | undefined>(options.get('showControlPanel') ?? false);
  const theme = useSignal<string | undefined>(options.get('theme'));
  const showToggleButton = useSignal<boolean | undefined>(options.get('showToggleButton') ?? true);

  // Remember the last state of the control panel.
  const toggleControlPanel = () => {
    showControlPanel.value = !showControlPanel.value;
    options.set('showControlPanel', showControlPanel.value);
  };

  const toggleMenu = () => {
    showToggleButton.value = !showToggleButton.value;
    showControlPanel.value = showToggleButton.value;
    options.set('showToggleButton', showToggleButton.value);
    options.set('showControlPanel', showControlPanel.value);
  };

  // Update UI when extensions or options change.
  useEffect(() => {
    const unsubscribe = options.signal.subscribe(() => {
      // 当选项发生变化时更新信号值
      theme.value = options.get('theme');
      showControlPanel.value = options.get('showControlPanel');
      showToggleButton.value = options.get('showToggleButton');
    });

    GM_registerMenuCommand(t('toggleMenu'), toggleMenu);

    logger.debug('App useEffect executed');

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Fragment>
      <div class={styles.card}>dd</div>
      {`${styles.card}`}
      {showToggleButton.value && (
        <Fragment>
          {/* To show and hide the main UI. */}
          <div
            onClick={toggleControlPanel}
            class="z-10 group w-12 h-12 fixed top-[60%] left-[-20px] cursor-pointer bg-transparent fill-base-content"
          >
            <div class="w-full h-full origin origin-[bottom_center] transition-all duration-200 group-hover:translate-x-[5px] group-hover:rotate-[20deg] opacity-50 group-hover:opacity-90">
              <RMdIcon data-theme={theme.value} class="w-2/3 h-2/3 select-none" />
            </div>
          </div>

          {/* The main UI block. */}
          <section
            data-theme={theme.value}
            class={cx(
              'z-10 card card-compact bg-base-100 fixed border shadow-xl w-80 leading-loose text-base-content px-4 py-3 rounded-box border-solid border-neutral-content border-opacity-50 left-8 top-24 transition-transform duration-500',
              showControlPanel.value ? 'translate-x-0 transform-none' : 'translate-x-[-500px]',
            )}
          >
            {/* Card title. */}
            <header class="flex items-center h-9">
              <h2 class="font-semibold leading-none text-xl m-0 flex-grow">{t('AWeb2MdTool')}</h2>
              <ErrorBoundary>
                <Settings />
              </ErrorBoundary>
              <div
                onClick={toggleControlPanel}
                class="w-9 h-9 cursor-pointer flex justify-center items-center transition-colors duration-200 rounded-full hover:bg-base-200"
              >
                <CloseIcon />
              </div>
            </header>
            <p class="text-sm text-base-content text-opacity-70 mb-1 leading-none">这里是内容</p>
            <div class="divider mt-0 mb-0"></div>
            {/* Extensions UI. */}
            <main></main>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
}
