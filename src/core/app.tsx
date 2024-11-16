import { Fragment } from 'preact';
import { useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
//import { ErrorBoundary } from '@/components/error-boundary';
//import { useTranslation } from '@/i18n';
import { cx } from '@/utils/common';
import logger from '@/utils/logger';
import { options } from './options';
import { useTranslation } from '@/i18n';
export const App = () => {
  const { t } = useTranslation();
  const toggleControlPanel = () => {
    logger.info(options.get('showControlPanel', 'showControlPanel.value'));
  };
  console.log('1212');
  logger.info(options.get('language', 'en-US'));
  return (
    <Fragment>
      {/* To show and hide the main UI. */}
      <div
        onClick={toggleControlPanel}
        data-theme="cyberpunk"
        class="group w-12 h-12 fixed top-[60%] left-[-20px] cursor-pointer bg-transparent fill-base-content"
      >
        <div class="w-full h-full origin origin-[bottom_center] transition-all duration-200 group-hover:translate-x-[5px] group-hover:rotate-[20deg] opacity-50 group-hover:opacity-90">
          RMdIcon
        </div>
      </div>

      {/* The main UI block. */}
      <section
        data-theme="cyberpunk"
        class={cx(
          'card card-compact bg-base-100 fixed border shadow-xl w-80 leading-loose text-base-content px-4 py-3 rounded-box border-solid border-neutral-content border-opacity-50 left-8 top-8 transition-transform duration-500 translate-x-0 transform-none',
        )}
      >
        {/* Card title. */}
        <header class="flex items-center h-9">
          <h2 class="font-semibold leading-none text-xl m-0 flex-grow">Web Exporter</h2>
          <div
            onClick={toggleControlPanel}
            class="w-9 h-9 cursor-pointer flex justify-center items-center transition-colors duration-200 rounded-full hover:bg-base-200"
          >
            IconX
          </div>
        </header>
        <p class="text-sm text-base-content text-opacity-70 mb-1 leading-none">
          {t('Browse around to capture more data.')}
        </p>
        <div class="divider mt-0 mb-0"></div>
        {/* Extensions UI. */}
        <main></main>
      </section>
    </Fragment>
    //E <Fragment>
    //E   <div onClick={toggleControlPanel}>sample</div>
    //E </Fragment>
  );
};
