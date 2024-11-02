import { Fragment } from 'preact';
import { useSignal } from '@preact/signals';
import { useTranslation } from '@/i18n';
import { cx } from '@/utils/common';
import { options } from './options';

// 定义组件的 props 接口
interface AppProps {
  className?: string; // className 属性可选，类型为 string
}

export function App({ className = '' }: AppProps) {
  // 使用类型注解
  const { t } = useTranslation();

  const currentTheme = useSignal(options.get('theme'));
  const showControlPanel = useSignal(options.get('showControlPanel'));

  const toggleControlPanel = () => {
    showControlPanel.value = !showControlPanel.value;
    options.set('showControlPanel', showControlPanel.value);
  };

  return (
    <Fragment>
      <div
        onClick={toggleControlPanel}
        data-theme={currentTheme.value}
        class={`group w-12 h-12 fixed top-[60%] left-[-20px] cursor-pointer bg-transparent fill-base-content ${className}`} // 使用 className
      >
        <div class="w-full h-full origin origin-[bottom_center] transition-all duration-200 group-hover:translate-x-[5px] group-hover:rotate-[20deg] opacity-50 group-hover:opacity-90">
          {/* <CatIcon /> */}
        </div>
      </div>
      <section
        data-theme={currentTheme.value}
        class={cx(
          'card card-compact bg-base-100 fixed border shadow-xl w-80 leading-loose text-base-content px-4 py-3 rounded-box border-solid border-neutral-content border-opacity-50 left-8 top-8 transition-transform duration-500',
          showControlPanel.value ? 'translate-x-0 transform-none' : 'translate-x-[-500px]',
        )}
      >
        <header class="flex items-center h-9">
          <h2 class="font-semibold leading-none text-xl m-0 flex-grow">Web Exporter</h2>
          <div
            onClick={toggleControlPanel}
            class="w-9 h-9 cursor-pointer flex justify-center items-center transition-colors duration-200 rounded-full hover:bg-base-200"
          >
            {/* <IconX /> */}
          </div>
        </header>
        <p class="text-sm text-base-content text-opacity-70 mb-1 leading-none">
          {t('Browse around to capture more data.')}
        </p>
        <div class="divider mt-0 mb-0"></div>
        <main>{/* Extensions UI */}</main>
      </section>
    </Fragment>
  );
}
